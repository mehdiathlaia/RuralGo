<template>
  <div class="my-trips-page">
    <div class="header">
      <h1>Els meus viatges</h1>
      <p>Viatges programats i historial</p>
    </div>

    <div v-if="loadError" class="no-trips"><p>{{ loadError }}</p><button class="btn btn-primary" @click="loadTrips">Torna-ho a provar</button></div>
    <div v-else-if="tripStore.loading && allTrips.length === 0" class="no-trips"><p>Carregant els teus viatges…</p></div>
    <div class="trips-container">
      <!-- Viatges programats -->
      <div class="trips-section">
        <h2>📅 Viatges programats</h2>
        
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
                <span class="status-badge status-planned">{{ trip.status === 'requested' ? 'Pendent de conductor' : trip.status === 'accepted' ? 'Acceptat' : 'En curs' }}</span>
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

      <!-- Viatges completats -->
      <div class="trips-section">
        <h2>Viatges completats</h2>
        
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
            <h3>Informació del viatge</h3>
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
            <h3>Informació del conductor</h3>
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

          <div v-if="false" class="detail-section">
            <h3>Valora el viatge</h3>
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
      <router-link to="/planification" class="link">Programa un viatge nou</router-link>
      <router-link to="/profile" class="link">👤 Perfil</router-link>
      <router-link to="/" class="link">← Torna al menú</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useTripStoreBackend } from '../store/tripStoreBackend';
import { googleMapsService } from '../services/googleMapsService';
import { mdiListBox, mdiMapMarker, mdiCar, mdiStar, mdiMap, mdiCheck, mdiAlert, mdiClose, mdiRoadVariant } from '@mdi/js';

const tripStore = useTripStoreBackend();
const selectedTrip = ref(null);
const hoverRating = ref(0);
const loadError = ref('');
const isCancelling = ref(false);
let map = null;

const pathConditions = [
  { value: 'good', name: 'Ben pavimentada', icon: mdiCheck },
  { value: 'medium', name: 'Estat normal', icon: mdiAlert },
  { value: 'poor', name: 'Mal estat', icon: mdiClose },
  { value: 'rural', name: 'Via rural', icon: mdiRoadVariant }
];

const normalizeTrip = (trip) => ({
  ...trip,
  id: trip._id,
  service: trip.serviceType,
  pickup: trip.pickupLocation?.address || '—',
  destination: trip.dropoffLocation?.address || '—',
  pickupCoords: trip.pickupLocation ? { lat: trip.pickupLocation.latitude, lng: trip.pickupLocation.longitude } : null,
  destinationCoords: trip.dropoffLocation ? { lat: trip.dropoffLocation.latitude, lng: trip.dropoffLocation.longitude } : null,
  tripDate: trip.createdAt,
  tripTime: trip.createdAt ? new Date(trip.createdAt).toLocaleTimeString('ca-ES', { hour: '2-digit', minute: '2-digit' }) : '',
  completedAt: trip.completedAt,
  driverName: trip.driverId?.name || '',
  driverPhone: trip.driverId?.phone || '',
  driverRating: trip.driverId?.rating || null,
  driverAssigned: Boolean(trip.driverId),
  vehicleInfo: '',
  rating: trip.rating?.passenger || null,
  pathCondition: null,
  assistants: 1,
  status: trip.status
});

const allTrips = computed(() => [
  ...tripStore.activeTrips,
  ...tripStore.tripHistory.filter(historyTrip => !tripStore.activeTrips.some(active => active._id === historyTrip._id))
].map(normalizeTrip));

const plannedTrips = computed(() => allTrips.value.filter(trip => ['requested', 'accepted', 'started'].includes(trip.status)));
const completedTrips = computed(() => allTrips.value.filter(trip => trip.status === 'completed'));

const serviceNames = {
  transport: 'Transport rural',
  cultura: 'RURAL-GO Cultura',
  familia: 'RURAL-GO Família',
  salut: 'RURAL-GO Salut',
  comunitaris: 'Serveis comunitaris',
  natura: 'RURAL-GO Natura',
  urgencia: 'Emergència'
};
const getServiceName = serviceId => serviceNames[serviceId] || serviceId || 'Servei';
const getPathConditionName = value => pathConditions.find(path => path.value === value)?.name || 'No especificat';
const getPathClass = value => value === 'rural' ? 'path-rural' : 'path-urban';
const formatDate = value => value ? new Date(value).toLocaleDateString('ca-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '';

const viewTripDetails = trip => { selectedTrip.value = trip; };

const loadTrips = async () => {
  loadError.value = '';
  try {
    await Promise.all([tripStore.getActiveTrips(), tripStore.getTripHistory()]);
    if (selectedTrip.value) selectedTrip.value = allTrips.value.find(trip => trip.id === selectedTrip.value.id) || null;
  } catch (error) {
    loadError.value = error?.message || 'No s’han pogut carregar els viatges.';
  }
};

const cancelTrip = async tripId => {
  if (isCancelling.value || !confirm('Estàs segur que vols cancel·lar aquest viatge?')) return;
  isCancelling.value = true;
  try {
    await tripStore.cancelTrip(tripId);
    selectedTrip.value = null;
    await loadTrips();
  } catch (error) {
    alert(error?.message || 'No s’ha pogut cancel·lar el viatge.');
  } finally {
    isCancelling.value = false;
  }
};

const rateTrip = rating => { hoverRating.value = rating; };
const submitRating = () => {
  alert('La valoració des del perfil de passatger encara no està disponible.');
};

const calculateTravelTime = (from, to) => {
  if (!from || !to) return 'No disponible';
  const R = 6371;
  const dLat = (to.lat - from.lat) * Math.PI / 180;
  const dLng = (to.lng - from.lng) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return `${Math.round((2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * R / 50) * 60)} min (estimació)`;
};

const openGoogleMapsRoute = () => {
  const trip = selectedTrip.value;
  if (!trip?.pickupCoords || !trip?.destinationCoords) {
    alert('No hi ha dades de ruta disponibles.');
    return;
  }
  const origin = `${trip.pickupCoords.lat},${trip.pickupCoords.lng}`;
  const destination = `${trip.destinationCoords.lat},${trip.destinationCoords.lng}`;
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`, '_blank', 'noopener,noreferrer');
};

const initializeMap = async () => {
  if (!selectedTrip.value?.pickupCoords || !selectedTrip.value?.destinationCoords) return;
  try {
    await googleMapsService.loadGoogleMaps();
    if (!window.google?.maps) return;
    await nextTick();
    const container = document.getElementById('trip-details-map');
    if (!container) return;
    const pickup = selectedTrip.value.pickupCoords;
    const destination = selectedTrip.value.destinationCoords;
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend(pickup);
    bounds.extend(destination);
    map = new window.google.maps.Map(container, { zoom: 13, mapTypeId: 'roadmap' });
    map.fitBounds(bounds);
    new window.google.maps.Marker({ position: pickup, map, title: 'Recollida' });
    new window.google.maps.Marker({ position: destination, map, title: 'Destinació' });
    const directions = new window.google.maps.DirectionsService();
    const renderer = new window.google.maps.DirectionsRenderer({ map });
    const result = await directions.route({ origin: pickup, destination, travelMode: window.google.maps.TravelMode.DRIVING });
    renderer.setDirections(result);
  } catch (error) {
    console.warn('No s’ha pogut carregar la ruta del mapa:', error);
  }
};

watch(selectedTrip, async trip => {
  if (trip) {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 250));
    await initializeMap();
  }
});

onMounted(loadTrips);
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
