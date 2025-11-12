-- Création de la table BANQUE avec 50 lignes réalistes
CREATE TABLE BANQUE (
  ID_BNK INT PRIMARY KEY,
  NOM_BNK VARCHAR(60) NOT NULL,
  DESC_BNK VARCHAR(200),
  VILLE VARCHAR(100) -- Ajout de la colonne ville
);

-- Insertion de 50 banques réalistes avec leur ville
INSERT INTO BANQUE (ID_BNK, NOM_BNK, DESC_BNK, VILLE) VALUES
(1, 'BNP Paribas', 'Banque Nationale de Paris - Paribas', 'Paris'),
(2, 'Société Générale', 'Société Générale', 'Marseille'),
(3, 'Crédit Agricole', 'Crédit Agricole', 'Lyon'),
(4, 'Crédit Mutuel', 'Crédit Mutuel', 'Bordeaux'),
(5, 'Caisse d''Épargne', 'Caisse d''Épargne', 'Nice'),
(6, 'Banque Populaire', 'Banque Populaire', 'Toulouse'),
(7, 'LCL', 'Le Crédit Lyonnais', 'Nantes'),
(8, 'HSBC France', 'HSBC France', 'Strasbourg'),
(9, 'La Banque Postale', 'La Banque Postale', 'Montpellier'),
(10, 'Boursorama Banque', 'Boursorama Banque', 'Rennes'),
(11, 'ING Direct', 'ING Direct', 'Le Havre'),
(12, 'Fortuneo', 'Fortuneo Banque', 'Saint-Étienne'),
(13, 'Monabanq', 'Monabanq', 'Toulon'),
(14, 'Hello bank!', 'Hello bank!', 'Angers'),
(15, 'AXA Banque', 'AXA Banque', 'Grenoble'),
(16, 'Orange Bank', 'Orange Bank', 'Dijon'),
(17, 'N26', 'N26 Bank', 'Reims'),
(18, 'Revolut', 'Revolut Bank', 'Le Mans'),
(19, 'Nickel', 'Compte Nickel', 'Aix-en-Provence'),
(20, 'Banque Palatine', 'Banque Palatine', 'Clermont-Ferrand'),
(21, 'Crédit du Nord', 'Crédit du Nord', 'Limoges'),
(22, 'Barclays France', 'Barclays Bank', 'Perpignan'),
(23, 'Bred Banque Populaire', 'Bred Banque Populaire', 'Metz'),
(24, 'CIC', 'Crédit Industriel et Commercial', 'Orléans'),
(25, 'BNP Paribas Fortis', 'BNP Paribas Fortis', 'Besançon'),
(26, 'Crédit Maritime', 'Crédit Maritime', 'Mulhouse'),
(27, 'Banque Chalus', 'Banque Chalus', 'Rouen'),
(28, 'Banque Courtois', 'Banque Courtois', 'Nancy'),
(29, 'Banque Laydernier', 'Banque Laydernier', 'Caen'),
(30, 'Banque Kolb', 'Banque Kolb', 'Annecy'),
(31, 'Banque Nuger', 'Banque Nuger', 'Poitiers'),
(32, 'Banque Rhône-Alpes', 'Banque Rhône-Alpes', 'Laval'),
(33, 'Banque Tarneaud', 'Banque Tarneaud', 'Valence'),
(34, 'Banque BCP', 'Banque BCP', 'Béziers'),
(35, 'Banque Privée 1818', 'Banque Privée 1818', 'Quimper'),
(36, 'Banque Wormser Frères', 'Banque Wormser Frères', 'Colmar'),
(37, 'Banque Hottinguer', 'Banque Hottinguer', 'La Rochelle'),
(38, 'Banque Transatlantique', 'Banque Transatlantique', 'Bayonne'),
(39, 'Banque Delubac', 'Banque Delubac & Cie', 'Ajaccio'),
(40, 'Banque de Savoie', 'Banque de Savoie', 'Bastia'),
(41, 'Banque Dupuy de Parseval', 'Banque Dupuy de Parseval', 'Vannes'),
(42, 'Banque Martin Maurel', 'Banque Martin Maurel', 'Tarbes'),
(43, 'Banque Neuflize OBC', 'Banque Neuflize OBC', 'Brive-la-Gaillarde'),
(44, 'Banque Populaire Grand Ouest', 'Banque Populaire Grand Ouest', 'Lorient'),
(45, 'Banque Populaire Alsace Lorraine Champagne', 'Banque Populaire Alsace Lorraine Champagne', 'Thionville'),
(46, 'Banque Populaire Occitane', 'Banque Populaire Occitane', 'Albi'),
(47, 'Banque Populaire Méditerranée', 'Banque Populaire Méditerranée', 'Bourg-en-Bresse'),
(48, 'Banque Populaire Auvergne Rhône Alpes', 'Banque Populaire Auvergne Rhône Alpes', 'Épinal'),
(49, 'Banque de France', 'Banque de France', 'Troyes'),
(50, 'Banque Européenne', 'Banque Européenne de Crédit', 'Mâcon');

