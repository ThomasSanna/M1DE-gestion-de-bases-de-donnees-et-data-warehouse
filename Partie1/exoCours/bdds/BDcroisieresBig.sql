-- Création de la table 'bateaux'
CREATE TABLE bateaux (
    batnum VARCHAR(5) PRIMARY KEY,
    batnom VARCHAR(100) NOT NULL,
    batport VARCHAR(100) NOT NULL,
    capacite INTEGER NOT NULL
);

-- Création de la table 'skippers'
CREATE TABLE skippers (
    sknum SERIAL PRIMARY KEY,
    sknom VARCHAR(100) NOT NULL,
    skport VARCHAR(100) NOT NULL,
    salaire NUMERIC(10, 2) NOT NULL
);

-- Création de la table 'croisieres'
CREATE TABLE croisieres (
    croisnum VARCHAR(5) PRIMARY KEY,
    depport VARCHAR(50) DEFAULT 'AJACCIO',
    arrport VARCHAR(50),
    depdate DATE DEFAULT CURRENT_DATE,
    arrdate DATE DEFAULT CURRENT_DATE,
    batnum VARCHAR(5),
    sknum INTEGER,
    CONSTRAINT fk_bateaux FOREIGN KEY (batnum) REFERENCES bateaux(batnum),
    CONSTRAINT fk_skipper FOREIGN KEY (sknum) REFERENCES skippers(sknum)
);

CREATE OR REPLACE FUNCTION presence_chevauchement(
    p_batnum VARCHAR(5),
    p_sknum INTEGER,
    p_depdate DATE,
    p_arrdate DATE
) RETURNS BOOLEAN AS $$
DECLARE
    overlap_count INTEGER;
BEGIN
    SELECT COUNT(*)
    INTO overlap_count
    FROM croisieres
    WHERE (batnum = p_batnum OR sknum = p_sknum)
    AND (
        (p_depdate BETWEEN depdate AND arrdate) OR
        (p_arrdate BETWEEN depdate AND arrdate) OR
        (depdate BETWEEN p_depdate AND p_arrdate) OR
        (arrdate BETWEEN p_depdate AND p_arrdate)
    );

    RETURN overlap_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Insertion de données dans la table 'bateaux'
INSERT INTO bateaux (batnum, batnom, batport, capacite)
SELECT 
    CONCAT('B', LPAD(i::text, 4, '0')) AS batnum, 
    CONCAT('Bateau_', i) AS batnom, 
    CASE 
        WHEN i % 3 = 0 THEN 'AJACCIO' 
        WHEN i % 3 = 1 THEN 'BASTIA' 
        ELSE 'BASTIA' 
    END AS batport,
    (RANDOM() * 100 + 50)::INTEGER AS capacite
FROM generate_series(1, 1000) AS s(i);

-- Insertion de données dans la table 'skippers'
INSERT INTO skippers (sknom, skport, salaire)
SELECT 
    CONCAT('Skipper_', i) AS sknom, 
    CASE 
        WHEN i % 4 = 0 THEN 'AJACCIO' 
        WHEN i % 4 = 1 THEN 'BASTIA' 
        WHEN i % 4 = 2 THEN 'CALVI' 
        ELSE 'BONIFACIO' 
    END AS skport,
    ROUND((RANDOM() * 5000 + 2000)::NUMERIC, 2) AS salaire
FROM generate_series(1, 1000) AS s(i);

-- Insertion de données dans la table 'croisieres' en évitant les chevauchements
DO $$
DECLARE 
    i INT;
    depdate DATE;
    arrdate DATE;
    batnum VARCHAR(5);
    sknum INTEGER;
    is_valid BOOLEAN;
BEGIN
    FOR i IN 1..5000 LOOP
        batnum := CONCAT('B', LPAD((i % 1000 + 1)::text, 4, '0'));
        sknum := (i % 1000 + 1);
        is_valid := FALSE;

        -- Trouver des dates valides pour éviter les chevauchements
        WHILE NOT is_valid LOOP
            depdate := CURRENT_DATE + (RANDOM() * 30)::INTEGER;  -- Date de départ aléatoire dans les 30 prochains jours
            arrdate := depdate + (RANDOM() * 5 + 1)::INTEGER;    -- Date d'arrivée entre 1 et 5 jours après la date de départ

            -- Utiliser la fonction presence_chevauchement pour vérifier les conflits
            is_valid := NOT presence_chevauchement(batnum, sknum, depdate, arrdate) ;  -- Les dates sont valides, pas de chevauchement trouvé

        END LOOP;

        -- Insérer la croisière avec les dates validées
        INSERT INTO croisieres (croisnum, depport, arrport, depdate, arrdate, batnum, sknum)
        VALUES (
            CONCAT('C', LPAD(i::text, 4, '0')),
            CASE 
                WHEN i % 2 = 0 THEN 'AJACCIO' 
                ELSE 'MARSEILLE' 
            END,
            CASE 
                WHEN i % 2 = 0 THEN 'NICE' 
                ELSE 'TOULON' 
            END,
            depdate,
            arrdate,
            batnum,
            sknum
        );
    END LOOP;
END $$;

