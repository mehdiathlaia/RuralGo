# 💡 Ejemplos de Código

## Registrar un Usuario

### Frontend (Vue Component)

```vue
<template>
  <div class="register-page">
    <h1>Registrarse</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="form.name" type="text" placeholder="Nombre">
      <input v-model="form.email" type="email" placeholder="Email">
      <input v-model="form.password" type="password" placeholder="Contraseña">
      <input v-model="form.phone" type="tel" placeholder="Teléfono">
      
      <select v-model="form.role">
        <option value="passenger">Pasajero</option>
        <option value="driver">Conductor</option>
      </select>
      
      <button type="submit" :disabled="authStore.loading">
        {{ authStore.loading ? 'Registrando...' : 'Registrarse' }}
      </button>
    </form>
    
    <p v-if="authStore.error" class="error">{{ authStore.error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStoreBackend } from '@/store/authStoreBackend'
import { useTripStoreBackend } from '@/store/tripStoreBackend'

const router = useRouter()
const authStore = useAuthStoreBackend()
const tripStore = useTripStoreBackend()

const form = ref({
  name: '',
  email: '',
  password: '',
  phone: '',
  role: 'passenger'
})

const handleRegister = async () => {
  try {
    await authStore.register(form.value)
    
    // Activar notificaciones en tiempo real
    tripStore.setupRealtimeListeners()
    
    // Redirigir al home
    router.push('/')
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

---

## Solicitar un Viaje (Pasajero)

```vue
<template>
  <div class="trip-request">
    <h2>Solicitar Viaje</h2>
    
    <div class="form-group">
      <label>De dónde sales?</label>
      <input 
        v-model="pickupAddress" 
        type="text" 
        placeholder="Dirección de salida"
        @focus="selectPickupLocation"
      >
    </div>
    
    <div class="form-group">
      <label>A dónde vas?</label>
      <input 
        v-model="dropoffAddress" 
        type="text" 
        placeholder="Dirección de destino"
        @focus="selectDropoffLocation"
      >
    </div>
    
    <div class="service-options">
      <button 
        v-for="service in services"
        :key="service.id"
        @click="selectedService = service"
        :class="{ active: selectedService?.id === service.id }"
      >
        {{ service.name }}
      </button>
    </div>
    
    <div v-if="selectedService" class="price-info">
      <p>Precio estimado: €{{ selectedService.baseFare }}</p>
      <p>Duración: ~{{ selectedService.minDuration }} min</p>
    </div>
    
    <button 
      @click="requestTrip" 
      :disabled="tripStore.loading"
      class="btn-primary"
    >
      {{ tripStore.loading ? 'Solicitando...' : 'Solicitar Viaje' }}
    </button>
    
    <div v-if="tripStore.currentTrip" class="trip-status">
      <h3>Tu Viaje</h3>
      <p>Estado: {{ tripStore.currentTrip.status }}</p>
      <p v-if="tripStore.currentTrip.driverId">
        Conductor: {{ tripStore.currentTrip.driverName }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTripStoreBackend } from '@/store/tripStoreBackend'

const tripStore = useTripStoreBackend()

const pickupAddress = ref('')
const dropoffAddress = ref('')
const selectedService = ref(null)

const services = [
  { id: 'transport', name: 'Transport', baseFare: 3.50, minDuration: 15 },
  { id: 'cultura', name: 'Cultura', baseFare: 4.50, minDuration: 20 },
  { id: 'familia', name: 'Familia', baseFare: 5.00, minDuration: 15 }
]

const selectPickupLocation = () => {
  // Aquí usarías Google Maps Autocomplete
  console.log('Select pickup location')
}

const selectDropoffLocation = () => {
  // Aquí usarías Google Maps Autocomplete
  console.log('Select dropoff location')
}

