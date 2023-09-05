from pymongo import MongoClient


mongo_uri = "mongodb+srv://noisetrack:gxSOOQ1JmUou0DFJ@cluster0.zojxrcv.mongodb.net/?retryWrites=true&w=majority"

try:
    client = MongoClient(mongo_uri)
    db = client.test  # Base de datos 'test'

    
    collection = db.test  # Colección 'test'
    
except Exception as e:
    print("Error al conectar con MongoDB:", e)