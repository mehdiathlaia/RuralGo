# 🚀 RURAL-GO Backend Setup Guide

## Estructura General

```
WebRuralGo/
├── src/                   # Frontend Vue.js
├── android/               # Aplicación Android
├── server/                # Backend Node.js
│   ├── models/           # Esquemas MongoDB
│   ├── routes/           # Rutas API
│   ├── controllers/       # Lógica de negocio
│   ├── middleware/        # Autenticación
│   ├── server.js         # Servidor principal
│   ├── package.json      # Dependencias
│   └── .env              # Variables de entorno
├── package.json          # Frontend dependencies
└── .env.local            # Configuración frontend
```

## 1️⃣ Configurar MongoDB Atlas (Gratuito)

1. Ir a http
s://www.mongodb.com/cloud/atlas
2. Crear cuenta gratuita
3. Crear un nuevo cluster (seleccionar M0 - Free)
4. En "Database Access": Crear usuario y contraseña
5. En "Network Access": Permitir acceso desde cualquier IP (0.0.0.0/0)
6. Copiar el connection string y reemplazar en `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ruralgo
   ```

## 2️⃣ Instalar Dependencias Backend

```bash
cd server
npm install
```

## 3️⃣ Instalar Dependencias Frontend

```bash
npm install
```

## 4️⃣ Ejecutar en Desarrollo Local

### Terminal 1 - Backend:
```bash
cd server
npm run dev
```
El servidor correrá en `http://localhost:5000`

### Terminal 2 - Frontend:
```bash
npm run dev
```
La app correrá en `http://localhost:5173`

## 5️⃣ Desplegar en Producción (GRATIS)

### Opción A: Usar Railway (Recomendado)

1. Ir a https://railway.app
2. Crear cuenta con GitHub (gratis)
3. Crear nuevo proyecto
4. Conectar el repositorio de GitHub
5. En environment variables, agregar:
   ```
   MONGODB_URI=tu_url_mongodb
   JWT_SECRET=tu_secret_generado
   CLIENT_URL=https://tu-dominio.vercel.app
   NODE_ENV=production
   ```
6. Desplegar

### Opción B: Usar Render

1. Ir a https://render.com
2. Crear cuenta (gratis, sin tarjeta de crédito)
3. Crear nuevo "Web Service"
4. Conectar GitHub
5. Configurar:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Agregar variables (igual que Railway)
6. Desplegar

### Opción C: Usar Vercel (Solo Frontend)

1. Ir a https://vercel.com
2. Importar proyecto desde GitHub
3. En environment variables agregar:
   ```
   VITE_API_URL=https://tu-backend.railway.app/api
   VITE_SOCKET_URL=https://tu-backend.railway.app
   ```
4. Desplegar

## 📚 APIs Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Obtener perfil
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/location` - Actualizar ubicación

### Viajes
- `POST /api/trips` - Crear solicitud de viaje
- `GET /api/trips/active` - Obtener viajes activos
- `GET /api/trips/history` - Historial de viajes
- `PUT /api/trips/:tripId/accept` - Aceptar viaje (conductor)
- `PUT /api/trips/:tripId/start` - Iniciar viaje
- `PUT /api/trips/:tripId/complete` - Completar viaje
- `PUT /api/trips/:tripId/cancel` - Cancelar viaje

## 🔌 Socket.io Events

### Desde Cliente
- `user_online` - Usuario conectado
- `trip_requested` - Nueva solicitud de viaje
- `trip_accepted` - Viaje aceptado
- `trip_started` - Viaje iniciado
- `update_location` - Actualizar ubicación en tiempo real
- `trip_completed` - Viaje completado

### Desde Servidor
- `new_trip_available` - Nueva solicitud disponible
- `trip_accepted_notification` - Viaje aceptado
- `trip_started_notification` - Viaje iniciado
- `driver_location_updated` - Ubicación del conductor
- `trip_completed_notification` - Viaje completado

## 🔐 Variables de Entorno

### `server/.env`
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ruralgo
JWT_SECRET=tu_secret_key_seguro (genera con: https://www.uuidgenerator.net/)
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### `frontend/.env.local`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=tu_api_key
```

## 🧪 Pruebas

### Crear Usuario Test
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "phone": "123456789",
    "role": "driver"
  }'
```

## 📊 Flujo de Viaje

1. **Pasajero** crea solicitud de viaje
2. **Sistema** emite `new_trip_available` a todos los conductores conectados
3. **Conductor** recibe notificación y acepta el viaje
4. **Pasajero** recibe notificación de aceptación
5. **Conductor** inicia el viaje
6. **Sistema** emite ubicación en tiempo real
7. **Conductor** completa el viaje
8. **Ambos** califican la experiencia

## ⚠️ Notas Importantes

- **JWT_SECRET**: Cambiar a algo seguro en producción
- **MongoDB**: Las bases de datos gratuitas tienen límite de almacenamiento (512MB)
- **Socket.io**: Funciona mejor con conexión HTTPS en producción
- **CORS**: Asegurar que CLIENT_URL sea correcta

## 🐛 Troubleshooting

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Connection refused en localhost:5000"**
- Asegurar que `npm run dev` está ejecutándose en la carpeta `server/`

**Error: "MongoDB connection timeout"**
- Verificar que MongoDB Atlas tiene acceso desde tu IP
- Revisar MONGODB_URI en `.env`

## ✅ Checklist Antes de Producción

- [ ] MongoDB Atlas configurado
- [ ] JWT_SECRET cambiado a valor seguro
- [ ] Variables de entorno en producción
- [ ] CORS configurado correctamente
- [ ] Testing con múltiples usuarios
- [ ] Socket.io funcionando en tiempo real
- [ ] Notificaciones funcionando
- [ ] Ubicación en tiempo real funcionando

## 🎉 Listo!

Tu aplicación RURAL-GO está lista para ser una app real tipo Uber con:
✅ Autenticación segura
✅ Viajes en tiempo real
✅ Notificaciones instantáneas
✅ Base de datos escalable
✅ Hospedaje gratuito

¡A por ello! 🚀