-- Création de la séquence pour les clients
CREATE SEQUENCE SEQ_CLIENT_BANQUE 
START WITH 1 
INCREMENT BY 1 
MAXVALUE 100000000;

-- Création de la table CLIENT avec une colonne ville
CREATE TABLE CLIENT (
  ID_CLIENT BIGINT PRIMARY KEY,
  NOM_CLIENT VARCHAR(120) NOT NULL,
  TEL_PORTABLE VARCHAR(20),
  ADR_DOMICILE VARCHAR(250),
  DATE_NAISSANCE DATE,
  ID_BNK INT NOT NULL,
  VILLE VARCHAR(100), -- Ajout de la colonne ville
  CONSTRAINT FK_CLIENT_REF_BANQUE FOREIGN KEY (ID_BNK) REFERENCES BANQUE (ID_BNK)
);

-- Insertion de 200 000 clients avec des données aléatoires répartis dans les villes
DO $$
DECLARE
  i INTEGER;
  random_year INTEGER;
  random_day INTEGER;
  villes TEXT[] := ARRAY['Paris', 'Marseille', 'Lyon', 'Bordeaux', 'Nice', 'Toulouse', 'Nantes', 'Strasbourg', 'Montpellier', 'Rennes', 'Le Havre', 'Saint-Étienne', 'Toulon', 'Angers', 'Grenoble', 'Dijon', 'Reims', 'Le Mans', 'Aix-en-Provence', 'Clermont-Ferrand', 'Limoges', 'Perpignan', 'Metz', 'Orléans', 'Besançon', 'Mulhouse', 'Rouen', 'Nancy', 'Caen', 'Annecy', 'Poitiers', 'Laval', 'Valence', 'Béziers', 'Quimper', 'Colmar', 'La Rochelle', 'Bayonne', 'Ajaccio', 'Bastia', 'Vannes', 'Tarbes', 'Brive-la-Gaillarde', 'Lorient', 'Thionville', 'Albi', 'Bourg-en-Bresse', 'Épinal', 'Troyes', 'Mâcon'];
BEGIN
  FOR i IN 1..200000 LOOP
    -- Générer un nombre de jours aléatoire pour les dates de naissance entre 1960 et 2000
    random_year := 1960 + floor(random() * (2000 - 1960 + 1));
    random_day := floor(random() * 365);

    -- Insertion dans la table CLIENT
    INSERT INTO CLIENT (ID_CLIENT, NOM_CLIENT, TEL_PORTABLE, ADR_DOMICILE, DATE_NAISSANCE, ID_BNK, VILLE)
    SELECT nextval('SEQ_CLIENT_BANQUE') AS ID_CLIENT,
           'client' || currval('SEQ_CLIENT_BANQUE') AS NOM_CLIENT,
           '+33' || (600000000 + currval('SEQ_CLIENT_BANQUE')) AS TEL_CLIENT,
           'adresse' || currval('SEQ_CLIENT_BANQUE') AS ADR_CLIENT,
           (make_date(random_year, 1, 1) + interval '1 day' * random_day)::date AS DN_CLIENT,
           b1.ID_BNK,
           villes[floor(random() * array_length(villes, 1) + 1)] -- Choix aléatoire de la ville pour chaque client
    FROM BANQUE b1
    ORDER BY random() -- Choix aléatoire de la banque pour chaque client
    LIMIT 1;
  END LOOP;
END $$;