const requestTrip = async () => {
  try {
    await tripStore.createTrip({
      pickupLocation: {
        address: pickupAddress.value,
        latitude: 0, // Obtener de Google Maps
        longitude: 0
      },
      dropoffLocation: {
        address: dropoffAddress.value,
        latitude: 0,
        longitude: 0
      },
      serviceType: selectedService.value.id,
      estimatedDistance: 5,
      estimatedDuration: selectedService.value.minDuration,
      estimatedPrice: selectedService.value.baseFare
    })
  } catch (error) {
    console.error('Error:', error)
  }
}
</script>
```

---

## Panel de Conductor (Aceptar Viajes)

```vue
<template>
  <div class="driver-dashboard">
    <h2>Panel de Conductor</h2>
    
    <div class="status-toggle">
      <button @click="toggleOnline" :class="{ active: isOnline }">
        {{ isOnline ? '🟢 En Línea' : '🔴 Fuera de Línea' }}
      </button>
    </div>
    
    <div v-if="isOnline" class="available-trips">
      <h3>Viajes Disponibles</h3>
      
      <div 
        v-for="trip in tripStore.newTripNotifications" 
        :key="trip._id"
        class="trip-card"
      >
        <div class="trip-info">
          <p><strong>De:</strong> {{ trip.pickupLocation.address }}</p>
          <p><strong>A:</strong> {{ trip.dropoffLocation.address }}</p>
          <p><strong>Precio:</strong> €{{ trip.estimatedPrice }}</p>
          <p><strong>Duración:</strong> ~{{ trip.estimatedDuration }} min</p>
        </div>
        
        <div class="passenger-info">
          <p>Pasajero: {{ trip.passengerName }}</p>
          <p>Rating: ⭐ {{ trip.passengerRating }}/5</p>
        </div>
        
        <button 
          @click="acceptTrip(trip._id)"
          class="btn-accept"
          :disabled="tripStore.loading"
        >
          Aceptar Viaje
        </button>
      </div>
      
      <p v-if="tripStore.newTripNotifications.length === 0" class="no-trips">
        No hay viajes disponibles
      </p>
    </div>
    
    <div v-if="tripStore.currentTrip" class="active-trip">
      <h3>Viaje Activo</h3>
      <p>Pasajero: {{ tripStore.currentTrip.passengerName }}</p>
      <p>Destino: {{ tripStore.currentTrip.dropoffLocation.address }}</p>
      <p>Estado: {{ tripStore.currentTrip.status }}</p>
      
      <button @click="startTrip" class="btn-primary">
        Iniciar Viaje
      </button>
      
      <button @click="completeTrip" class="btn-primary">
        Finalizar Viaje
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTripStoreBackend } from '@/store/tripStoreBackend'
import backendService from '@/services/backendService'

const tripStore = useTripStoreBackend()
const isOnline = ref(false)

const toggleOnline = async () => {
  isOnline.value = !isOnline.value
  
  if (isOnline.value) {
    // Conectar Socket.io y escuchar notificaciones
    backendService.connectSocket()
    tripStore.setupRealtimeListeners()
    console.log('✅ Conductor en línea')
  } else {
    // Desconectar
    backendService.disconnectSocket()
    console.log('❌ Conductor fuera de línea')
  }
}

const acceptTrip = async (tripId) => {
  try {
    await tripStore.acceptTrip(tripId)
    console.log('✅ Viaje aceptado')
  } catch (error) {
    console.error('Error:', error)
  }
}

const startTrip = async () => {
  try {
    await tripStore.startTrip(tripStore.currentTrip._id)
    console.log('🚗 Viaje iniciado')
  } catch (error) {
    console.error('Error:', error)
  }
}

const completeTrip = async () => {
  try {
    await tripStore.completeTrip(tripStore.currentTrip._id, {
      actualPrice: tripStore.currentTrip.estimatedPrice,
      passengerRating: 5
    })
    console.log('✅ Viaje completado')
  } catch (error) {
    console.error('Error:', error)
  }
}

onMounted(() => {
  // Al cargar el component, conectar a Socket.io
  isOnline.value = true
  backendService.connectSocket()
  tripStore.setupRealtimeListeners()
})

onUnmounted(() => {
  // Al salir, desconectar
  backendService.disconnectSocket()
})
</script>
```

---

## Backend: Crear Viaje

```javascript
// server/controllers/tripController.js

