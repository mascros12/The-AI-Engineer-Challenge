<p align = "center" draggable=”false” ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>


## <h1 align="center" id="heading"> 👋 Welcome to the AI Engineer Challenge</h1>

## 🤖 Your First Vibe Coding LLM Application

> If you are a novice, and need a bit more help to get your dev environment off the ground, check out this [Setup Guide](docs/GIT_SETUP.md). This guide will walk you through the 'git' setup you need to get started.

> For additional context on LLM development environments and API key setup, you can also check out our [Interactive Dev Environment for LLM Development](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers).

In this repository, we'll walk you through the steps to create a LLM (Large Language Model) powered application with a vibe-coded frontend!

Are you ready? Let's get started!

<details>
  <summary>🖥️ Accessing "gpt-4.1-mini" (ChatGPT) like a developer</summary>

1. Head to [this notebook](https://colab.research.google.com/drive/1sT7rzY_Lb1_wS0ELI1JJfff0NUEcSD72?usp=sharing) and follow along with the instructions!

2. Complete the notebook and try out your own system/assistant messages!

That's it! Head to the next step and start building your application!

</details>


<details>
  <summary>🏗️ Forking & Cloning This Repository</summary>

Before you begin, make sure you have:

1. 👤 A GitHub account (you'll need to replace `YOUR_GITHUB_USERNAME` with your actual username)
2. 🔧 Git installed on your local machine
3. 💻 A code editor (like Cursor, VS Code, etc.)
4. ⌨️ Terminal access (Mac/Linux) or Command Prompt/PowerShell (Windows)
5. 🔑 A GitHub Personal Access Token (for authentication)

Got everything in place? Let's move on!

1. Fork [this](https://github.com/AI-Maker-Space/The-AI-Engineer-Challenge) repo!

     ![image](https://i.imgur.com/bhjySNh.png)

1. Clone your newly created repo.

     ``` bash
     # First, navigate to where you want the project folder to be created
     cd PATH_TO_DESIRED_PARENT_DIRECTORY

     # Then clone (this will create a new folder called The-AI-Engineer-Challenge)
     git clone git@github.com:<YOUR GITHUB USERNAME>/The-AI-Engineer-Challenge.git
     ```

     > Note: This command uses SSH. If you haven't set up SSH with GitHub, the command will fail. In that case, use HTTPS by replacing `git@github.com:` with `https://github.com/` - you'll then be prompted for your GitHub username and personal access token.

2. Verify your git setup:

     ```bash
     # Check that your remote is set up correctly
     git remote -v

     # Check the status of your repository
     git status

     # See which branch you're on
     git branch
     ```

     <!-- > Need more help with git? Check out our [Detailed Git Setup Guide](docs/GIT_SETUP.md) for a comprehensive walkthrough of git configuration and best practices. -->

3. Open the freshly cloned repository inside Cursor!

     ```bash
     cd The-AI-Engineering-Challenge
     cursor .
     ```

4. Check out the existing backend code found in `/api/app.py`

</details>

<details>
  <summary>🔥Setting Up for Vibe Coding Success </summary>

While it is a bit counter-intuitive to set things up before jumping into vibe-coding - it's important to remember that there exists a gradient betweeen AI-Assisted Development and Vibe-Coding. We're only reaching *slightly* into AI-Assisted Development for this challenge, but it's worth it!

1. Check out the rules in `.cursor/rules/` and add theme-ing information like colour schemes in `frontend-rule.mdc`! You can be as expressive as you'd like in these rules!
2. We're going to index some docs to make our application more likely to succeed. To do this - we're going to start with `CTRL+SHIFT+P` (or `CMD+SHIFT+P` on Mac) and we're going to type "custom doc" into the search bar. 

     ![image](https://i.imgur.com/ILx3hZu.png)
3. We're then going to copy and paste `https://nextjs.org/docs` into the prompt.

     ![image](https://i.imgur.com/psBjpQd.png)

4. We're then going to use the default configs to add these docs to our available and indexed documents.

     ![image](https://i.imgur.com/LULLeaF.png)

5. After that - you will do the same with Vercel's documentation. After which you should see:

     ![image](https://i.imgur.com/hjyXhhC.png) 

</details>

<details>
  <summary>😎 Vibe Coding a Front End for the FastAPI Backend</summary>

1. Use `Command-L` or `CTRL-L` to open the Cursor chat console. 

2. Set the chat settings to the following:

     ![image](https://i.imgur.com/LSgRSgF.png)

3. Ask Cursor to create a frontend for your application. Iterate as much as you like!

4. Run the frontend using the instructions Cursor provided. 

> NOTE: If you run into any errors, copy and paste them back into the Cursor chat window - and ask Cursor to fix them!

> NOTE: You have been provided with a backend in the `/api` folder - please ensure your Front End integrates with it!

</details>

<details>
  <summary>🚀 Deploying Your First LLM-powered Application with Vercel</summary>

1. Ensure you have signed into [Vercel](https://vercel.com/) with your GitHub account.

2. Ensure you have `npm` (this may have been installed in the previous vibe-coding step!) - if you need help with that, ask Cursor!

3. Run the command:

     ```bash
     npm install -g vercel
     ```

4. Run the command:

     ```bash
     vercel
     ```

5. Follow the in-terminal instructions. (Below is an example of what you will see!)

     ![image](https://i.imgur.com/D1iKGCq.png)

6. Once the build is completed - head to the provided link and try out your app!

> NOTE: Remember, if you run into any errors - ask Cursor to help you fix them!

</details>

### Vercel Link to Share

You'll want to make sure you share you *domains* hyperlink to ensure people can access your app!

![image](https://i.imgur.com/mpXIgIz.png)

> NOTE: Test this is the public link by trying to open your newly deployed site in an Incognito browser tab!

### 🎉 Congratulations! 

You just deployed your first LLM-powered application! 🚀🚀🚀 Get on linkedin and post your results and experience! Make sure to tag us at @AIMakerspace!

Here's a template to get your post started!

```
🚀🎉 Exciting News! 🎉🚀

🏗️ Today, I'm thrilled to announce that I've successfully built and shipped my first-ever LLM using the powerful combination of , and the OpenAI API! 🖥️

Check it out 👇
[LINK TO APP]

A big shoutout to the @AI Makerspace for all making this possible. Couldn't have done it without the incredible community there. 🤗🙏

Looking forward to building with the community! 🙌✨ Here's to many more creations ahead! 🥂🎉

Who else is diving into the world of AI? Let's connect! 🌐💡

#FirstLLMApp 
```

# 🎯 Warhammer 40K Chat - Ave Imperator!

Una aplicación de chat temática del universo Warhammer 40K con soporte para múltiples razas, historial persistente y renderizado de Markdown.

## ⚡ Características

### 🎨 **Interfaz Temática**
- **Selector de Razas**: Imperium (dorado), Chaos (rojo), Xenos (verde)
- **Ambientación Imperial**: Diseño inspirado en el Imperio de la Humanidad
- **Responsive**: Adaptado para móvil, tablet y escritorio
- **Fuente Roboto**: Tipografía moderna y legible

### 🤖 **Chat Inteligente**
- **OpenAI GPT-4**: Respuestas contextuales según la raza seleccionada
- **Markdown Support**: Renderizado rico con resaltado de sintaxis
- **Streaming**: Respuestas en tiempo real
- **Temas por Raza**: Cada facción tiene su personalidad única

### 📚 **Historial Persistente**
- **MongoDB**: Almacenamiento de conversaciones
- **Auto-guardado**: Los chats se guardan automáticamente
- **Navegación**: Página dedicada para explorar conversaciones anteriores
- **Gestión**: Visualizar, eliminar y organizar chats por raza

## 🛠️ Instalación y Configuración

### 📋 **Requisitos**
- Node.js 18+
- Python 3.8+
- MongoDB (local o Atlas)

### 🚀 **Configuración Rápida**

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd warhammer40k-chat
```

2. **Configurar Variables de Entorno**

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_OPENAI_API_KEY=tu_clave_openai_aqui
```

**Backend** (`api/.env`):
```env
# Para MongoDB local
MONGODB_URL=mongodb://localhost:27017

# Para MongoDB Atlas
MONGODB_URL=mongodb+srv://usuario:password@cluster.mongodb.net/

# Opcional: OpenAI API Key para el servidor
OPENAI_API_KEY=tu_clave_openai_aqui
```

3. **Instalar Dependencias**

**Backend:**
```bash
cd api
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

4. **Ejecutar la Aplicación**

**Opción A - Script Automático:**
```bash
# Desde la raíz del proyecto
chmod +x run-local.sh
./run-local.sh
```

**Opción B - Manual:**
```bash
# Terminal 1: Backend
cd api
python app.py

# Terminal 2: Frontend
cd frontend
npm run dev
```

### 🌐 **Acceso**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📊 **Estructura del Proyecto**

```
├── api/                    # Backend Python (FastAPI)
│   ├── app.py             # API principal
│   ├── database.py        # Gestor de MongoDB
│   ├── requirements.txt   # Dependencias Python
│   └── .env              # Variables de entorno
├── frontend/              # Frontend Next.js
│   ├── src/app/
│   │   ├── page.tsx      # Página principal
│   │   ├── historial/    # Página de historial
│   │   └── components/   # Componentes React
│   └── .env.local        # Variables de entorno frontend
├── run-local.sh          # Script de ejecución
└── vercel.json           # Configuración de deployment
```

## 🎮 **Uso de la Aplicación**

### 💬 **Chat Principal**
1. **Seleccionar Raza**: Usa el dropdown en el navbar
2. **Escribir Mensaje**: En el input inferior
3. **Enviar**: El chat responderá según la raza seleccionada
4. **Auto-guardado**: Las conversaciones se guardan automáticamente

### 📚 **Historial**
1. **Acceder**: Click en "📚 Historial" en el navbar
2. **Explorar**: Lista de conversaciones por fecha
3. **Ver Detalles**: Click en cualquier sesión
4. **Eliminar**: Botón 🗑️ en cada sesión

### 🎨 **Razas Disponibles**

| Raza | Colores | Personalidad |
|------|---------|--------------|
| **Imperium** | 🟨 Dorado | Adeptus Mechanicus formal y leal |
| **Chaos** | 🔴 Rojo | Daemon malévolo del Warp |
| **Xenos** | 🟢 Verde | Entidad alienígena superior |

## 🔧 **API Endpoints**

### Chat
- `POST /api/chat` - Enviar mensaje
- `POST /api/chat/save` - Guardar sesión
- `GET /api/chat/history` - Obtener historial
- `GET /api/chat/{id}` - Obtener sesión específica
- `PUT /api/chat/update` - Actualizar sesión
- `DELETE /api/chat/{id}` - Eliminar sesión

### Utilidad
- `GET /api/health` - Estado de la API

## 🗄️ **Base de Datos**

### **Estructura de Sesión**
```json
{
  "_id": "ObjectId",
  "title": "Título del chat",
  "race": "imperium|chaos|xenos",
  "messages": [
    {
      "role": "user|ai",
      "content": "Contenido del mensaje"
    }
  ],
  "model": "gpt-4.1-mini",
  "message_count": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

## 🚀 **Deployment**

### **Vercel (Recomendado)**
```bash
# Configurar variables de entorno en Vercel Dashboard
# Luego:
vercel
```

### **Variables de Entorno para Producción**
- `NEXT_PUBLIC_OPENAI_API_KEY`: Clave OpenAI para frontend
- `MONGODB_URL`: URL de conexión MongoDB
- `OPENAI_API_KEY`: (Opcional) Clave OpenAI para backend

## 🛡️ **Tecnologías**

### **Frontend**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Markdown
- Fuente Roboto

### **Backend**
- FastAPI
- Python 3.8+
- MongoDB (PyMongo)
- OpenAI API
- Uvicorn

## 🎯 **Roadmap**

- [ ] Sistema de autenticación
- [ ] Compartir conversaciones
- [ ] Más razas (Tau, Necrones, etc.)
- [ ] Modo offline
- [ ] Exportar historial

## 📜 **Licencia**

Este proyecto está bajo la licencia MIT.

---

**Ave Imperator! El conocimiento es poder, guárdalo bien.** ⚡🛡️
