# Exercice Bilan CH4

## Question 1

```sql
SELECT relname, relpages, reltuples FROM pg_class
WHERE relname IN ('banque', 'client')
```
| relname | relpages | reltuples |
|---------|----------|-----------|
| banque  |  1   |   50 |
| client  |   2317   |    200000 |

## Question 2

### 1.
```sql
EXPLAIN ANALYZE
SELECT id_client, nom_client FROM client
WHERE date_naissance > '1965-01-01'
```

```
"Seq Scan on client  (cost=0.00..4817.00 rows=175913 width=20) (actual time=0.011..18.373 rows=175425 loops=1)"
"  Filter: (date_naissance > '1965-01-01'::date)"
"  Rows Removed by Filter: 24575"
"Planning Time: 0.065 ms"
"Execution Time: 23.516 ms"
```

### 2.
```sql
CREATE INDEX idx_date_naissance ON client(date_naissance)
```

### 3.
```
"Seq Scan on client  (cost=0.00..4817.00 rows=175913 width=20) (actual time=0.013..22.143 rows=175425 loops=1)"
"  Filter: (date_naissance > '1965-01-01'::date)"
"  Rows Removed by Filter: 24575"
"Planning Time: 0.416 ms"
"Execution Time: 29.099 ms"
```

On peut voir qu'après création de l'index, le plan d'exécution n'a pas changé. En effet, PostgreSQL a estimé que le scan séquentiel était plus efficace que l'utilisation de l'index dans ce cas précis. Cela peut être dû au fait qu'une grande partie des lignes (175425 sur 200000) satisfont la condition, rendant l'utilisation de l'index moins avantageuse.

## Question 3
### 1.
```sql
EXPLAIN ANALYZE
SELECT nom_bnk, COUNT(1)
FROM banque
JOIN client USING(id_bnk)
GROUP BY nom_bnk
HAVING COUNT(1)>0
```
```
"Finalize GroupAggregate  (cost=5420.75..5427.38 rows=17 width=25) (actual time=39.988..42.322 rows=50 loops=1)"
"  Group Key: banque.nom_bnk"
"  Filter: (count(1) > 0)"
"  ->  Gather Merge  (cost=5420.75..5426.50 rows=50 width=25) (actual time=39.979..42.298 rows=100 loops=1)"
"        Workers Planned: 1"
"        Workers Launched: 1"
"        ->  Sort  (cost=4420.74..4420.87 rows=50 width=25) (actual time=37.069..37.074 rows=50 loops=2)"
"              Sort Key: banque.nom_bnk"
"              Sort Method: quicksort  Memory: 27kB"
"              Worker 0:  Sort Method: quicksort  Memory: 27kB"
"              ->  Partial HashAggregate  (cost=4418.83..4419.33 rows=50 width=25) (actual time=37.001..37.007 rows=50 loops=2)"
"                    Group Key: banque.nom_bnk"
"                    Batches: 1  Memory Usage: 24kB"
"                    Worker 0:  Batches: 1  Memory Usage: 24kB"
"                    ->  Hash Join  (cost=2.12..3830.60 rows=117647 width=17) (actual time=0.078..21.306 rows=100000 loops=2)"
"                          Hash Cond: (client.id_bnk = banque.id_bnk)"
"                          ->  Parallel Seq Scan on client  (cost=0.00..3493.47 rows=117647 width=4) (actual time=0.008..6.259 rows=100000 loops=2)"
"                          ->  Hash  (cost=1.50..1.50 rows=50 width=21) (actual time=0.037..0.038 rows=50 loops=2)"
"                                Buckets: 1024  Batches: 1  Memory Usage: 11kB"
"                                ->  Seq Scan on banque  (cost=0.00..1.50 rows=50 width=21) (actual time=0.016..0.022 rows=50 loops=2)"
"Planning Time: 0.165 ms"
"Execution Time: 42.371 ms"
```

### 2.

L'algorithme de jointure utilisé est une jointure par hachage (Hash Join).

Le coût total de l'exécution 5427.38 en coût estimé et 42.371 ms en temps réel.