exports.createTrip = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropoffLocation,
      serviceType,
      estimatedDistance,
      estimatedDuration,
      estimatedPrice,
      notes
    } = req.body;

    // Crear viaje
    const trip = new Trip({
      passengerId: req.userId,
      pickupLocation,
      dropoffLocation,
      serviceType,
      estimatedDistance,
      estimatedDuration,
      estimatedPrice,
      notes,
      status: 'requested'
    });

    await trip.save();
    
    // Emitir a todos los conductores conectados
    const io = require('../server').io;
    io.emit('new_trip_available', {
      ...trip.toObject(),
      passengerName: req.user.name,
      passengerRating: req.user.rating
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Backend: Aceptar Viaje

```javascript
// server/controllers/tripController.js

exports.acceptTrip = async (req, res) => {
  try {
    const { tripId } = req.params;

    // Buscar viaje
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ message: 'Viaje no encontrado' });
    }

    if (trip.status !== 'requested') {
      return res.status(400).json({ message: 'Viaje no disponible' });
    }

    // Asignar conductor
    trip.driverId = req.userId;
    trip.status = 'accepted';
    trip.acceptedAt = new Date();
    await trip.save();

    // Notificar al pasajero
    const io = require('../server').io;
    io.emit('trip_accepted_notification', {
      tripId: trip._id,
      message: `Tu viaje ha sido aceptado`,
      driverName: req.user.name,
      driverRating: req.user.rating
    });

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Socket.io: Escuchar Eventos

```javascript
// server/server.js

io.on('connection', (socket) => {
  console.log('Usuario conectado:', socket.id);

  // Registrar usuario en línea
  socket.on('user_online', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`✅ ${userId} en línea`);
  });

  // Escuchar actualización de ubicación
  socket.on('update_location', (data) => {
    const { driverId, latitude, longitude } = data;
    
    // Emitir a todos (pasajeros viendo la ubicación)
    io.emit('driver_location_updated', {
      driverId,
      latitude,
      longitude,
      timestamp: new Date()
    });
  });

  // Desconexión
  socket.on('disconnect', () => {
    activeUsers.delete(socket.userId);
    console.log('❌ Usuario desconectado');
  });
});
```

---

## Testing con cURL

```bash
# 1. Registrar usuario pasajero
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Pasajero Test",
    "email":"pasajero@test.com",
    "password":"test123",
    "phone":"612345678",
    "role":"passenger"
  }'

# Respuesta (copiar el token):
# {"token":"eyJhbGc...","user":{"id":"...","name":"Pasajero Test"}}

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"pasajero@test.com",
    "password":"test123"
  }'

# 3. Crear viaje (usar el token)
curl -X POST http://localhost:5000/api/trips \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{
    "pickupLocation":{"latitude":40,"longitude":-74,"address":"NYC"},
    "dropoffLocation":{"latitude":40.7,"longitude":-73.9,"address":"Manhattan"},
    "serviceType":"transport",
    "estimatedDistance":3.5,
    "estimatedDuration":20,
    "estimatedPrice":12.50
  }'

# 4. Ver viajes activos
curl -X GET http://localhost:5000/api/trips/active \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## Actualizar Ubicación en Tiempo Real

```vue
<script setup>
import { ref, onMounted } from 'vue'
import backendService from '@/services/backendService'

const latitude = ref(0)
const longitude = ref(0)

onMounted(() => {
  // Iniciar geolocalización
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      latitude.value = position.coords.latitude
      longitude.value = position.coords.longitude
      
      // Emitir ubicación cada 5 segundos
      if (Date.now() % 5000 < 1000) {
        backendService.emitUpdateLocation({
          latitude: latitude.value,
          longitude: longitude.value
        })
      }
    },
    (error) => console.error('Geolocation error:', error),
    { enableHighAccuracy: true, maximumAge: 0 }
  )
  
  // Cleanup
  return () => {
    navigator.geolocation.clearWatch(watchId)
  }
})
</script>
```

---

Estos son ejemplos funcionales que puedes usar como base para desarrollar tu aplicación. 🚀
