from pymongo import MongoClient

uri = "mongodb://root:root@localhost:27017/"
client = MongoClient(uri)
# print(client.list_database_names())

db = client.config
# print(db.list_collection_names())

db = client.test_db
print(client.list_database_names()) # pas encore créée

