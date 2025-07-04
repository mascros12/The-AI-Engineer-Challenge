from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = "warhammer40k_chat"
COLLECTION_NAME = "chat_sessions"

class DatabaseManager:
    def __init__(self):
        self.client = None
        self.db = None
        self.collection = None
        
    def connect(self):
        """Conectar a MongoDB"""
        try:
            self.client = MongoClient(MONGODB_URL)
            self.db = self.client[DATABASE_NAME]
            self.collection = self.db[COLLECTION_NAME]
            # Verificar conexión
            self.client.admin.command('ping')
            print("✅ Conexión exitosa a MongoDB")
            return True
        except Exception as e:
            print(f"❌ Error conectando a MongoDB: {str(e)}")
            return False
    
    def disconnect(self):
        """Desconectar de MongoDB"""
        if self.client:
            self.client.close()
            print("🔌 Desconectado de MongoDB")
    
    def save_chat_session(self, session_data: Dict) -> str:
        """
        Guardar una sesión de chat
        Returns: ID de la sesión guardada
        """
        try:
            if self.collection is None:
                self.connect()
            
            # Agregar timestamp
            session_data["created_at"] = datetime.utcnow()
            session_data["updated_at"] = datetime.utcnow()
            
            if self.collection is not None:
                result = self.collection.insert_one(session_data)
                print(f"💾 Chat guardado con ID: {result.inserted_id}")
                return str(result.inserted_id)
            else:
                raise Exception("No hay conexión a MongoDB")
        except Exception as e:
            print(f"❌ Error guardando chat: {str(e)}")
            raise e
    
    def get_chat_sessions(self, limit: int = 50) -> List[Dict]:
        """
        Obtener sesiones de chat ordenadas por fecha (más recientes primero)
        """
        try:
            if self.collection is None:
                self.connect()
                
            if self.collection is not None:
                cursor = self.collection.find().sort("created_at", -1).limit(limit)
                sessions = []
                for session in cursor:
                    # Convertir ObjectId a string para JSON
                    session["_id"] = str(session["_id"])
                    sessions.append(session)
                
                print(f"📚 Obtenidas {len(sessions)} sesiones de chat")
                return sessions
            else:
                raise Exception("No hay conexión a MongoDB")
        except Exception as e:
            print(f"❌ Error obteniendo chats: {str(e)}")
            raise e
    
    def get_chat_session_by_id(self, session_id: str) -> Optional[Dict]:
        """
        Obtener una sesión específica por ID
        """
        try:
            if self.collection is None:
                self.connect()
                
            if self.collection is not None:
                from bson import ObjectId
                session = self.collection.find_one({"_id": ObjectId(session_id)})
                if session:
                    session["_id"] = str(session["_id"])
                    print(f"🔍 Sesión encontrada: {session_id}")
                    return session
                else:
                    print(f"❓ Sesión no encontrada: {session_id}")
                    return None
            else:
                raise Exception("No hay conexión a MongoDB")
        except Exception as e:
            print(f"❌ Error obteniendo sesión {session_id}: {str(e)}")
            raise e
    
    def update_chat_session(self, session_id: str, messages: List[Dict]) -> bool:
        """
        Actualizar los mensajes de una sesión existente
        """
        try:
            if self.collection is None:
                self.connect()
                
            if self.collection is not None:
                from bson import ObjectId
                result = self.collection.update_one(
                    {"_id": ObjectId(session_id)},
                    {
                        "$set": {
                            "messages": messages,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                if result.modified_count > 0:
                    print(f"🔄 Sesión actualizada: {session_id}")
                    return True
                else:
                    print(f"❓ No se encontró la sesión para actualizar: {session_id}")
                    return False
            else:
                raise Exception("No hay conexión a MongoDB")
        except Exception as e:
            print(f"❌ Error actualizando sesión {session_id}: {str(e)}")
            raise e
    
    def delete_chat_session(self, session_id: str) -> bool:
        """
        Eliminar una sesión de chat
        """
        try:
            if self.collection is None:
                self.connect()
                
            if self.collection is not None:
                from bson import ObjectId
                result = self.collection.delete_one({"_id": ObjectId(session_id)})
                if result.deleted_count > 0:
                    print(f"🗑️ Sesión eliminada: {session_id}")
                    return True
                else:
                    print(f"❓ No se encontró la sesión para eliminar: {session_id}")
                    return False
            else:
                raise Exception("No hay conexión a MongoDB")
        except Exception as e:
            print(f"❌ Error eliminando sesión {session_id}: {str(e)}")
            raise e

# Instancia global del gestor de base de datos
db_manager = DatabaseManager() 