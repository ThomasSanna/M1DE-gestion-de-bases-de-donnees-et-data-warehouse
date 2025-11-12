SeancesLecture = (**SeanceID**, **MembreID**, **LivreID**, MembreNom, MembreEmail, LivreTitre, Auteur, DateSeance, Genres)

Ex : (1, 1001, 2001, "Alice Dupont", "alice.dupont@email.com", "Le Petit Prince", "Antoine de Saint-Exupéry", "20/04/2024", "Conte, Philosophique")

# Exo 1/2
## 1NF

1NF n'est pas respectée.

### Problèmes
Des attributs sont multivalués (Genre ("Conte, Philosophique"), MembreNom (Alice Dupont), Auteur) et doivent être
décomposés.

### Solution
Décomposer la relation en plusieurs relations pour éliminer les attributs multivalués.
Relations proposées :
- MembreNom se décompose en deux colonnes : MembrePrenom et MembreNom.
- Genres doit être décomposé en une relation séparée pour gérer les multiples genres associés à chaque livre.
- Auteur se décompose en deux colonnes : AuteurPrenom et AuteurNom.

### Relations finales :
```
SeancesLecture = (**SeanceID**, **MembreID**, **LivreID**, MembreNom, MembrePrenom,
MembreEmail, LivreTitre, AuteurNom, AuteurPrenom, DateSeance),

Genres = (**LivreID**, **Genre**)
```

