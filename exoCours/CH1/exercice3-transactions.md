START TRANSACTION;
INSERT INTO bateaux (batnum, batnom, batport, capacite) VALUES ('B006', 'TITANIC', 'AJACCIO', 10);
INSERT INTO croisieres (croisnum, depport, arrport, depdate, arrdate, batnum, sknum) VALUES ('C011', 'AJACCIO', 'AJACCIO', '2024-07-15', '2024-07-16', 'B006', '1');
COMMIT;