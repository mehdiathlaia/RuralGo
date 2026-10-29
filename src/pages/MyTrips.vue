<template>
  <div class="my-trips-page">
    <div class="header">
      <h1>Els Meus Viatges</h1>
      <p>Viatges programats i historial</p>
    </div>

    <div class="trips-container">
      <!-- Viatges Programats -->
      <div class="trips-section">
        <h2>📅 Viatges Programats</h2>
        
        <div v-if="plannedTrips.length === 0" class="no-trips">
          <p>No hi ha viatges programats en aquest moment</p>
          <router-link to="/planification" class="btn btn-primary">
            Programar un nou viatge
          </router-link>
        </div>

        <div v-else class="trips-list">
          <div 
            v-for="trip in plannedTrips" 
            :key="trip.id"
            class="trip-card planned"
            @click="selectedTrip = trip"
          >
            <div class="trip-header">
              <div class="trip-info">
                <h3>{{ getServiceName(trip.service) }}</h3>
                <p class="trip-date">
                  📅 {{ formatDate(trip.tripDate) }} · ⏰ {{ trip.tripTime }}
                </p>
              </div>
              <div class="trip-status">
                <span class="status-badge status-planned">Programat</span>
              </div>
            </div>
            
            <div class="trip-details">
              <div class="detail-item">
                <span class="label">Recollida:</span>
                <span class="value">{{ trip.pickup }} Nº{{ trip.pickupNumber }}</span>
              </div>
              <div class="detail-item">
                <span class="label">👥 Assistents:</span>
                <span class="value">{{ trip.assistants || 1 }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Camí:</span>
                <span class="value" :class="getPathClass(trip.pathCondition)">
                  {{ getPathConditionName(trip.pathCondition) }}
                </span>
              </div>
              <div v-if="trip.driverAssigned" class="detail-item">
                <span class="label">🚗 Conductor:</span>
                <span class="value">{{ trip.driverName }}</span>
              </div>
            </div>

            <div class="trip-actions">
              <button @click.stop="viewTripDetails(trip)" class="btn btn-small btn-primary">
                Veure detalls →
              </button>
              <button @click.stop="cancelTrip(trip.id)" class="btn btn-small btn-danger">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Viatges Completats -->
      <div class="trips-section">
        <h2>Viatges Completats</h2>
        
        <div v-if="completedTrips.length === 0" class="no-trips">
          <p>Encara no hi ha viatges completats</p>
        </div>

        <div v-else class="trips-list">
          <div 
            v-for="trip in completedTrips" 
            :key="trip.id"
            class="trip-card completed"
            @click="selectedTrip = trip"
          >
            <div class="trip-header">
              <div class="trip-info">
                <h3>{{ getServiceName(trip.service) }}</h3>
                <p class="trip-date">
                  📅 {{ formatDate(trip.completedAt) }} · ⏰ {{ trip.tripTime }}
                </p>
              </div>
              <div class="trip-status">
                <span class="status-badge status-completed">Completat</span>
              </div>
            </div>
            
            <div class="trip-details">
              <div class="detail-item">
                <span class="label">Recollida:</span>
                <span class="value">{{ trip.pickup }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Conductor:</span>
                <span class="value">{{ trip.driverName }}</span>
              </div>
              <div v-if="trip.rating" class="detail-item">
                <span class="label">Valoració:</span>
                <span class="value">{{ trip.rating }}/5</span>
              </div>
            </div>

            <div class="trip-actions">
              <button @click.stop="viewTripDetails(trip)" class="btn btn-small btn-primary">
                Veure detalls →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Trip Details Modal -->
    <div v-if="selectedTrip" class="modal-overlay" @click.self="selectedTrip = null">
      <div class="modal-content">
        <button class="close-btn" @click="selectedTrip = null">✕</button>
        
        <h2>{{ getServiceName(selectedTrip.service) }}</h2>
        
        <!-- Map Container -->
        <div id="trip-details-map" class="trip-map"></div>

        <div class="trip-full-details">
          <div class="detail-section">
            <h3>Informació del Viatge</h3>
            <div class="detail-item">
              <span class="label">📅 Data:</span>
              <span class="value">{{ formatDate(selectedTrip.tripDate || selectedTrip.completedAt) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">⏰ Hora:</span>
              <span class="value">{{ selectedTrip.tripTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Recollida:</span>
              <span class="value">{{ selectedTrip.pickup }} Nº{{ selectedTrip.pickupNumber }}</span>
            </div>
            <div class="detail-item">
              <span class="label">🎯 Destí:</span>
              <span class="value">{{ selectedTrip.destination }} Nº{{ selectedTrip.destinationNumber }}</span>
            </div>
            <div class="detail-item">
              <span class="label">👥 Assistents:</span>
              <span class="value">{{ selectedTrip.assistants || 1 }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Camí:</span>
              <span class="value" :class="getPathClass(selectedTrip.pathCondition)">
                {{ getPathConditionName(selectedTrip.pathCondition) }}
              </span>
            </div>
          </div>

          <div class="detail-section">
            <h3>Temps de Viatge</h3>
            <div class="detail-item">
              <span class="label">⏱️ Temps conductor → Client:</span>
              <span class="value">{{ calculateTravelTime(selectedTrip.driver?.location, selectedTrip.pickupCoords) }}</span>
            </div>
            <div class="detail-item">
              <span class="label">⏱️ Temps Client → Destí:</span>
              <span class="value">{{ calculateTravelTime(selectedTrip.pickupCoords, selectedTrip.destinationCoords) }}</span>
            </div>
          </div>

          <div class="detail-section">
            <button @click="openGoogleMapsRoute" class="btn btn-primary btn-wide">
              Iniciar ruta a Google Maps
            </button>
          </div>

          <div v-if="selectedTrip.driverAssigned || selectedTrip.driverName" class="detail-section">
            <h3>Informació del Conductor</h3>
            <div class="detail-item">
              <span class="label">Nom:</span>
              <span class="value">{{ selectedTrip.driverName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">📞 Telèfon:</span>
              <span class="value">
                <a :href="`tel:${selectedTrip.driverPhone}`" class="phone-link">
                  {{ selectedTrip.driverPhone }}
                </a>
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Vehicle:</span>
              <span class="value">{{ selectedTrip.vehicleInfo }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Valoració:</span>
              <span class="value">{{ selectedTrip.driverRating }}/5</span>
            </div>
          </div>

          <div v-if="selectedTrip.status === 'completed' && !selectedTrip.rating" class="detail-section">
            <h3>Valorar el Viatge</h3>
            <div class="rating-stars">
              <button 
                v-for="star in 5"
                :key="star"
                @click="rateTrip(star)"
                class="star"
                :class="{ active: star <= hoverRating || star <= selectedTrip.tempRating }"
              >
                <svg class="star-icon" viewBox="0 0 24 24">
                  <path :d="mdiStar" fill="currentColor" />
                </svg>
              </button>
            </div>
            <button @click="submitRating" class="btn btn-primary btn-wide">
              Enviar Valoració
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation -->
    <div class="bottom-links">
      <router-link to="/planification" class="link">Programar nou viatge</router-link>
      <router-link to="/profile" class="link">👤 Perfil</router-link>
      <router-link to="/" class="link">← Tornar al menú</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useTripStore } from '../store/tripStore';
import { googleMapsService } from '../services/googleMapsService';
import {
  mdiListBox,
  mdiMapMarker,
  mdiCar,
  mdiStar,
  mdiMap,
  mdiCheck,
  mdiAlert,
  mdiClose,
  mdiRoadVariant
} from '@mdi/js'

const tripStore = useTripStore();
const selectedTrip = ref(null);
const hoverRating = ref(0);
let map = null;

// Path condition options
const pathConditions = [
  { value: 'good', name: 'Ben pavimentada', icon: mdiCheck },
  { value: 'medium', name: 'Estat normal', icon: mdiAlert },
  { value: 'poor', name: 'Mal estat', icon: mdiClose },
  { value: 'rural', name: 'Via rural', icon: mdiRoadVariant }
];

// Get computed lists
const plannedTrips = computed(() => {
  return tripStore.trips.filter(t => t.status === 'planned' || t.status === 'assigned');
});

const completedTrips = computed(() => {
  return tripStore.trips.filter(t => t.status === 'completed');
});

// Utility functions
const getServiceName = (serviceId) => {
  const service = tripStore.serviceOptions.find(s => s.id === serviceId);
  return service?.name || serviceId;
};

const getVehicleName = (vehicleId) => {
  const vehicle = tripStore.vehicleTypes.find(v => v.id === vehicleId);
  return vehicle?.name || vehicleId;
};

const getPathConditionName = (pathValue) => {
  const condition = pathConditions.find(p => p.value === pathValue);
  return condition?.name || pathValue;
};

const getPathClass = (pathValue) => {
  return pathValue === 'rural' ? 'path-rural' : 'path-urban';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

// Actions
const viewTripDetails = (trip) => {
  selectedTrip.value = trip;
};

const cancelTrip = async (tripId) => {
  if (confirm('Estàs segur que vols cancelar aquest viatge?')) {
    const { useNotificationStore } = await import('../store/notificationStore');
    const notificationStore = useNotificationStore();
    
    try {
      // El tripId que viene de trip.id es el tripStoreId (son lo mismo)
      console.log('🔍 MyTrips cancelTrip - tripId/tripStoreId:', tripId);
      
      // Cancelar al tripStore y obtener información del driver
      const tripStoreResult = tripStore.cancelTrip(tripId);
      console.log('📋 tripStore.cancelTrip result:', tripStoreResult);
      
      // Cancelar al notificationStore con la información del driver
      const result = notificationStore.cancelTrip(tripId, tripStoreResult?.driverId);
      
      if (result && result.success) {
        if (result.wasAccepted) {
          notificationStore.showToast('Viatge cancel·lat. El conductor ha rebut la notificació.', 'success');
        } else {
          notificationStore.showToast('Viatge cancel·lat correctament.', 'success');
        }
        selectedTrip.value = null;
      } else {
        notificationStore.showToast('Error al cancelar el viatge.', 'error');
      }
    } catch (error) {
      console.error('❌ Error cancelant viatge:', error);
      notificationStore.showToast('Error al cancelar el viatge.', 'error');
    }
  }
};

const rateTrip = (rating) => {
  if (selectedTrip.value) {
    selectedTrip.value.tempRating = rating;
  }
};

const submitRating = () => {
  if (selectedTrip.value && selectedTrip.value.tempRating) {
    tripStore.rateTrip(selectedTrip.value.id, selectedTrip.value.tempRating);
    selectedTrip.value.rating = selectedTrip.value.tempRating;
    alert('Gràcies per la teva valoració!');
  }
};

// Calcular temps de viatge
const calculateTravelTime = (from, to) => {
  if (!from || !to) return 'N/A';
  
  // Calcular distancia aproximada usando Haversine
  const R = 6371; // Radio de la Terra en km
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  // Estimar temps (mitja de 50 km/h en zones rurals)
  const timeMinutes = Math.round((distance / 50) * 60);
  return `${timeMinutes} min`;
};

// Obrir ruta a Google Maps
const openGoogleMapsRoute = () => {
  if (!selectedTrip.value || !selectedTrip.value.pickupCoords || !selectedTrip.value.destinationCoords) {
    alert('No hi ha dades de la ruta disponibles');
    return;
  }
  
  const pickup = `${selectedTrip.value.pickupCoords.lat},${selectedTrip.value.pickupCoords.lng}`;
  const destination = `${selectedTrip.value.destinationCoords.lat},${selectedTrip.value.destinationCoords.lng}`;
  
  // URL de Google Maps
  const url = `https://www.google.com/maps/dir/?api=1&origin=${pickup}&destination=${destination}&travelmode=driving`;
  
  window.open(url, '_blank');
};

// Inicialitzar mapa
const initializeMap = async () => {
  if (!selectedTrip.value || !selectedTrip.value.pickupCoords) {
    console.warn('No hi ha coordenades per mostrar el mapa');
    return;
  }

  try {
    // Esperar a que Google Maps estigui carregat
    await googleMapsService.loadGoogleMaps();
    
    if (!window.google?.maps) {
      console.error('Google Maps no disponible');
      return;
    }

    await nextTick();

    const mapContainer = document.getElementById('trip-details-map');
    if (!mapContainer) {
      console.error('Container de mapa no trobat');
      return;
    }

    // Obtenir ubicacions
    const pickupLocation = selectedTrip.value.pickupCoords;
    const destinationLocation = selectedTrip.value.destinationCoords;

    // Crear bounds per veure tots els punts
    const bounds = new window.google.maps.LatLngBounds();
    if (pickupLocation) bounds.extend(pickupLocation);
    if (destinationLocation) bounds.extend(destinationLocation);

    // Crear mapa
    map = new window.google.maps.Map(mapContainer, {
      zoom: 13,
      mapTypeId: 'roadmap'
    });

    // Ajustar zoom i centre
    map.fitBounds(bounds);

    // Marcar ubicació de recollida (client)
    if (pickupLocation) {
      new window.google.maps.Marker({
        position: pickupLocation,
        map: map,
        title: 'Recollida (Client)',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      });
    }

    // Marcar ubicació de destí
    if (destinationLocation) {
      new window.google.maps.Marker({
        position: destinationLocation,
        map: map,
        title: 'Destí',
        icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
      });
    }

    // Crear servei de direccions
    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: map,
      polylineOptions: {
        strokeColor: '#00AA00',
        strokeOpacity: 0.8,
        strokeWeight: 4
      }
    });

    // Ruta: Client a Destí
    if (pickupLocation && destinationLocation) {
      try {
        const result = await directionsService.route({
          origin: pickupLocation,
          destination: destinationLocation,
          travelMode: window.google.maps.TravelMode.DRIVING
        });
        
        directionsRenderer.setDirections(result);
      } catch (error) {
        console.warn('Error obtenint ruta client→destí:', error);
      }
    }

    console.log('✅ Mapa carregat correctament amb ruta client→destí');
  } catch (error) {
    console.error('Error carregant mapa:', error);
  }
};

// Watcher per detectar quan es selecciona un viatge
watch(selectedTrip, async (newTrip) => {
  if (newTrip) {
    // Esperar a que el modal es renderitzi
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 300));
    await initializeMap();
  }
}, { deep: true });

onMounted(() => {

});
</script>

<style scoped>
.my-trips-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  color: white;
}

.header p {
  margin: 10px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.trips-container {
  max-width: 1000px;
  margin: 0 auto;
}

.trips-section {
  margin-bottom: 40px;
}

.trips-section h2 {
  color: white;
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255,255,255,0.3);
}

.no-trips {
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  color: rgba(255,255,255,0.8);
}

.no-trips .btn {
  margin-top: 15px;
}

.trips-list {
  display: grid;
  gap: 15px;
}

.trip-card {
  background: white;
  border-radius: 12px;
  padding: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid #4ECDC4;
}

.trip-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.trip-card.planned {
  border-left-color: #3498db;
}

.trip-card.completed {
  border-left-color: #27ae60;
  opacity: 0.9;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.trip-info h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.trip-date {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 13px;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.status-planned {
  background: #3498db;
  color: white;
}

.status-completed {
  background: #27ae60;
  color: white;
}

.trip-details {
  display: grid;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ecf0f1;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.detail-item .label {
  font-weight: 600;
  color: #34495e;
}

.detail-item .value {
  color: #555;
}

.path-rural {
  color: #e67e22;
  font-weight: 600;
}

.path-urban {
  color: #27ae60;
  font-weight: 600;
}

.trip-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
  transform: translateY(-2px);
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
}

.btn-wide {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  width: 100%;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #2c3e50;
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
}

.trip-map {
  width: 100%;
  height: 250px;
  background: #ecf0f1;
  border-radius: 8px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #95a5a6;
  font-size: 14px;
}

.trip-full-details {
  display: grid;
  gap: 20px;
}

.detail-section {
  padding-bottom: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.detail-section:last-child {
  border-bottom: none;
}

.detail-section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 16px;
}

.phone-link {
  color: #3498db;
  text-decoration: none;
}

.phone-link:hover {
  text-decoration: underline;
}

.rating-stars {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  justify-content: center;
}

.star {
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.3;
  transition: opacity 0.3s ease;
  padding: 5px;
  display: flex;
  align-items: center;
}

.star-icon {
  width: 32px;
  height: 32px;
  color: #f39c12;
}

.star.active {
  opacity: 1;
}

.star:hover {
  transform: scale(1.2);
}

.bottom-links {
  max-width: 1000px;
  margin: 40px auto 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 10px;
  transition: all 0.3s ease;
}

.link:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 24px;
  }

  .trip-actions {
    flex-direction: column;
  }

  .btn-small {
    width: 100%;
  }

  .modal-content {
    padding: 20px;
  }
}
</style>
