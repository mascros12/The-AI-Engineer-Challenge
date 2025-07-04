# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
import os
from typing import Optional, List, Dict

from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi

from pymongo import MongoClient
from datetime import datetime
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración de MongoDB
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb+srv://mascros99:T0YX7mQSeuTFrZFH@cluster0.ndb79pq.mongodb.net")
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


# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
)

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    session_id: Optional[str] = None  # Optional session ID for chat history

class SaveChatRequest(BaseModel):
    title: str
    race: str  # imperium, chaos, xenos
    messages: List[Dict]
    model: str = "gpt-4.1-mini"

class UpdateChatRequest(BaseModel):
    session_id: str
    messages: List[Dict]

# Initialize database connection on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database connection when the app starts"""
    try:
        db_manager.connect()
        print("🚀 API iniciada con conexión a MongoDB")
    except Exception as e:
        print(f"⚠️ API iniciada sin MongoDB: {str(e)}")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up database connection when the app shuts down"""
    db_manager.disconnect()
    print("🛑 API detenida")

# Configuración de la documentación de FastAPI para soportar OAuth2
@app.get("/docs", include_in_schema=False)
async def get_swagger_ui():
    return get_swagger_ui_html(
        openapi_url="/openapi.json",
        title="API Docs",
        swagger_ui_parameters={"oauth2RedirectUrl": "/docs/oauth2-redirect"},
        init_oauth={
            "clientId": "your-client-id",
            "usePkceWithAuthorizationCodeGrant": True,
        },
    )

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    try:
        # Initialize OpenAI client with the provided API key
        client = OpenAI(api_key=request.api_key)
        
        # Create an async generator function for streaming responses
        async def generate():
            # Create a streaming chat completion request
            stream = client.chat.completions.create(
                model=request.model,
                messages=[
                    {"role": "developer", "content": request.developer_message},
                    {"role": "user", "content": request.user_message}
                ],
                stream=True  # Enable streaming response
            )
            
            # Yield each chunk of the response as it becomes available
            for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        # Return a streaming response to the client
        return StreamingResponse(generate(), media_type="text/plain")
    
    except Exception as e:
        # Handle any errors that occur during processing
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint para guardar una nueva sesión de chat
@app.post("/api/chat/save")
async def save_chat_session(request: SaveChatRequest):
    """Guardar una nueva sesión de chat en MongoDB"""
    try:
        session_data = {
            "title": request.title,
            "race": request.race,
            "messages": request.messages,
            "model": request.model,
            "message_count": len(request.messages)
        }
        
        session_id = db_manager.save_chat_session(session_data)
        return {"session_id": session_id, "status": "saved"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error guardando chat: {str(e)}")

# Endpoint para obtener el historial de chats
@app.get("/api/chat/history")
async def get_chat_history(limit: int = 50):
    """Obtener historial de sesiones de chat"""
    try:
        sessions = db_manager.get_chat_sessions(limit)
        return {"sessions": sessions, "count": len(sessions)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo historial: {str(e)}")

# Endpoint para obtener una sesión específica
@app.get("/api/chat/{session_id}")
async def get_chat_session(session_id: str):
    """Obtener una sesión específica por ID"""
    try:
        session = db_manager.get_chat_session_by_id(session_id)
        if session:
            return session
        else:
            raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo sesión: {str(e)}")

# Endpoint para actualizar una sesión existente
@app.put("/api/chat/update")
async def update_chat_session(request: UpdateChatRequest):
    """Actualizar los mensajes de una sesión existente"""
    try:
        success = db_manager.update_chat_session(request.session_id, request.messages)
        if success:
            return {"status": "updated", "session_id": request.session_id}
        else:
            raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error actualizando sesión: {str(e)}")

# Endpoint para eliminar una sesión
@app.delete("/api/chat/{session_id}")
async def delete_chat_session(session_id: str):
    """Eliminar una sesión de chat"""
    try:
        success = db_manager.delete_chat_session(session_id)
        if success:
            return {"status": "deleted", "session_id": session_id}
        else:
            raise HTTPException(status_code=404, detail="Sesión no encontrada")
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando sesión: {str(e)}")

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "database": "connected" if db_manager.collection is not None else "disconnected"}

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Start the server on all network interfaces (0.0.0.0) on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
