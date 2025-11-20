from riak import RiakClient
from riak.datatypes import Datatype
import time
import traceback
from datetime import datetime

# Configuration de la connexion à Riak TS dans Docker
# Riak TS nécessite le protocole Protocol Buffers (port 8087) pour les fonctionnalités Time Series
print("\n=== ETAPE 1: CONNEXION ===")
print("Connexion a Riak TS sur localhost:8087 (Protocol Buffers)...")
try:
    client = RiakClient(protocol='pbc', host='localhost', pb_port=8087)
    print("[OK] Client Riak cree")
except Exception as e:
    print("[ERREUR] Impossible de creer le client Riak: {0}".format(e))
    traceback.print_exc()
    exit(1)

# Nom de la table
table_name = 'temperature_data'

# 1. Créer une table avec quantum
print("\n=== ETAPE 2: CREATION DE LA TABLE ===")
# En Riak TS, on doit définir une structure de table avec un quantum pour les séries temporelles
# Le QUANTUM(time, 15, 'm') signifie que les données sont physiquement regroupées par tranches de 15 minutes.
print("Definition de la table avec un QUANTUM de 15 minutes.")
print("Cela signifie que les donnees seront stockees ensemble par blocs de 15 minutes (clusters temporels).")
create_table_query = """
CREATE TABLE temperature_data (
    station_id VARCHAR NOT NULL,
    sensor_id VARCHAR NOT NULL,
    time TIMESTAMP NOT NULL,
    temperature DOUBLE,
    humidity DOUBLE,
    PRIMARY KEY (
        (station_id, sensor_id, QUANTUM(time, 15, 'm')),
        station_id, sensor_id, time
    )
)
""".format(table_name)

print("Creation de la table '{0}'...".format(table_name))
try:
    # Exécuter la requête de création
    table = client.table(table_name)
    result = client.ts_query(table_name, create_table_query)
    print("[OK] Table creee avec succes!")
except Exception as e:
    print("Erreur lors de la creation de la table: {0}".format(str(e) if str(e) else type(e).__name__))
    print("(Si la table existe deja, ceci est normal)")

# Attendre un peu pour que Riak traite la création
time.sleep(2)

# 2. Vérifier que la table a bien été créée
print("\n=== ETAPE 3: VERIFICATION DE LA TABLE ===")
print("Verification de l'existence de la table '{0}'...".format(table_name))
try:
    # Méthode 1: Essayer de décrire la table
    describe_query = "DESCRIBE {0}".format(table_name)
    result = client.ts_query(table_name, describe_query)
    print("[OK] La table '{0}' existe!".format(table_name))
    print("\nStructure de la table:")
    if result and hasattr(result, 'rows') and result.rows:
        for row in result.rows:
            print("  {0}".format(row)) # [nom, type, nullable, partition_key_ordinal, local_key_ordinal, quantum_size, quantum_unit, ...]
    else:
        print("  (Structure recuperee)")
except Exception as e:
    print("[ERREUR] Erreur lors de la verification: {0}".format(str(e) if str(e) else type(e).__name__))

# 3. Insérer des données de test
print("\n=== ETAPE 4: INSERTION DE DONNEES (DEMONSTRATION DES CLUSTERS) ===")
print("Insertion de donnees reparties sur plusieurs quantums de 15 minutes...")
current_time = int(time.time() * 1000)  # timestamp en millisecondes

# Création de timestamps espacés de plus de 15 minutes pour tomber dans des quantums différents
t0 = current_time
t1 = current_time + (16 * 60 * 1000) # +16 minutes (Quantum suivant)
t2 = current_time + (32 * 60 * 1000) # +32 minutes (Quantum encore apres)

print("  - Donnee 1 (T0): {0}".format(datetime.fromtimestamp(t0/1000).strftime('%H:%M:%S')))
print("  - Donnee 2 (T0 + 16min): {0} -> Nouveau cluster 15min".format(datetime.fromtimestamp(t1/1000).strftime('%H:%M:%S')))
print("  - Donnee 3 (T0 + 32min): {0} -> Nouveau cluster 15min".format(datetime.fromtimestamp(t2/1000).strftime('%H:%M:%S')))

