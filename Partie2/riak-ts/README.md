# Démonstration Riak TS - Time Series Database

## 📋 Vue d'ensemble

Ce projet démontre l'utilisation de **Riak TS**, une base de données optimisée pour les séries temporelles (Time Series), avec un focus particulier sur le concept de **QUANTUM** pour le partitionnement temporel des données.

## 🎯 Objectifs de la démonstration

1. **Connexion à Riak TS** via le protocole Protocol Buffers (port 8087)
2. **Création d'une table** avec un QUANTUM de 15 minutes
3. **Insertion de données** réparties sur plusieurs clusters temporels
4. **Visualisation** de l'organisation des données par tranches de 15 minutes
5. **Compréhension** du partitionnement temporel et de ses avantages

## 🗂️ Structure du projet

```
riak-ts/
├── script.py                    # Script principal de démonstration
├── requirements.txt             # Dépendances Python (riak)
├── README.md                    # Ce fichier
├── EXPLICATION_QUANTUM.md       # Explication détaillée du concept QUANTUM
└── RESULTAT_EXECUTION.md        # Résultats d'exécution avec analyses
```

## 🚀 Prérequis

### Docker avec Riak TS
Assurez-vous d'avoir un conteneur Riak TS en cours d'exécution :
```bash
docker-compose -f ../docker/mongo.yml up -d
```

### Environnement Python
1. Créer un environnement virtuel :
```bash
python -m venv venv
```

2. Activer l'environnement :
```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Linux/Mac
source venv/bin/activate
```

3. Installer les dépendances :
```bash
pip install -r requirements.txt
```

## 💻 Exécution

```bash
python script.py
```

## 📊 Concept clé : QUANTUM

Le **QUANTUM** est un paramètre fondamental dans Riak TS qui détermine comment les données temporelles sont physiquement organisées et partitionnées.

### Définition dans notre exemple
```sql
PRIMARY KEY (
    (station_id, sensor_id, QUANTUM(time, 15, 'm')),
    station_id, sensor_id, time
)
```

**Signification** :
- `QUANTUM(time, 15, 'm')` : Les données sont regroupées par blocs de **15 minutes**
- Toutes les données tombant dans la même tranche de 15 minutes sont stockées ensemble
- Les tranches sont alignées sur les multiples de 15 : `00:00-00:15`, `00:15-00:30`, etc.

### Avantages du QUANTUM
- ✅ **Performance** : Lectures plus rapides pour les requêtes par plage temporelle
- ✅ **Distribution** : Répartition équilibrée des données dans le cluster
- ✅ **Localité** : Données proches dans le temps stockées ensemble
- ✅ **Optimisation** : Requêtes ciblant un quantum spécifique sont ultra-rapides

## 🔑 Structure de la clé primaire

La clé primaire est divisée en deux parties :

### 1. **Partition Key** (Clé de partition)
```
(station_id, sensor_id, QUANTUM(time, 15, 'm'))
```
- Détermine sur quel nœud du cluster les données seront stockées
- Combine l'identité du capteur avec la tranche temporelle

### 2. **Local Key** (Clé locale)
```
station_id, sensor_id, time
```
- Détermine l'ordre des données au sein d'une partition
- Permet des recherches rapides par timestamp exact

## 📈 Données de démonstration

Le script insère 5 enregistrements répartis sur 3 clusters temporels différents :

| Cluster | Plage horaire | Nombre de données |
|---------|---------------|-------------------|
| Cluster 1 | 16:30 - 16:45 | 1 donnée (16:31:38) |
| Cluster 2 | 16:45 - 17:00 | 1 donnée (16:47:38) |
| Cluster 3 | 17:00 - 17:15 | 1 donnée (17:03:38) |

## 📚 Pour aller plus loin

- Consulter `EXPLICATION_QUANTUM.md` pour une explication détaillée avec diagrammes
- Consulter `RESULTAT_EXECUTION.md` pour l'analyse complète des résultats

## 🔗 Ressources

- [Documentation Riak TS](https://docs.riak.com/riak/ts/)
- [Guide des séries temporelles](https://docs.riak.com/riak/ts/latest/using/querying/)
- [Python Client Riak](https://github.com/basho/riak-python-client)
