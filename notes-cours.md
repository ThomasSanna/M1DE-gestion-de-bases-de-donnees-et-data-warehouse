# Notes cours Gestion de BDD et data Warehouse

## Cours 1 17/09/2025

### Pourquoi utiliser une BDD ?

#### Comparaison avec des fichiers plats
- **Fichiers plats** : 
  - Avantages : Simplicité, Facilité d'implémentation
  - Inconvénients : Redondance des données, Difficulté de gestion des accès concurrents, Problèmes d'intégrité des données, Difficulté de recherche et de mise à jour
- **Bases de données** :
    - Avantages : Gestion efficace des données, Support des accès concurrents, Maintien de l'intégrité des données, Facilite la recherche et la mise à jour

#### Comparaison avec des feuilles de calcul (Excel, Google Sheets)

- **Feuilles de calcul** :
  - Avantages : Facilité d'utilisation, Flexibilité, Outils de visualisation intégrés
  - Inconvénients : Difficulté à gérer de grandes quantités de données, Risque d'erreurs humaines, Manque de fonctionnalités avancées pour la gestion des données
- **Bases de données** :
    - Avantages : Scalabilité, Sécurité, Fonctionnalités avancées (transactions, indexation, etc.)

### Qu'est ce qu'un modèle de données ?
- Un modèle de données est une représentation abstraite de la structure des données dans une base de données.
- Il définit les entités, les attributs et les relations entre les entités.

Exemple : 
```plaintext
Entité : Étudiant
Attributs : ID, Nom, Prénom, Date de naissance
Entité : Cours
Attributs : ID, Titre, Description
Relation : Inscription (Étudiant, Cours)
```

Les MCDs (Modèles Conceptuels de Données) sont utilisés pour représenter graphiquement les entités, les attributs et les relations.

### Manipulation non-procédurale des données

- Utilisation de langages de requête déclaratifs comme SQL (Structured Query Language).
- Permet de spécifier ce que l'on veut faire avec les données sans décrire comment le faire.

### Indépendance physique et logique

- **Indépendance logique** : Capacité à modifier le schéma logique sans affecter les applications qui utilisent la base de données.
- **Indépendance physique** : Capacité à modifier le schéma physique sans affecter le schéma logique.

### Intégrité référentielle

- Assure que les relations entre les tables restent cohérentes.
- Par exemple, si une table "Commandes" fait référence à une table "Clients", si le client 5 est entré pour commande, mais qu'il n'existe pas dans la table "Clients", cela viole l'intégrité référentielle.
- L'intégrité référentielle est vérifiée lorsque des opérations de modification (INSERT, UPDATE, DELETE) sont effectuées.