insert_data = [
    ['station_01', 'sensor_A', t0, 22.5, 65.0],
    ['station_01', 'sensor_B', t0 + 1000, 23.1, 67.2],
    ['station_02', 'sensor_A', t0 + 2000, 21.8, 63.5],
    # Données dans le prochain quantum
    ['station_01', 'sensor_A', t1, 24.0, 60.0],
    # Données dans le quantum suivant
    ['station_01', 'sensor_A', t2, 25.5, 58.0],
]

try:
    table = client.table(table_name)
    ts_obj = table.new(insert_data) # Créer un objet Time Series avec les données. Il faudra ensuite appeler store() pour vraiment insérer.
    ts_obj.store()
    print("[OK] enregistrements inseres")
except Exception as e:
    print("[ERREUR] Erreur lors de l'insertion: {0}".format(str(e) if str(e) else type(e).__name__))
    traceback.print_exc()

# 4. Requêter les données pour vérifier
print("\n=== ETAPE 5: LECTURE ET VISUALISATION DES CLUSTERS ===")
print("Lecture des donnees sur une large plage pour voir les differents clusters...")
try:
    # Calculer la plage de temps pour la requête (assez large pour tout couvrir)
    time_start = t0 - 60000
    time_end = t2 + 60000
    
    select_query = """
    SELECT * FROM temperature_data
    WHERE station_id = 'station_01'
    AND sensor_id = 'sensor_A'
    AND time >= {1}
    AND time <= {2}
    """.format(table_name, time_start, time_end)
    
    result = client.ts_query(table_name, select_query)
    print("[OK] Donnees recuperees. Organisation par tranches de 15 minutes (Quantum):")
    
    if result and hasattr(result, 'rows') and result.rows:
        print(result)
        # Tri des résultats par temps
        sorted_rows = sorted(result.rows, key=lambda x: x[2])
        
        current_quantum_start = -1
        
        for row in sorted_rows:
            ts = row[2]
            dt = datetime.fromtimestamp(ts/1000)
            # Calcul du début du quantum de 15 min (0, 15, 30, 45)
            minute_quantum = (dt.minute // 15) * 15
            quantum_start_dt = dt.replace(minute=minute_quantum, second=0, microsecond=0)
            quantum_ts = int(quantum_start_dt.timestamp() * 1000)
            
            if quantum_ts != current_quantum_start:
                end_minute = minute_quantum + 15
                end_dt = quantum_start_dt.replace(minute=0, hour=quantum_start_dt.hour+1) if end_minute >= 60 else quantum_start_dt.replace(minute=end_minute)
                print("\n--- CLUSTER 15 MIN: {0} a {1} ---".format(quantum_start_dt.strftime('%H:%M'), end_dt.strftime('%H:%M')))
                current_quantum_start = quantum_ts
            
            print("  Time: {0} | Temp: {1} | Hum: {2}".format(dt.strftime('%H:%M:%S'), row[3], row[4]))
    else:
        print("  (Aucune donnee trouvee)")
        
except Exception as e:
    print("[ERREUR] Erreur lors de la lecture: {0}".format(str(e) if str(e) else type(e).__name__))
    traceback.print_exc()

# 5. Afficher un résumé
print("\n" + "="*60)
print("RESUME FINAL")
print("="*60)
print("Table: {0}".format(table_name))
print("Quantum: 15 minutes (Les donnees sont stockees par blocs de 15min)")
print("Cle primaire: (station_id, sensor_id, QUANTUM(time, 15, 'm')), station_id, sensor_id, time")
print("  -> La premiere partie est la cle de partition (Partition Key)")
print("  -> La seconde partie est la cle locale (Local Key)")
print("Colonnes: station_id, sensor_id, time, temperature, humidity")
print("="*60)

# Fermer la connexion
print("\nFermeture de la connexion...")
print("[OK] Script termine!")
client.close()
