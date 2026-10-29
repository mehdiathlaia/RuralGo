# 📖 Guia d'Integració Frontend

## 1. Importar els stores nous

En qualsevol component:

```javascript
import { useAuthStoreBackend } from '@/store/authStoreBackend'
import { useTripStoreBackend } from '@/store/tripStoreBackend'

export default {
  setup() {
    const authStore = useAuthStoreBackend()
    const tripStore = useTripStoreBackend()
    
    return { authStore, tripStore }
  }
}
```

## 2. Registrar/Login usuari

```javascript
// Registre
const handleRegister = async () => {
  try {
    await authStore.register({
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'password123',
      phone: '612345678',
      role: 'passenger' // o 'driver'
    })
    console.log('✅ Usuari registrat')
    tripStore.setupRealtimeListeners() // Activar notificacions
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Login
const handleLogin = async () => {
  try {
    await authStore.login('juan@example.com', 'password123')
    console.log('✅ Usuari logueado')
    tripStore.setupRealtimeListeners() // Activar notificacions
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 3. Crear un viatge (PASSATGER)

```javascript
const handleRequestTrip = async () => {
  try {
    const trip = await tripStore.createTrip({
      pickupLocation: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'Times Square, NY'
      },
      dropoffLocation: {
        latitude: 40.7489,
        longitude: -73.9680,
        address: 'Empire State Building, NY'
      },
      serviceType: 'transport',
      estimatedDistance: 3.5,
      estimatedDuration: 20,
      estimatedPrice: 12.50,
      notes: 'Vull anar a una cita'
    })
    
    console.log('✅ Viatge solicitat:', trip)
    // Els conductors rebran una notificació automàticament
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 4. Veure viatges disponibles (CONDUCTOR)

```javascript
// En el component del Dashboard del conductor
import { onMounted } from 'vue'

export default {
  setup() {
    const tripStore = useTripStoreBackend()
    
    onMounted(() => {
      tripStore.setupRealtimeListeners()
      
      // Escuchar nuevos viajes
      // Los viajes aparecerán en tripStore.newTripNotifications
    })
    
    return { tripStore }
  }
}
```

En el template:
```vue
<div v-for="trip in tripStore.newTripNotifications" class="trip-card">
  <h3>{{ trip.serviceType }}</h3>
  <p>{{ trip.pickupLocation.address }} → {{ trip.dropoffLocation.address }}</p>
  <button @click="acceptTrip(trip.id)">Acceptar viatge</button>
</div>
```

## 5. Acceptar viatge (CONDUCTOR)

```javascript
const acceptTrip = async (tripId) => {
  try {
    const trip = await tripStore.acceptTrip(tripId)
    console.log('✅ Viatge acceptat:', trip)
    // El passatger rebra una notificació automàticament
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 6. Iniciar viatge (CONDUCTOR)

```javascript
const startTrip = async (tripId) => {
  try {
    const trip = await tripStore.startTrip(tripId)
    console.log('🚗 Viatge iniciado')
    // El passatger rebra una notificació
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 7. Completar viatge (CONDUCTOR)

```javascript
const completeTrip = async (tripId) => {
  try {
    const trip = await tripStore.completeTrip(tripId, {
      actualPrice: 12.50,
      passengerRating: 5, // 1-5 estels
      driverRating: 4.5   // 1-5 estels
    })
    console.log('✅ Viatge completat')
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 8. Actualizar ubicació en temps real (CONDUCTOR)

```javascript
import { useGeolocation } from '@vueuse/core'

export default {
  setup() {
    const { coords } = useGeolocation()
    const tripStore = useTripStoreBackend()
    
    // Emitir ubicació cada 5 segons
    setInterval(() => {
      if (coords.value && tripStore.currentTrip) {
        tripStore.emitLocationUpdate({
          latitude: coords.value.latitude,
          longitude: coords.value.longitude,
          tripId: tripStore.currentTrip.id
        })
      }
    }, 5000)
    
    return { tripStore }
  }
}
```

## 9. Veure viatges actius

```javascript
const getActiveTrips = async () => {
  try {
    const trips = await tripStore.getActiveTrips()
    console.log('📍 Viatges actius:', trips)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## 10. Veure historial de viatges

```javascript
const getTripHistory = async () => {
  try {
    const history = await tripStore.getTripHistory()
    console.log('📊 Historial:', history)
  } catch (error) {
    console.error('❌ Error:', error)
  }
}
```

## Exemple complet de component

```vue
<template>
  <div class="trip-request-page">
    <h1>Solicitar Viaje</h1>
    
    <form @submit.prevent="submitTrip">
      <input v-model="pickup" type="text" placeholder="Lugar de recogida">
      <input v-model="dropoff" type="text" placeholder="Lugar de destino">
      <select v-model="serviceType">
        <option value="transport">Transport</option>
        <option value="cultura">Cultura</option>
        <option value="familia">Familia</option>
      </select>
      <button type="submit" :disabled="tripStore.loading">
        {{ tripStore.loading ? 'Solicitando...' : 'Solicitar Viaje' }}
      </button>
    </form>

    <div v-if="tripStore.currentTrip" class="trip-status">
      <h2>Estado del Viaje</h2>
      <p>{{ tripStore.currentTrip.status }}</p>
      <p>Precio estimado: €{{ tripStore.currentTrip.estimatedPrice }}</p>
    </div>

    <p v-if="tripStore.error" class="error">{{ tripStore.error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useTripStoreBackend } from '@/store/tripStoreBackend'

const tripStore = useTripStoreBackend()
const pickup = ref('')
const dropoff = ref('')
const serviceType = ref('transport')

const submitTrip = async () => {
  await tripStore.createTrip({
    pickupLocation: {
      address: pickup.value,
      latitude: 0,
      longitude: 0
    },
    dropoffLocation: {
      address: dropoff.value,
      latitude: 0,
      longitude: 0
    },
    serviceType: serviceType.value,
    estimatedDistance: 5,
    estimatedDuration: 15,
    estimatedPrice: 12.50
  })
}
</script>
```

## Flux de notificacions en temps real

```
PASSATGER solicita viatge
    ↓
backendService.emitTripRequest()
    ↓
Socket.io emet 'new_trip_available' a tots els conductors
    ↓
tripStore.onNewTripAvailable()
    ↓
Conductor veu notificació i accepta
    ↓
backendService.emitTripAccepted()
    ↓
Socket.io emet 'trip_accepted_notification' al passatger
    ↓
tripStore.onTripAcceptedNotification()
    ↓
PASSATGER veu que el conductor ha acceptat
```

## 🔗 Endpoints per a testejar amb Postman

**1. Registrar usuari**
```
POST http://localhost:5000/api/auth/register
Body:
{
  "name": "Juan",
  "email": "juan@test.com",
  "password": "pass123",
  "phone": "612345678",
  "role": "passenger"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Body:
{
  "email": "juan@test.com",
  "password": "pass123"
}
Response inclourà: token i user
```

**3. Crear viatge (requiere token)**
```
POST http://localhost:5000/api/trips
Headers:
  Authorization: Bearer <token>
Body:
{
  "pickupLocation": {"latitude": 40, "longitude": -74, "address": "NYC"},
  "dropoffLocation": {"latitude": 40.7, "longitude": -73.9, "address": "Manhattan"},
  "serviceType": "transport",
  "estimatedDistance": 3.5,
  "estimatedDuration": 20,
  "estimatedPrice": 12.50
}
```

---

¡Ja tens tot el que necessites per crear una aplicació tipus Uber completament funcional! 🚀
