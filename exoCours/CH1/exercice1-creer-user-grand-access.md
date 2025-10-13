crée un utilisateur dans le serveur correspondant :

CREATE USER monsieur WITH PASSWORD '1234';

donne le droit d'inserer des tuples à l'utilisateur monsieur :

GRANT INSERT ON TABLE utilisateurs TO monsieur;