### 3.
```sql
CREATE INDEX idx_id_bnk ON client(id_bnk)
```
### 4.
```sql
EXPLAIN ANALYZE
SELECT nom_bnk, COUNT(1)
FROM banque
JOIN client USING(id_bnk)
GROUP BY nom_bnk
HAVING COUNT(1)>0
```
```
"Finalize GroupAggregate  (cost=4796.05..4802.67 rows=17 width=25) (actual time=45.118..47.326 rows=50 loops=1)"
"  Group Key: banque.nom_bnk"
"  Filter: (count(1) > 0)"
"  ->  Gather Merge  (cost=4796.05..4801.80 rows=50 width=25) (actual time=45.111..47.297 rows=97 loops=1)"
"        Workers Planned: 1"
"        Workers Launched: 1"
"        ->  Sort  (cost=3796.04..3796.16 rows=50 width=25) (actual time=41.482..41.488 rows=48 loops=2)"
"              Sort Key: banque.nom_bnk"
"              Sort Method: quicksort  Memory: 27kB"
"              Worker 0:  Sort Method: quicksort  Memory: 27kB"
"              ->  Partial HashAggregate  (cost=3794.13..3794.63 rows=50 width=25) (actual time=41.382..41.391 rows=48 loops=2)"
"                    Group Key: banque.nom_bnk"
"                    Batches: 1  Memory Usage: 24kB"
"                    Worker 0:  Batches: 1  Memory Usage: 24kB"
"                    ->  Hash Join  (cost=2.42..3205.89 rows=117647 width=17) (actual time=0.187..23.949 rows=100000 loops=2)"
"                          Hash Cond: (client.id_bnk = banque.id_bnk)"
"                          ->  Parallel Index Only Scan using idx_id_bnk on client  (cost=0.29..2868.77 rows=117647 width=4) (actual time=0.090..9.150 rows=100000 loops=2)"
"                                Heap Fetches: 0"
"                          ->  Hash  (cost=1.50..1.50 rows=50 width=21) (actual time=0.068..0.069 rows=50 loops=2)"
"                                Buckets: 1024  Batches: 1  Memory Usage: 11kB"
"                                ->  Seq Scan on banque  (cost=0.00..1.50 rows=50 width=21) (actual time=0.046..0.052 rows=50 loops=2)"
"Planning Time: 0.275 ms"
"Execution Time: 47.383 ms"
```

L'algorithme de jointure utilisé est toujours une jointure par hachage (Hash Join).

Le coût total de l'exécution est maintenant de 4802.67 en coût estimé et 47.383 ms en temps réel, soit une légère amélioration par rapport à l'exécution précédente.

## Question 4

### 1.
```sql
EXPLAIN ANALYZE
SELECT id_client, nom_client
FROM client
JOIN banque USING(id_bnk)
WHERE nom_bnk = 'BNP Paribas'
```
```
"Nested Loop  (cost=47.30..2526.71 rows=4000 width=20) (actual time=1.994..5.209 rows=4054 loops=1)"
"  ->  Seq Scan on banque  (cost=0.00..1.62 rows=1 width=4) (actual time=0.048..0.057 rows=1 loops=1)"
"        Filter: ((nom_bnk)::text = 'BNP Paribas'::text)"
"        Rows Removed by Filter: 49"
"  ->  Bitmap Heap Scan on client  (cost=47.30..2485.09 rows=4000 width=24) (actual time=1.934..4.587 rows=4054 loops=1)"
"        Recheck Cond: (id_bnk = banque.id_bnk)"
"        Heap Blocks: exact=1944"
"        ->  Bitmap Index Scan on idx_id_bnk  (cost=0.00..46.30 rows=4000 width=0) (actual time=1.106..1.106 rows=4054 loops=1)"
"              Index Cond: (id_bnk = banque.id_bnk)"
"Planning Time: 10.715 ms"
"Execution Time: 5.515 ms"
```

### 2.
L'algorithme de jointure utilisé est une jointure par hachage (Hash Join).

Le coût total de l'exécution est de 4888.14 en coût estimé et 26.879 ms en temps réel.

### 3.
```sql
CREATE INDEX idx_nom_bnk ON banque(nom_bnk)
```

### 4.
```sql
EXPLAIN ANALYZE
SELECT id_client, nom_client
FROM client
JOIN banque USING(id_bnk)
WHERE nom_bnk = 'BNP Paribas'
```
```
"Hash Join  (cost=1.64..4888.14 rows=4000 width=20) (actual time=0.031..28.776 rows=4054 loops=1)"
"  Hash Cond: (client.id_bnk = banque.id_bnk)"
"  ->  Seq Scan on client  (cost=0.00..4317.00 rows=200000 width=24) (actual time=0.007..11.284 rows=200000 loops=1)"
"  ->  Hash  (cost=1.62..1.62 rows=1 width=4) (actual time=0.014..0.016 rows=1 loops=1)"
"        Buckets: 1024  Batches: 1  Memory Usage: 9kB"
"        ->  Seq Scan on banque  (cost=0.00..1.62 rows=1 width=4) (actual time=0.007..0.011 rows=1 loops=1)"
"              Filter: ((nom_bnk)::text = 'BNP Paribas'::text)"
"              Rows Removed by Filter: 49"
"Planning Time: 0.194 ms"
"Execution Time: 28.948 ms"
```
L'algorithme de jointure utilisé est toujours une jointure par hachage (Hash Join).

