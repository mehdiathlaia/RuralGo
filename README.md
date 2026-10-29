# RURAL-GO VIVA 🌐

Plataforma rural de transport sostenible amb tecnologia de ruta, notificacions, pagaments i activitats comunitàries.

## 🚀 Quick Start (5 minutos)

```bash
# 1. Instalar dependències
npm install

# 2. Instalar servidor backend
cd server && npm install && cd ..

# 3. Configurar MongoDB (ver QUICK_START.md)

# 4. Executar backend (Terminal 1)
cd server && npm run dev

# 5. Executar frontend (Terminal 2)
npm run dev

# 6. Abrir en navegador
http://localhost:5173
```

## 📚 Documentación Completa

| Documento | Tiempo | Para |
|-----------|--------|------|
| [QUICK_START.md](QUICK_START.md) | 5 min | Empezar ya |
| [RESUMEN_BACKEND.md](RESUMEN_BACKEND.md) | 10 min | Entender arquitectura |
| [MONGODB_GUIDE.md](MONGODB_GUIDE.md) | 15 min | Configurar base de datos |
| [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md) | 10 min | Usar backend en componentes |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | 20 min | Desplegar a producción |
| [DOCUMENTACION.md](DOCUMENTACION.md) | - | Índice general |

## 🏗️ Arquitectura

```
Frontend (Vue 3 + Vite)
    ↓ API REST
Backend (Node.js + Express)
    ↓ Queries
MongoDB Atlas (Cloud)
    ↕ Socket.io (Tiempo real)
```

## ✨ Características

### ✅ Backend Completo
- Express.js con APIs REST
- MongoDB Atlas integrado
- Socket.io para notificaciones en tiempo real
- Autenticación segura con JWT
- Modelos: Usuarios, Viajes, Notificaciones

### ✅ Sistema de Viajes Real
- Pasajeros solicitan viajes
- Conductores reciben notificaciones en vivo
- Aceptación de viajes instantánea
- Ubicación en tiempo real del conductor
- Historial y calificaciones

### ✅ Notificaciones Real-time
- Nuevos viajes disponibles
- Aceptación de viajes
- Inicio y finalización
- Ubicación del conductor

### ✅ Listo para Producción
- 100% gratuito para empezar
- Escalable a millones de usuarios
- Desplegable en Railway (backend)
- Desplegable en Vercel (frontend)
- HTTPS y CORS configurados

## 🗺️ Configuración Google Maps

1. Obtener clé en [Google Cloud Console](https://console.cloud.google.com/)
2. Activar: Maps JavaScript, Places, Directions, Distance Matrix APIs
3. Crear clé API
4. Pegar en `.env.local`:
```env
VITE_GOOGLE_MAPS_API_KEY=TuClaveAqui
```

## 📦 Stack Tecnológico

**Frontend:**
- Vue 3
- Vite
- Pinia (state management)
- Capacitor (Android)

**Backend:**
- Node.js
- Express
- Socket.io
- Mongoose (MongoDB)
- JWT + bcryptjs

**Base de Datos:**
- MongoDB Atlas (cloud)
- Gratis hasta 512MB

**Hosting:**
- Vercel (Frontend)
- Railway/Render (Backend)
- MongoDB Atlas (Database)

## 📱 Características Android
npm run dev
```

## 📊 Features

### ✅ Completats

- **Autenticació**: Sistema de login/signup amb 3 usuaris de demo
  - `maria@example.com` - Client
  - `joan@example.com` - Conductor
  - `rosa@example.com` - Municipality

- **Pagament**: Sistema de checkout complert amb descomptes
  - Preus dinàmics per tipus de vehicle
  - Codes de descompte (WELCOME10, REGULAR15, VIVA20)
  - Factures automàtiques

- **Notificacions**: Centre de notificacions amb chat en viu
  - Notificacions de viatge, pagament, suport
  - Suport 24/7 simulat
  - Preferències de canals

- **Google Maps**: Seguiment de viatges en temps real
  - Marcadors de recollida i conductor
  - Rutes i distàncies
  - Geocodificació d'adreces

- **Valoracions**: Sistema de 5 estrelles amb comentaris
  - Valoracions mutxes entre clients i conductors
  - Tags de qualitat (puntualitat, seguretat, etc.)
  - Estadístiques de puntuacions

- **Domus Viva**: Recomanacions d'activitats culturals i socials
  - Base de dades d'activitats
  - Busca per tags i dificultats
  - Recomanació del dia

### 🔄 Router & Navegació

- `/` - Home
- `/login` - Login/Signup
- `/profile` - Perfil d'usuari
- `/client` - Dashboard de client
- `/driver` - Dashboard de conductor
- `/plan` - Planificació i analítiques
- `/emergency` - Botó d'emergència
- `/checkout` - Pagament
- `/ratings` - Valoracions
- `/domus-viva` - Activitats culturals

## 📦 Dependències

- **Vue 3**: Framework reactiu
- **Vue Router**: Enrutament
- **Pinia**: Gestió d'estat
- **Vite**: Build tool
- **MDI Icons**: Icones de Material Design (opcional)

## 🎨 Estils

El projecte utilitza un sistema de disseny consistent amb:
- Colors primaris: #4ECDC4 (turquesa), #2c3e50 (gris fosc)
- Components responsive amb mobil-first
- Transicions suaus i animacions

## 👥 Usuaris de Demo

| Email | Password | Rol |
|-------|----------|-----|
| maria@example.com | pass123 | Client |
| joan@example.com | pass123 | Conductor |
| rosa@example.com | pass123 | Municipality |

## 🔐 Seguretat

- La clau de Google Maps es carrega dinàmicament
- Les dades es gestionen localment en Pinia stores
- No hi ha connexió a servidor real (simulada)

## 📝 Notas de Desenvolupament

- Els maps necessiten la clau API configurada per mostrar-se
- Si Google Maps no es carrega, el mapa mostra un SVG fallback
- Els components usen Vue 3 Composition API
- Els imports utilitzen camins relatius (no @/ alias per compatibilitat Vite)

## 🚀 Producció

Per desplegar a producció:

1. Configura les variables d'entorn al teu host
2. Assegura't que la clau de Google Maps estigui restringida per dominis
3. Executa `npm run build` per crear la versió optimitzada

## 📞 Suport

Per a preguntes sobre la integració de Google Maps, consulta la [documentació oficial](https://developers.google.com/maps/documentation)

---

**Versió**: 1.0.0  
**Última actualització**: Desembre 2024
