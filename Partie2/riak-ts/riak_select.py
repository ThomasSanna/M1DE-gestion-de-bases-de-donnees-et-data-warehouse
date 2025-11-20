
from riak import RiakClient
from riak.datatypes import Datatype
import time
import traceback
from datetime import datetime

try:
    client = RiakClient(protocol='pbc', host='localhost', pb_port=8087)
    print("[OK] Client Riak cree")
except Exception as e:
    print("[ERREUR] Impossible de creer le client Riak: {0}".format(e))
    traceback.print_exc()
    exit(1)

table_name = 'temperature_data'

current_time = int(time.time() * 1000)  # timestamp en millisecondes
t0 = current_time
t1 = current_time + (16 * 60 * 1000) # +16 minutes (Quantum suivant)
t2 = current_time + (32 * 60 * 1000) # +32 minutes (Quantum encore apres)

print("\n=== ETAPE 5: LECTURE ET VISUALISATION DES CLUSTERS ===")
print("Lecture des donnees sur une large plage pour voir les differents clusters...")
try:
    # Calculer la plage de temps pour la requête (assez large pour tout couvrir)
    time_start = t0 - 60000
    time_end = t2 + 60000
    
    select_query = """
    SELECT * FROM {0}
    WHERE station_id = 'station_01'
    AND sensor_id = 'sensor_A'
    AND time >= {1}
    AND time <= {2}
    """.format(table_name, time_start, time_end)
    
    result = client.ts_query(table_name, select_query)
    print("[OK] Donnees recuperees. Organisation par tranches de 15 minutes (Quantum):")
    
    if result and hasattr(result, 'rows') and result.rows:
        print(result.rows)
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