Le coût total de l'exécution est toujours de 4888.14 en coût estimé et 28.948 ms en temps réel, soit une légère dégradation par rapport à l'exécution précédente. Cela peut s'expliquer par le fait que l'index créé n'est pas utilisé dans ce cas précis, car la table `banque` est très petite (seulement 50 lignes) et un scan séquentiel est plus efficace.

### 5.
Tous les noms de banques sont différents entre eux, donc un index sur `nom_bnk`serait dense, et donc pratique à utiliser. Cependant, la table `banque` est très petite (seulement 50 lignes), donc l'impact de l'index est négligeable dans ce cas précis.

## Question 5
### 1.
#### REQ4.0

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE nom_client = 'client10';
```

```
"Seq Scan on client  (cost=0.00..4817.00 rows=1 width=8) (actual time=0.035..16.980 rows=1 loops=1)"
"  Filter: ((nom_client)::text = 'client10'::text)"
"  Rows Removed by Filter: 199999"
"Planning Time: 0.251 ms"
"Execution Time: 17.035 ms"
```

#### REQ4.1

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE upper(nom_client) = 'CLIENT10';
```

```
"Gather  (cost=1000.00..5181.71 rows=1000 width=8) (actual time=0.214..33.261 rows=1 loops=1)"
"  Workers Planned: 1"
"  Workers Launched: 1"
"  ->  Parallel Seq Scan on client  (cost=0.00..4081.71 rows=588 width=8) (actual time=11.631..27.023 rows=0 loops=2)"
"        Filter: (upper((nom_client)::text) = 'CLIENT10'::text)"
"        Rows Removed by Filter: 100000"
"Planning Time: 0.050 ms"
"Execution Time: 33.279 ms"
```

#### REQ4.2

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE nom_client = lower('CLIENT10');
```

```
"Seq Scan on client  (cost=0.00..4817.00 rows=1 width=8) (actual time=0.012..9.994 rows=1 loops=1)"
"  Filter: ((nom_client)::text = 'client10'::text)"
"  Rows Removed by Filter: 199999"
"Planning Time: 0.165 ms"
"Execution Time: 10.009 ms"
```

La requête 4.1 est bien plus coûteuse car on effectue une fonction sur chaque ligne de la colonne `nom_client`, ce qui empêche l'utilisation d'un index. Les requêtes 4.0 et 4.2 sont similaires en termes de coût.

### 2.
```sql
CREATE INDEX idnom ON client(nom_client)
```

### 3.

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE nom_client = 'client10';
```

```
"Index Scan using idnom on client  (cost=0.42..8.44 rows=1 width=8) (actual time=0.070..0.072 rows=1 loops=1)"
"  Index Cond: ((nom_client)::text = 'client10'::text)"
"Planning Time: 0.729 ms"
"Execution Time: 0.089 ms"
```

#### REQ4.1

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE upper(nom_client) = 'CLIENT10';
```

```
"Gather  (cost=1000.00..5181.71 rows=1000 width=8) (actual time=0.198..39.577 rows=1 loops=1)"
"  Workers Planned: 1"
"  Workers Launched: 1"
"  ->  Parallel Seq Scan on client  (cost=0.00..4081.71 rows=588 width=8) (actual time=12.545..31.161 rows=0 loops=2)"
"        Filter: (upper((nom_client)::text) = 'CLIENT10'::text)"
"        Rows Removed by Filter: 100000"
"Planning Time: 0.052 ms"
"Execution Time: 39.595 ms"
```

#### REQ4.2

```sql
EXPLAIN ANALYZE
SELECT id_client
FROM client
WHERE nom_client = lower('CLIENT10');
```

```
"Seq Scan on client  (cost=0.00..4817.00 rows=1 width=8) (actual time=0.012..9.994 rows=1 loops=1)"
"  Filter: ((nom_client)::text = 'client10'::text)"
"  Rows Removed by Filter: 199999"
"Planning Time: 0.165 ms"
"Execution Time: 10.009 ms"
```
