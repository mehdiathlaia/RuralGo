# 🎯 Quick Start - Executar Localment

## Paso 1: Configurar MongoDB Atlas (2 minutos)

1. Abre https://www.mongodb.com/cloud/atlas
2. Click "Sign Up" (gratis)
3. Crear cluster (M0 = gratis)
4. Crear usuario (ejemplo: admin / password123)
5. Permitir IP 0.0.0.0/0
6. Copy el connection string

## Paso 2: Configurar Variables de Entorno

### Archivo: `server/.env`
```
MONGODB_URI=mongodb+srv://admin:password123@cluster0.xxxxx.mongodb.net/ruralgo
JWT_SECRET=super_secret_key_123456789
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Archivo: `.env.local`
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Paso 3: Ejecutar el Backend

Abre una terminal en la carpeta del proyecto:

```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB
🚀 Servidor ejecutándose en puerto 5000
```

## Paso 4: Ejecutar el Frontend

Abre otra terminal en la carpeta principal:

```bash
npm run dev
```

Abre http://localhost:5173 en el navegador

## Paso 5: Probar la Aplicación

### Test de Registro
1. Ir a Login (si existe opción)
2. Registro de usuario (ejm: conductor o pasajero)
3. Verificar en consola que se conecta a Socket.io

### Test de Viaje (requiere 2 navegadores/dispositivos)
1. **Browser 1**: Usuario pasajero logueado
2. **Browser 2**: Usuario conductor logueado
3. **Pasajero**: Solicita viaje
4. **Conductor**: Recibe notificación de viaje disponible
5. **Conductor**: Acepta viaje
6. **Pasajero**: Recibe notificación de aceptación
7. **Conductor**: Inicia viaje
8. **Conductor**: Completa viaje con calificación

## 📱 Probar en Android

Después de probar en localhost:

```bash
npm run build
npx cap sync android
```

## ⚠️ Problemas Comunes

**Error: "Cannot connect to MongoDB"**
- Verificar MONGODB_URI en server/.env
- Asegurar que 0.0.0.0/0 está permitido en Atlas
- Revisar que el cluster está en estado "READY"

**Error: "Socket connection refused"**
- Backend debe estar corriendo en puerto 5000
- Verificar que no hay firewall bloqueando el puerto
- Revisar la consola del servidor

**Error: "CORS blocked"**
- Verificar que CLIENT_URL es correcto en server/.env
- Debe coincidir con http://localhost:5173

## ✅ Todo Listo?

Si ves:
- ✅ Backend conectado a MongoDB
- ✅ Frontend cargando en localhost:5173
- ✅ Socket.io conectado
- ✅ Notificaciones funcionando

¡Ya puedes empezar a desarrollar la app tipo Uber! 🚀
