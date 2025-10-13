0/4. 
```sql
SELECT croisnum FROM croisieres
WHERE arrport = (
SELECT skport FROM skippers
WHERE sknom = 'PAUL'
LIMIT 1
)
```
```sql
SELECT DISTINCT sknom FROM skippers
JOIN croisieres USING(sknum)
JOIN bateaux USING(batnum)
WHERE capacite < (
    SELECT min(capacite) FROM bateaux
    WHERE batport = 'AJACCIO'
)
```
0/4.4
SELECT batport, min(capacite) FROM bateaux
GROUP BY batport
HAVING(batport)

2.
SELECT sknom FROM skippers
JOIN croisieres USING (sknum)
GROUP BY sknom
HAVING COUNT(croisnum) >= 2

3.
SELECT batnum, COUNT(croisnum) FROM bateaux
JOIN croisieres USING(batnum)
WHERE capacite > 5
GROUP BY batnum
HAVING COUNT(croisnum) > 3

4.
SELECT sknum FROM skippers
JOIN croisieres USING(sknum)
JOIN bateaux USING(batnum)
WHERE batport = 'AJACCIO'
GROUP BY sknum
HAVING COUNT(DISTINCT batnum)=(
    SELECT COUNT(batnum) FROM bateaux
    WHERE batport = 'AJACCIO'
	)

5. 
