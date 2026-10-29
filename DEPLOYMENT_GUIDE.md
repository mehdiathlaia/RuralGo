# 🚀 Desplegar a Producción (100% Gratis)

## Arquitectura Final

```
┌─────────────────┐
│   Vercel        │
│  (Frontend)     │
│ tu-app.vercel.app
└────────┬────────┘
         │ API calls
         │
┌────────▼────────────┐
│   Railway/Render    │
│   (Backend Node.js) │
│ tu-backend.railway.app
└────────┬────────────┘
         │ Queries
         │
┌────────▼────────────┐
│  MongoDB Atlas      │
│  (Base de datos)    │
│ cluster0.xxxxx.mongodb.net
└─────────────────────┘
```

---

## Opción A: Backend en Railway (Recomendado)

### 1. Preparar GitHub

```bash
# Asegurarse que todo está committeado
git add .
git commit -m "Backend RURAL-GO ready for deployment"
git push
```

### 2. Crear Cuenta Railway

1. Ir a: https://railway.app
2. Click en "Login with GitHub"
3. Autorizar Railway
4. Click en "New Project"

### 3. Conectar Repositorio

1. Click en "Deploy from GitHub repo"
2. Seleccionar tu repositorio `WebRuralGo`
3. Click en "Deploy"

### 4. Configurar Variables de Entorno

1. En Railway, click en "Variables"
2. Agregar:

```
MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/ruralgo
JWT_SECRET=tu_secret_key_largo_y_seguro_123456789
PORT=5000
NODE_ENV=production
CLIENT_URL=https://tu-app.vercel.app
```

3. Click en "Deploy"

### 5. Obtener URL del Backend

1. En Railway, click en "Networking"
2. Copiar el dominio público (algo como: `tu-backend.railway.app`)
3. Guardar para luego

---

## Opción B: Backend en Render (También Gratis)

### 1. Crear Cuenta

1. Ir a: https://render.com
2. Click en "Sign up" (sin tarjeta de crédito)
3. Crear cuenta

### 2. Crear Web Service

1. Click en "New +"
2. Seleccionar "Web Service"
3. Conectar GitHub
4. Seleccionar repositorio `WebRuralGo`

### 3. Configurar

```
Name: rural-go-backend
Runtime: Node
Build Command: cd server && npm install
Start Command: cd server && npm start
```

### 4. Agregar Variables

1. En "Environment", agregar:

```
MONGODB_URI=mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/ruralgo
JWT_SECRET=tu_secret_key_largo_y_seguro
PORT=5000
NODE_ENV=production
CLIENT_URL=https://tu-app.vercel.app
```

### 5. Deploy

1. Click en "Create Web Service"
2. Esperar a que compile e instale
3. Copiar la URL pública (algo como: `rural-go-backend.onrender.com`)

---

## Frontend en Vercel

### 1. Preparar

Actualizar `.env.local`:
```
VITE_API_URL=https://tu-backend.railway.app/api
VITE_SOCKET_URL=https://tu-backend.railway.app
```

```bash
git add .env.local
git commit -m "Update backend URLs for production"
git push
```

### 2. Crear Cuenta Vercel

1. Ir a: https://vercel.com
2. Click en "Sign Up"
3. Usar GitHub para registrarse

### 3. Importar Proyecto

1. Click en "New Project"
2. Seleccionar repositorio `WebRuralGo`
3. Click en "Import"

### 4. Configurar Build

```
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### 5. Agregar Variables de Entorno

1. Click en "Environment Variables"
2. Agregar:

```
VITE_API_URL=https://tu-backend.railway.app/api
VITE_SOCKET_URL=https://tu-backend.railway.app
```

### 6. Deploy

1. Click en "Deploy"
2. Esperar a que complete
3. Copiar tu URL (algo como: `rural-go.vercel.app`)

---

## Actualizar MongoDB Network Access

1. Ir a MongoDB Atlas
2. Click en "Network Access"
3. Agregar IP de tu backend (Railway/Render)

**Para Railway:**
```
1. En Dashboard, click en "Networking"
2. Copiar la IP pública
3. En Atlas, agregar esa IP
```

**Para Render:**
```
1. Los IPs son compartidas
2. Agregar 0.0.0.0/0 (válido para Render gratis)
```

---

## 🧪 Verificar Que Funciona

### Test del Backend

```bash
curl https://tu-backend.railway.app/api/health

# Deberías ver:
{"status":"OK","message":"Server is running"}
```

### Test de Registro

```bash
curl -X POST https://tu-backend.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Test",
    "email":"test@example.com",
    "password":"test123",
    "phone":"123456789",
    "role":"passenger"
  }'

