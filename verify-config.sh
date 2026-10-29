#!/bin/bash
# Script de validació - Verificar que tot està correcte per a producció

echo "🔍 Verificant configuració de Rural-Go..."
echo ""

ERRORS=0
WARNINGS=0

# 1. Verificar que existeix backendService.js
if [ -f "src/services/backendService.js" ]; then
    echo "✅ backendService.js trobat"
    if grep -q "ruralgo-backend.onrender.com" "src/services/backendService.js"; then
        echo "  ✅ URL de Render correcta"
    else
        echo "  ⚠️  API_URL no apunta a Render"
        ((WARNINGS++))
    fi
else
    echo "❌ backendService.js no trobat!"
    ((ERRORS++))
fi

echo ""

# 2. Verificar capacitor.config.json
if [ -f "capacitor.config.json" ]; then
    echo "✅ capacitor.config.json trobat"
    if grep -q "ruralgo-backend.onrender.com" "capacitor.config.json"; then
        echo "  ✅ Navegació autoritzada per a Render"
    else
        echo "  ⚠️  allowNavigation no inclou Render"
        ((WARNINGS++))
    fi
else
    echo "❌ capacitor.config.json no trobat!"
    ((ERRORS++))
fi

echo ""

# 3. Verificar server.js
if [ -f "server/server.js" ]; then
    echo "✅ server/server.js trobat"
    if grep -q "cors()" "server/server.js"; then
        echo "  ✅ CORS habilitat"
    else
        echo "  ⚠️  CORS no està configurat"
        ((WARNINGS++))
    fi
else
    echo "❌ server/server.js no trobat!"
    ((ERRORS++))
fi

echo ""

# 4. Verificar que MongoDB está ref a .env
if [ -f "server/.env" ]; then
    echo "✅ server/.env trobat"
    if grep -q "MONGODB_URI" "server/.env"; then
        echo "  ✅ MongoDB URI configurat"
    else
        echo "  ❌ MongoDB URI falta"
        ((ERRORS++))
    fi
else
    echo "⚠️  server/.env no trobat (necessari en Render)"
    ((WARNINGS++))
fi

echo ""

# 5. Verificar que existe android/
if [ -d "android" ]; then
    echo "✅ Carpeta android/ trobada"
    if [ -f "android/app/build.gradle" ]; then
        echo "  ✅ build.gradle encontrado"
    else
        echo "  ❌ android/app/build.gradle no trobat!"
        ((ERRORS++))
    fi
else
    echo "❌ Carpeta android/ no trobada!"
    ((ERRORS++))
fi

echo ""
echo "═════════════════════════════════════"
echo "📊 RESULTATS:"
echo "  ✅ Checks: $(find . -name "*.js" -o -name "*.json" | wc -l) fitxers verificats"
echo "  ❌ Errors: $ERRORS"
echo "  ⚠️  Warnings: $WARNINGS"
echo "═════════════════════════════════════"

if [ $ERRORS -eq 0 ]; then
    echo ""
    echo "✅ Tot sembla correcte! Pots procedir amb:"
    echo "   1. npm run build"
    echo "   2. npx cap copy android"
    echo "   3. npx cap sync android"
    echo "   4. Obrir en Android Studio i compilar"
else
    echo ""
    echo "❌ Hi ha errors que necessiten ser arreglats!"
    exit 1
fi
