# 🗄️ Guia MongoDB Atlas (100% Gratuito)

## Paso 1: Crear Cuenta

1. Ir a: https://www.mongodb.com/cloud/atlas
2. Click en "Try for Free" o "Sign Up"
3. Crear cuenta con email o Google
4. Verificar email

## Paso 2: Crear Cluster

1. Click en "Build a Database"
2. Seleccionar **M0 Free** (siempre estará gratuito)
3. Seleccionar proveedor: AWS/Google Cloud/Azure (cualquiera)
4. Seleccionar región más cercana (ej: eu-west-1 para Europa)
5. Click en "Create Deployment"
6. Esperar 5-10 minutos a que se cree

## Paso 3: Crear Usuario

1. En la izquierda, click en "Database Access"
2. Click en "Add Database User"
3. Ingresar:
   - Username: `admin` (o lo que quieras)
   - Password: `MiContraseñaSegura123!` (guardar bien)
4. Click en "Add User"

## Paso 4: Permitir Conexión

1. En la izquierda, click en "Network Access"
2. Click en "Add IP Address"
3. Click en "Allow Access from Anywhere"
4. Seleccionar `0.0.0.0/0` (permite desde cualquier IP)
5. Click en "Confirm"

⚠️ **Nota**: En producción, es mejor limitar IPs específicas

## Paso 5: Obtener Connection String

1. Click en "Database" en el menú izquierdo
2. En tu cluster, click en "Connect"
3. Seleccionar "Drivers"
4. Seleccionar "Node.js"
5. Copiar el connection string (similar a esto):
```
mongodb+srv://admin:MiContraseñaSegura123@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
```

## Paso 6: Configurar en la App

1. Abrir `server/.env`
2. Cambiar MONGODB_URI:
```
MONGODB_URI=mongodb+srv://admin:MiContraseñaSegura123@cluster0.xxxxx.mongodb.net/ruralgo?retryWrites=true&w=majority
```

⚠️ **IMPORTANTE**: 
- Cambiar `admin` por tu usuario
- Cambiar `MiContraseñaSegura123` por tu contraseña
- Cambiar `cluster0.xxxxx` por tu cluster real
- Agregar `/ruralgo` como nombre de la base de datos

## Paso 7: Verificar Conexión

```bash
cd server
npm run dev
```

Deberías ver:
```
✅ Conectado a MongoDB
🚀 Servidor ejecutándose en puerto 5000
```

---

## 📊 Entender MongoDB

### ¿Qué es MongoDB?

Es una **base de datos NoSQL**:
- Guarda datos en **JSON** (documentos)
- Sin esquemas rígidos
- Muy escalable
- Perfecta para aplicaciones web

### Estructura

```
Cluster (tu cuenta)
  └─ Database: "ruralgo"
       ├─ Collection: "users"
       │   ├─ {_id: 1, name: "Juan", email: "juan@..."}
       │   ├─ {_id: 2, name: "María", email: "maria@..."}
       │   └─ ...
       ├─ Collection: "trips"
       │   ├─ {_id: 1, passengerId: 1, driverId: 2, status: "accepted"}
       │   └─ ...
       └─ Collection: "notifications"
           └─ ...
```

### Cuotas Gratuitas (M0)

| Recurso | Límite |
|---------|--------|
| Almacenamiento | 512 MB |
| Documentos | Ilimitados* |
| RAM | Compartida |
| Backup | 1 copia |
| API | Incluida |
| Usuarios | Ilimitados |

*Hasta llenar los 512 MB

---

## 🔍 Ver tus Datos

### Opción 1: Atlas UI (Web)

1. Click en "Database" → Tu cluster
2. Click en "Browse Collections"
3. Ver collections: `users`, `trips`, `notifications`
4. Expandir y ver documentos

### Opción 2: MongoDB Compass (Gratis)

1. Descargar: https://www.mongodb.com/products/compass
2. En Atlas, click en "Connect"
3. Seleccionar "MongoDB Compass"
4. Copiar connection string
5. Abrir Compass y pegar
6. Click en "Connect"
7. Ver todas las collections en tiempo real

### Opción 3: Terminal (MongoDB Tools)

```bash
# Instalar MongoDB Shell
npm install -g mongosh

# Conectar
mongosh "mongodb+srv://admin:password@cluster0.xxxxx.mongodb.net/ruralgo"

# Ver collections
show collections

# Ver usuarios
db.users.find()

# Ver viajes
db.trips.find()

# Contar documentos
db.users.count()
```

---

## 🔧 Operaciones Comunes

