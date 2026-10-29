#!/bin/bash

# RURAL-GO - Scripts útiles para desarrollo y producción

echo "🚀 RURAL-GO Backend & Frontend Manager"
echo "======================================"
echo ""
echo "Comandos disponibles:"
echo "1. npm run dev:all      - Ejecutar backend + frontend"
echo "2. npm run dev:backend  - Solo backend"
echo "3. npm run dev:frontend - Solo frontend"
echo "4. npm run build:all    - Build frontend + sync Android"
echo "5. npm run test:api     - Testear API con curl"
echo ""

# Ejecutar según el argumento
case $1 in
  "dev:all")
    echo "🔥 Iniciando backend..."
    cd server && npm run dev &
    BACKEND_PID=$!
    sleep 3
    echo "🎨 Iniciando frontend..."
    npm run dev &
    FRONTEND_PID=$!
    echo "✅ Backend corriendo en http://localhost:5000"
    echo "✅ Frontend corriendo en http://localhost:5173"
    echo ""
    echo "Presiona Ctrl+C para detener"
    wait
    ;;
    
  "dev:backend")
    echo "🔥 Iniciando backend..."
    cd server && npm run dev
    ;;
    
  "dev:frontend")
    echo "🎨 Iniciando frontend..."
    npm run dev
    ;;
    
  "build:all")
    echo "📦 Compilando frontend..."
    npm run build
    echo "📱 Sincronizando con Android..."
    npx cap sync android
    echo "✅ Listo para Android!"
    ;;
    
  "test:api")
    echo "🧪 Testeando API..."
    echo ""
    echo "1. Registrar usuario:"
    curl -X POST http://localhost:5000/api/auth/register \
      -H "Content-Type: application/json" \
      -d '{
        "name":"Test User",
        "email":"test@example.com",
        "password":"test123",
        "phone":"123456789",
        "role":"passenger"
      }' 2>/dev/null | jq .
    ;;
    
  *)
    echo "Comando no reconocido. Usa:"
    echo "  npm run dev:all"
    echo "  npm run dev:backend"
    echo "  npm run dev:frontend"
    echo "  npm run build:all"
    echo "  npm run test:api"
    ;;
esac
