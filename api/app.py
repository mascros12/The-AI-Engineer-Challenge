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
from database import db_manager

from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.openapi.utils import get_openapi
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
