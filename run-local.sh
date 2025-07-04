#!/bin/bash

# 🚀 Warhammer 40K Chat - Script de Ejecución Local
# Ave Imperator! Este script ejecuta el proyecto completo

set -e  # Salir si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con estilo
print_message() {
    echo -e "${BLUE}⚡ Ave Imperator!${NC} $1"
}

print_error() {
    echo -e "${RED}🔥 Error del Chaos:${NC} $1"
}

print_success() {
    echo -e "${GREEN}✅ Bendición del Omnissiah:${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠️  Advertencia Imperial:${NC} $1"
}

# Banner imperial
echo -e "${YELLOW}"
echo "════════════════════════════════════════════════════════════════"
echo "⚡ WARHAMMER 40K CHAT - PROYECTO LOCAL ⚡"
echo "Ave Imperator! Iniciando los sistemas del Imperio..."
echo "════════════════════════════════════════════════════════════════"
echo -e "${NC}"

# Verificar si estamos en el directorio correcto
if [ ! -f "vercel.json" ]; then
    print_error "No se encontró vercel.json. Asegúrate de ejecutar este script desde la raíz del proyecto."
    exit 1
fi

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado. Instálalo desde https://nodejs.org/"
    exit 1
fi

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 no está instalado. Instálalo desde https://python.org/"
    exit 1
fi

print_message "Verificando estructura del proyecto..."

# ========================================
# CONFIGURACIÓN DEL BACKEND (API Python)
# ========================================
print_message "🐍 Configurando Backend Python..."

cd api

# Verificar si existe requirements.txt
if [ ! -f "requirements.txt" ]; then
    print_error "No se encontró requirements.txt en el directorio api/"
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    print_message "Creando entorno virtual Python..."
    python3 -m venv venv
fi

# Activar entorno virtual
print_message "Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
print_message "Instalando dependencias Python..."
pip install -r requirements.txt

# Verificar variable de entorno OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
    print_warning "OPENAI_API_KEY no está configurada como variable de entorno."
    print_warning "Asegúrate de configurarla o el chat no funcionará."
fi

cd ..

# ========================================
# CONFIGURACIÓN DEL FRONTEND (Next.js)
# ========================================
print_message "⚛️  Configurando Frontend Next.js..."

cd frontend

# Verificar si existe package.json
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json en el directorio frontend/"
    exit 1
fi

# Instalar dependencias de Node.js
print_message "Instalando dependencias de Node.js..."
npm install

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    print_warning "No se encontró .env.local en frontend/"
    print_warning "Creando archivo .env.local de ejemplo..."
    echo "NEXT_PUBLIC_OPENAI_API_KEY=tu_clave_de_openai_aqui" > .env.local
    print_warning "⚠️  IMPORTANTE: Edita frontend/.env.local con tu clave real de OpenAI"
fi

cd ..

# ========================================
# EJECUCIÓN DE LOS SERVICIOS
# ========================================
print_success "🎯 Configuración completada! Iniciando servicios..."

# Función para limpiar procesos al salir
cleanup() {
    print_message "🛑 Deteniendo servicios..."
    kill %1 %2 2>/dev/null || true
    print_success "Ave Imperator! Servicios detenidos correctamente."
    exit 0
}

# Configurar trap para cleanup
trap cleanup SIGINT SIGTERM

print_message "🚀 Iniciando Backend Python (Puerto 8000)..."
cd api
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Esperar un momento para que el backend se inicie
sleep 3

print_message "🌐 Iniciando Frontend Next.js (Puerto 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Esperar un momento para que el frontend se inicie
sleep 5

print_success "════════════════════════════════════════════════════════════════"
print_success "🎉 PROYECTO WARHAMMER 40K CHAT EJECUTÁNDOSE"
print_success "════════════════════════════════════════════════════════════════"
print_success "🌐 Frontend: http://localhost:3000"
print_success "🐍 Backend:  http://localhost:8000"
print_success "📚 API Docs: http://localhost:8000/docs"
print_success "════════════════════════════════════════════════════════════════"
print_message "💡 Presiona Ctrl+C para detener ambos servicios"
print_message "Ave Imperator! El chat está listo para servir al Imperio."

# Mantener el script corriendo
wait 