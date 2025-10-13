CREATE TABLE sortie(
    numero serial PRIMARY KEY,
    lieu varchar(80),
    datesortie date
);

INSERT INTO sortie (lieu, datesortie) VALUES ('Ajaccio', '2025-04-20');