### Crear Usuario (desde app)
```
POST /api/auth/register
{
  "name": "Juan",
  "email": "juan@example.com",
  "password": "pass123",
  "phone": "612345678",
  "role": "passenger"
}

⬇️ Se guarda automáticamente en collection "users"
```

### Ver usuarios en MongoDB
```bash
mongosh
use ruralgo
db.users.find()

# Resultado:
[
  {
    _id: ObjectId(...),
    name: "Juan",
    email: "juan@example.com",
    password: "$2a$10$..." (hasheada),
    phone: "612345678",
    role: "passenger",
    rating: 5,
    reviews: 0,
    isActive: true,
    createdAt: ISODate(...)
  }
]
```

### Crear Viaje
```
POST /api/trips
{
  "pickupLocation": {...},
  "dropoffLocation": {...},
  "serviceType": "transport",
  ...
}

⬇️ Se guarda en collection "trips"
```

### Ver viajes en MongoDB
```bash
db.trips.find()

# Resultado:
[
  {
    _id: ObjectId(...),
    passengerId: ObjectId(...),
    driverId: null,
    status: "requested",
    estimatedPrice: 12.50,
    createdAt: ISODate(...)
  }
]
```

---

## 📈 Monitoreo en Producción

### En Atlas Dashboard

1. Click en "Metrics" (en el cluster)
2. Ver:
   - **Conexiones activas**
   - **Operaciones por segundo**
   - **Espacio utilizado**
   - **Latencia de lecturas/escrituras**

### Alertas

1. Click en "Alerts"
2. Click en "Create Alert"
3. Configurar:
   - Qué monitorear (ej: CPU, memoria)
   - Umbral (ej: > 80%)
   - Acción (ej: enviar email)

### Backup Automático

- Atlas guarda backups automáticos cada 6 horas
- Puedes hacer un backup manual:
  1. Click en "Backup"
  2. Click en "Take Backup Now"

---

## 🚨 Errores Comunes

### Error: "ENOTFOUND _mongodb._tcp"
```
Causa: Connection string incorrecto o MongoDB no configurado
Solución: 
1. Verificar que el cluster está en estado READY
2. Copiar nuevamente el connection string
3. Asegurarse de que el usuario existe
```

### Error: "authentication failed"
```
Causa: Usuario o contraseña incorrectos
Solución:
1. Verificar credenciales en Database Access
2. Verificar que el usuario está creado
3. Probar con usuario "admin"
```

### Error: "connection timeout"
```
Causa: IP no permitida
Solución:
1. Ir a Network Access
2. Agregar 0.0.0.0/0 para permitir cualquier IP
3. En producción, usar IPs específicas
```

### Error: "Exceeded maximum cluster size"
```
Causa: Pasaste el límite de 512 MB
Solución:
1. Borrar datos innecesarios
2. Hacer una exportación con Compass
3. Crear un nuevo cluster (gratis)
```

---

## 🧹 Limpieza y Mantenimiento

### Borrar todos los viajes

```bash
mongosh
use ruralgo
db.trips.deleteMany({})
```

### Borrar usuarios específicos

```bash
db.users.deleteMany({ role: "test" })
```

### Resetear base de datos

```bash
mongosh
use ruralgo
db.dropDatabase()
```

### Exportar datos (backup manual)

```bash
mongosh > MongoDB Compass > Export Collection > JSON
```

---

## 🔒 Seguridad

### En Desarrollo
```
0.0.0.0/0 - Permitir desde cualquier IP (OK para dev)
```

### En Producción
```
Agregar SOLO las IPs de:
- Tu servidor backend (Railway/Render IP)
- Tu VPN corporativa (si aplica)

¿Cómo obtener IP de Railway?
1. Deploy en Railway
2. Click en "Networking"
3. Copiar IP pública
4. Agregar a Network Access en Atlas
```

---

## 📚 Recursos Útiles

- [MongoDB Docs](https://docs.mongodb.com/)
- [MongoDB CLI Cheat Sheet](https://docs.mongodb.com/mongodb-shell/reference/)
- [MongoDB Compass Docs](https://www.mongodb.com/docs/compass/)
- [MongoDB Atlas API](https://docs.atlas.mongodb.com/api/)

---

## ✅ Checklist MongoDB

- [ ] Cuenta Atlas creada
- [ ] Cluster M0 creado
- [ ] Usuario de base de datos creado
- [ ] IP 0.0.0.0/0 permitida
- [ ] Connection string obtenido
- [ ] Pegar en server/.env
- [ ] npm run dev funciona
- [ ] Ver datos en Compass o Atlas UI
- [ ] Crear usuario de prueba
- [ ] Ver usuario en colección "users"

---

¡Ahora estás listo para usar MongoDB! 🚀