# Deberías recibir un token
```

### Test del Frontend

1. Abrir https://tu-app.vercel.app
2. Debería cargar la app
3. Intentar registrarse
4. Debería conectar al backend

---

## 📊 Monitoreo en Producción

### Railway
1. Dashboard principal muestra logs
2. Click en "Logs" para ver errores
3. Click en "Metrics" para ver performance

### Render
1. Click en "Logs" para ver activity
2. Click en "Metrics" para CPU, memoria, etc

### MongoDB Atlas
1. Click en "Metrics"
2. Ver operaciones por segundo
3. Ver espacio utilizado

---

## 🔄 Hacer Cambios en Producción

### Si cambias código:

```bash
# En local
git add .
git commit -m "Nuevo cambio"
git push

# Railway/Render
Se redeploy automáticamente

# Vercel
Se redeploy automático también
```

### Si cambias variable de entorno:

**Railway:**
1. Click en "Variables"
2. Editar el valor
3. Click en "Deploy"

**Render:**
1. Click en "Environment"
2. Editar el valor
3. Se redeploy automáticamente

---

## 🚨 Troubleshooting Producción

### Error: "Backend URL not found"

```
Solución:
1. Verificar que VITE_API_URL es correcto
2. Verificar que el backend está en Railway/Render
3. Redeploy el frontend
```

### Error: "MongoDB connection failed"

```
Solución:
1. Verificar MONGODB_URI en Railway/Render variables
2. Verificar que la IP del backend está en Network Access
3. Verificar que el cluster está READY
```

### Error: "CORS error"

```
Solución:
1. Verificar que CLIENT_URL en backend variables es correcto
2. Debe ser https://tu-app.vercel.app
3. Sin trailing slash
```

### Error: "Socket.io not connecting"

```
Solución:
1. Verificar que VITE_SOCKET_URL es correcto
2. Debe ser https://tu-backend.railway.app (sin /api)
3. Verificar que Socket.io está habilitado en servidor
```

---

## 💰 Resumen de Costos

| Servicio | Coste | Notas |
|----------|-------|-------|
| Railway Backend | $0 | 500 horas/mes |
| Render Backend | $0 | Básico gratuito |
| Vercel Frontend | $0 | Incluido |
| MongoDB | $0 | 512 MB |
| **TOTAL** | **$0** | Viable para MVP |

**Para escalar:**
- Pasar a plan pagado de Railway ($5/mes)
- O pasar a plan pagado de Render ($7/mes)
- MongoDB: pasar a tier M2+ si superas 512 MB

---

## 📈 Performance Tips

### Backend Optimizations
1. Agregar caché con Redis (opcional)
2. Usar índices en MongoDB
3. Limitar resultados con pagination

### Frontend Optimizations
1. Code splitting automático en Vite
2. Lazy loading de rutas
3. Compression de imágenes

### Database
1. Crear índices en campos frecuentes
2. Borrar datos antiguos regularmente
3. Monitorear tamaño

---

## ✅ Checklist Despliegue

### Backend (Railway)
- [ ] GitHub push
- [ ] Railway project creado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] URL pública funciona
- [ ] Test /api/health ok

### Base de Datos
- [ ] MongoDB Network Access actualizado
- [ ] IP del backend agregada
- [ ] Conexión desde Railway funciona

### Frontend (Vercel)
- [ ] .env.local actualizado con URLs correctas
- [ ] Build local funciona
- [ ] Vercel project creado
- [ ] Variables de entorno configuradas
- [ ] Deploy exitoso
- [ ] App carga desde Vercel

### Testing Final
- [ ] Registro funciona
- [ ] Login funciona
- [ ] Crear viaje funciona
- [ ] Notificaciones en tiempo real funcionan
- [ ] Historial de viajes muestra datos
- [ ] Sin errores en consola

---

## 🎉 ¡Listo!

Tu aplicación RURAL-GO está **en producción** tipo Uber:

✅ Backend en Railway/Render
✅ Frontend en Vercel
✅ Base de datos en MongoDB Atlas
✅ Todo 100% gratis
✅ Escalable cuando crezca

**URL final:**
```
Frontend: https://tu-app.vercel.app
Backend: https://tu-backend.railway.app
Database: MongoDB Atlas
```

---

## 📞 Si necesitas ayuda

1. Revisar logs en Railway/Render
2. Revisar consola del navegador (F12)
3. Verificar variables de entorno
4. Buscar error en MongoDB Atlas
5. Hacer git push para redeploy

¡A por ello! 🚀
