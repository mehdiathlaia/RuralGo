import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import backendService from '../services/backendService'

export const useTripStoreBackend = defineStore('tripBackend', () => {
  const trips = ref([])
  const activeTrips = ref([])
  const tripHistory = ref([])
  const currentTrip = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const newTripNotifications = ref([])

  const createTrip = async (tripData) => {
    loading.value = true
    error.value = null
    try {
      const trip = await backendService.createTrip(tripData)
      currentTrip.value = trip
      
      // Emitir a conductores disponibles
      backendService.emitTripRequest(trip)
      
      return trip
    } catch (err) {
      error.value = err.message || 'Error creando viaje'
      throw err
    } finally {
      loading.value = false
    }
  }

  const getActiveTrips = async () => {
    loading.value = true
    error.value = null
    try {
      const trips_data = await backendService.getActiveTrips()
      activeTrips.value = trips_data
      return trips_data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const getTripHistory = async () => {
    loading.value = true
    error.value = null
    try {
      const history = await backendService.getTripHistory()
      tripHistory.value = history
      return history
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const acceptTrip = async (tripId) => {
    loading.value = true
    error.value = null
    try {
      const trip = await backendService.acceptTrip(tripId)
      currentTrip.value = trip
      
      // Notificar al pasajero
      backendService.emitTripAccepted(trip)
      
      return trip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const startTrip = async (tripId) => {
    loading.value = true
    error.value = null
    try {
      const trip = await backendService.startTrip(tripId)
      currentTrip.value = trip
      
      // Notificar al pasajero
      backendService.emitTripStarted(trip)
      
      return trip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const completeTrip = async (tripId, data) => {
    loading.value = true
    error.value = null
    try {
      const trip = await backendService.completeTrip(tripId, data)
      currentTrip.value = null
      
      // Notificar al pasajero
      backendService.emitTripCompleted(trip)
      
      // Actualizar historial
      await getTripHistory()
      
      return trip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const cancelTrip = async (tripId) => {
    loading.value = true
    error.value = null
    try {
      const trip = await backendService.cancelTrip(tripId)
      if (currentTrip.value?.id === tripId) {
        currentTrip.value = null
      }
      return trip
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Escuchar notificaciones en tiempo real
  const setupRealtimeListeners = () => {
    // Nuevos viajes disponibles (para conductores)
    backendService.onNewTripAvailable((tripData) => {
      newTripNotifications.value.push(tripData)
      console.log('🔔 Nuevo viaje disponible:', tripData)
    })

    // Viaje aceptado (para pasajeros)
    backendService.onTripAcceptedNotification((data) => {
      currentTrip.value = data.trip
      console.log('✅ Viaje aceptado:', data.message)
    })

    // Viaje iniciado (para pasajeros)
    backendService.onTripStartedNotification((data) => {
      currentTrip.value = data.trip
      console.log('🚗 Viaje iniciado:', data.message)
    })

    // Viaje completado (para pasajeros)
    backendService.onTripCompletedNotification((data) => {
      console.log('🏁 Viaje completado:', data.message)
    })

    // Ubicación del conductor en tiempo real
    backendService.onDriverLocationUpdated((locationData) => {
      if (currentTrip.value && currentTrip.value.driverId === locationData.driverId) {
        // Actualizar ubicación del conductor en el mapa
        console.log('📍 Ubicación actualizada:', locationData)
      }
    })
  }

  return {
    trips,
    activeTrips,
    tripHistory,
    currentTrip,
    loading,
    error,
    newTripNotifications,
    createTrip,
    getActiveTrips,
    getTripHistory,
    acceptTrip,
    startTrip,
    completeTrip,
    cancelTrip,
    setupRealtimeListeners
  }
})
