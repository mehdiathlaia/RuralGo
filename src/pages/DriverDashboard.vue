<template>
  <div class="driver-dashboard" role="main" aria-label="Panell del conductor">
    <!-- Header -->
    <div class="header">
      <div class="header-title">
        <svg class="title-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="mdiCar" fill="currentColor" />
        </svg>
        <h1>Panell del Conductor</h1>
      </div>
      <div class="header-actions">
        <button 
          @click="toggleOnlineStatus" 
          class="toggle-status" 
          :class="{ online: isOnline }"
          :aria-label="isOnline ? 'Estar fora de línia' : 'Estar en línia'"
          :aria-pressed="isOnline"
        >
          <svg class="status-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path :d="mdiCircle" fill="currentColor" />
          </svg>
          {{ isOnline ? 'En línia' : 'Fora de línia' }}
        </button>
        <button @click="goToProfile" class="profile-btn" aria-label="Anar al teu perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path :d="mdiAccount" fill="currentColor" />
          </svg>
          Perfil
        </button>
      </div>
    </div>

    <!-- Estadístiques -->
    <div class="stats-grid" role="region" aria-label="Estadístiques del conductor">
      <div class="stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="mdiCar" fill="currentColor" />
        </svg>
        <div class="stat-content">
          <p class="stat-label">Viatges Avui</p>
          <p class="stat-value">{{ driverStats.tripsToday }}</p>
        </div>
      </div>
      <div class="stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="mdiStar" fill="currentColor" />
        </svg>
        <div class="stat-content">
          <p class="stat-label">Rating</p>
          <p class="stat-value">{{ driverStats.rating }}/5</p>
        </div>
      </div>
      <div class="stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="mdiCurrencyEur" fill="currentColor" />
        </svg>
        <div class="stat-content">
          <p class="stat-label">Ingressos</p>
          <p class="stat-value">€{{ driverStats.earnings.toFixed(2) }}</p>
        </div>
      </div>
      <div class="stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24">
          <path :d="mdiRoadVariant" fill="currentColor" />
        </svg>
        <div class="stat-content">
          <p class="stat-label">KM Totals</p>
          <p class="stat-value">{{ driverStats.totalKms }} km</p>
        </div>
      </div>
      <div class="stat-card">
        <svg class="stat-icon" viewBox="0 0 24 24">
          <path :d="mdiClockOutline" fill="currentColor" />
        </svg>
        <div class="stat-content">
          <p class="stat-label">Hores En Línia</p>
          <p class="stat-value">{{ driverStats.onlineHours }}h</p>
        </div>
      </div>
    </div>

    <!-- Viatge en Curs -->
    <div v-if="currentTrip" class="current-trip-section">
      <h2>
        <svg class="inline-icon" viewBox="0 0 24 24">
          <path :d="mdiRefresh" fill="currentColor" />
        </svg>
        Viatge en Curs
      </h2>
      <div class="trip-card">
        <div class="trip-header">
          <div>
            <h3>{{ currentTrip.service }}</h3>
            <p class="client-info">Client: {{ currentTrip.clientName }}</p>
          </div>
          <div class="trip-status" :class="currentTrip.status">
            <svg class="status-label-icon" viewBox="0 0 24 24">
              <path :d="getStatusIcon(currentTrip.status)" fill="currentColor" />
            </svg>
            {{ getStatusLabel(currentTrip.status) }}
          </div>
        </div>

        <div class="trip-details">
          <div class="detail">
            <svg class="detail-icon" viewBox="0 0 24 24">
              <path :d="mdiMapMarker" fill="currentColor" />
            </svg>
            <span class="label">Recollida:</span>
            <span class="value">{{ currentTrip.pickup }} Nº{{ currentTrip.pickupNumber }}</span>
          </div>
          <div class="detail">
            <svg class="detail-icon" viewBox="0 0 24 24">
              <path :d="mdiAccountMultiple" fill="currentColor" />
            </svg>
            <span class="label">Assistents:</span>
            <span class="value">{{ currentTrip.numberOfAssistants || 0 }}</span>
          </div>
          <div class="detail">
            <svg class="detail-icon" viewBox="0 0 24 24">
              <path :d="mdiCar" fill="currentColor" />
            </svg>
            <span class="label">Vehicle:</span>
            <span class="value">{{ getVehicleType(currentTrip.vehicleType) }}</span>
          </div>
          <div class="detail">
            <svg class="detail-icon" viewBox="0 0 24 24">
              <path :d="mdiRoadVariant" fill="currentColor" />
            </svg>
            <span class="label">Camí:</span>
            <span class="value" :class="getPathClass(currentTrip.pathCondition)">
              {{ getPathConditionName(currentTrip.pathCondition) }}
            </span>
          </div>
        </div>

        <div class="trip-actions">
          <button v-if="currentTrip.status === 'driver-assigned'" @click="startTrip" class="btn btn-primary btn-large">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiCar" fill="currentColor" />
            </svg>
            Iniciar Viatge
          </button>
          <button v-if="currentTrip.status === 'in-progress'" @click="markArrived" class="btn btn-primary btn-large">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiMapMarker" fill="currentColor" />
            </svg>
            He Arribat al Client
          </button>
          <button v-if="currentTrip.status === 'arrived'" @click="completeTrip" class="btn btn-success btn-large">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiCheckCircle" fill="currentColor" />
            </svg>
            Viatge Complet
          </button>
          <button v-if="currentTrip.status === 'driver-assigned' || currentTrip.status === 'in-progress' || currentTrip.status === 'arrived'" @click="reportProblem" class="btn btn-danger">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiAlert" fill="currentColor" />
            </svg>
            Reportar Problema
          </button>
        </div>
      </div>
    </div>

    <!-- Sol·licituds Disponibles -->
    <div v-if="!currentTrip && isOnline" class="available-section">
      <h2>
        <svg class="inline-icon" viewBox="0 0 24 24">
          <path :d="mdiListBox" fill="currentColor" />
        </svg>
        Sol·licituds Disponibles ({{ availableTrips.length }})
      </h2>
      
      <div v-if="availableTrips.length === 0" class="empty-state">
        <svg class="empty-icon-svg" viewBox="0 0 24 24">
          <path :d="mdiEarth" fill="currentColor" />
        </svg>
        <p>No hi ha sol·licituds en aquest moment</p>
        <p class="empty-subtitle">Estàs disponible. Rebràs una notificació quan arribi una nova sol·licitud.</p>
      </div>

      <div v-else class="trips-grid">
        <div v-for="trip in availableTrips" :key="trip.id" class="trip-card-available">
          <div class="trip-card-header">
            <div class="service-badge" :style="{ background: getServiceColor(trip.service) }">
              <svg class="badge-icon" viewBox="0 0 24 24">
                <path :d="getServiceIcon(trip.service)" fill="currentColor" />
              </svg>
            </div>
            <div>
              <h4>{{ getServiceName(trip.service) }}</h4>
              <p class="distance">{{ calculateDistance(trip) }} km</p>
            </div>
          </div>

          <div class="trip-card-details">
            <div class="card-detail">
              <span class="label">Recollida:</span>
              <span class="value">{{ trip.pickup }} Nº{{ trip.pickupNumber }}</span>
            </div>
            <div class="card-detail">
              <span class="label">Assistents:</span>
              <span class="value">{{ trip.numberOfAssistants || 0 }}</span>
            </div>
            <div class="card-detail">
              <span class="label">Vehicle:</span>
              <span class="value">{{ getVehicleType(trip.vehicleType) }}</span>
            </div>
            <div class="card-detail">
              <span class="label">Camí:</span>
              <span class="value" :class="getPathClass(trip.pathCondition)">
                {{ getPathConditionName(trip.pathCondition) }}
              </span>
            </div>
          </div>

          <div class="card-actions">
            <button @click="viewTripDetails(trip)" class="btn btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path :d="mdiEyeOutline" fill="currentColor" />
              </svg>
              Veure Detalls
            </button>
            <button @click="acceptTrip(trip.id)" class="btn btn-accept">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path :d="mdiCheckCircle" fill="currentColor" />
              </svg>
              Acceptar
            </button>
            <button @click="rejectTrip(trip.id)" class="btn btn-reject">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path :d="mdiClose" fill="currentColor" />
              </svg>
              Rebutjar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sense Connexió -->
    <div v-if="!isOnline && !currentTrip" class="offline-state">
      <svg class="empty-icon-svg" viewBox="0 0 24 24">
        <path :d="mdiAlert" fill="currentColor" />
      </svg>
      <p>Estàs fora de línia</p>
      <p class="empty-subtitle">Torna a connectar-te per rebre sol·licituds de viatge.</p>
      <button @click="toggleOnlineStatus" class="btn btn-primary">
        <svg class="btn-icon" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        Tornar En Línia
      </button>
    </div>

    <!-- Trip Details Modal -->
    <div v-if="selectedTrip" class="modal-overlay" @click.self="selectedTrip = null">
      <div class="modal-content trip-details-modal">
        <button class="close-btn" @click="selectedTrip = null">
          <svg viewBox="0 0 24 24">
            <path :d="mdiClose" fill="currentColor" />
          </svg>
        </button>
        
        <h2>{{ getServiceName(selectedTrip.service) }}</h2>
        <p class="modal-subtitle">Client: {{ selectedTrip.clientName }}</p>

        <!-- Informació del viatge -->
        <div class="trip-info-section">
          <h3>Informació del Viatge</h3>
          <div class="info-grid">
            <div class="info-item">
              <svg class="detail-icon" viewBox="0 0 24 24">
                <path :d="mdiMapMarker" fill="currentColor" />
              </svg>
              <span class="label">Recollida:</span>
              <span class="value">{{ selectedTrip.pickup }} Nº{{ selectedTrip.pickupNumber }}</span>
            </div>
            <div class="info-item">
              <svg class="detail-icon" viewBox="0 0 24 24">
                <path :d="mdiBullseye" fill="currentColor" />
              </svg>
              <span class="label">Destí:</span>
              <span class="value">{{ selectedTrip.destination || 'No especificat' }} Nº{{ selectedTrip.destinationNumber || '-' }}</span>
            </div>
            <div class="info-item">
              <svg class="detail-icon" viewBox="0 0 24 24">
                <path :d="mdiAccountMultiple" fill="currentColor" />
              </svg>
              <span class="label">Assistents:</span>
              <span class="value">{{ selectedTrip.numberOfAssistants || 0 }}</span>
            </div>
            <div class="info-item">
              <svg class="detail-icon" viewBox="0 0 24 24">
                <path :d="mdiRoadVariant" fill="currentColor" />
              </svg>
              <span class="label">Camí:</span>
              <span class="value" :class="getPathClass(selectedTrip.pathCondition)">{{ getPathConditionName(selectedTrip.pathCondition) }}</span>
            </div>
          </div>
        </div>

        <!-- Mapa 1: Conductor a Client -->
        <div class="maps-section">
          <h3>
            <svg class="inline-icon" viewBox="0 0 24 24">
              <path :d="mdiCar" fill="currentColor" />
            </svg>
            Ruta: De tu ubicació al client
          </h3>
          <div id="driver-to-client-map" class="trip-map"></div>
          <button @click="openGoogleMapsRoute('driver-to-client')" class="btn btn-primary btn-small map-btn">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiMap" fill="currentColor" />
            </svg>
            Iniciar ruta
          </button>
        </div>

        <!-- Mapa 2: Client a Destí -->
        <div class="maps-section">
          <h3>
            <svg class="inline-icon" viewBox="0 0 24 24">
              <path :d="mdiBullseye" fill="currentColor" />
            </svg>
            Ruta: Del client al destí
          </h3>
          <div id="client-to-destination-map" class="trip-map"></div>
          <button @click="openGoogleMapsRoute('client-to-destination')" class="btn btn-primary btn-small map-btn">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiMap" fill="currentColor" />
            </svg>
            Iniciar ruta
          </button>
        </div>

        <!-- Accions -->
        <div class="modal-actions">
          <button @click="acceptTrip(selectedTrip.id)" class="btn btn-accept btn-large">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiCheckCircle" fill="currentColor" />
            </svg>
            Acceptar Viatge
          </button>
          <button @click="rejectTrip(selectedTrip.id)" class="btn btn-reject btn-large">
            <svg class="btn-icon" viewBox="0 0 24 24">
              <path :d="mdiClose" fill="currentColor" />
            </svg>
            Rebutjar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/tripStore';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { googleMapsService } from '../services/googleMapsService';
import {
  mdiCar,
  mdiStar,
  mdiCurrencyEur,
  mdiClockOutline,
  mdiCheckCircle,
  mdiMapMarker,
  mdiTrendingUp,
  mdiCircle,
  mdiAccount,
  mdiAccountMultiple,
  mdiEyeOutline,
  mdiArrowRight,
  mdiClose,
  mdiCheck,
  mdiAlert,
  mdiRefresh,
  mdiListBox,
  mdiEarth,
  mdiBullseye,
  mdiMap,
  mdiRoadVariant,
  mdiTheater,
  mdiTreeOutline,
  mdiHospitalBox
} from '@mdi/js'

const router = useRouter();
const store = useTripStore();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const isOnline = ref(true);
const selectedTrip = ref(null);
const driverId = computed(() => authStore.currentUser?.id || 2);
// Obtenir el viatge actual (acceptat per aquest conductor)
const currentTrip = computed(() => {
  const trip = notificationStore.activeTrips[driverId.value] || null;
  const allKeys = Object.keys(notificationStore.activeTrips);

  return trip;
});

let map1 = null;
let map2 = null;

const driverStats = ref({
  tripsToday: 7,
  rating: 4.8,
  totalKms: 356,
  earnings: 124.60,
  onlineHours: 8
});

// Obtenir viatges pendents del notificationStore
const availableTrips = computed(() => notificationStore.pendingTrips);

// Funcions Auxiliars
const getServiceName = (serviceId) => {
  const services = {
    'cultura': 'Activitats Culturals',
    'natura': 'Activitats de Natura',
    'sanitat': 'Serveis Sanitaris',
    'social': 'Serveis Socials'
  };
  return services[serviceId] || serviceId;
};

const getServiceIcon = (serviceId) => {
  const icons = {
    'cultura': mdiTheater,
    'natura': mdiTreeOutline,
    'sanitat': mdiHospitalBox,
    'social': mdiAccountMultiple
  };
  return icons[serviceId] || mdiMapMarker;
};

const getServiceColor = (serviceId) => {
  const colors = {
    'cultura': '#9b59b6',
    'natura': '#27ae60',
    'sanitat': '#e74c3c',
    'social': '#3498db'
  };
  return colors[serviceId] || '#95a5a6';
};

const getVehicleType = (vehicleId) => {
  const types = {
    'normal': 'Normal',
    'assisted': 'Assistit',
    'adapted': 'Adaptat'
  };
  return types[vehicleId] || vehicleId;
};

// Path condition options
const pathConditions = [
  { value: 'good', name: 'Ben pavimentada', icon: mdiCheck },
  { value: 'medium', name: 'Estat normal', icon: mdiAlert },
  { value: 'poor', name: 'Mal estat', icon: mdiClose },
  { value: 'rural', name: 'Via rural', icon: mdiRoadVariant }
];

const getPathConditionName = (pathValue) => {
  const condition = pathConditions.find(p => p.value === pathValue);
  return condition?.name || pathValue;
};

const getPathClass = (pathCondition) => {
  return pathCondition.includes('rural') ? 'path-rural' : 'path-urban';
};

const getStatusLabel = (status) => {
  const labels = {
    'driver-assigned': 'Assignat',
    'in-progress': 'En Ruta',
    'arrived': 'Arribat',
    'completed': 'Complet'
  };
  return labels[status] || status;
};

const getStatusIcon = (status) => {
  const icons = {
    'driver-assigned': mdiCheck,
    'in-progress': mdiCar,
    'arrived': mdiMapMarker,
    'completed': mdiCheckCircle
  };
  return icons[status] || mdiAlert;
};

const calculateDistance = (trip) => {
  const driverLocation = { lat: 41.3, lng: 2.0 };
  const R = 6371;
  const dLat = (trip.clientLocation.lat - driverLocation.lat) * Math.PI / 180;
  const dLng = (trip.clientLocation.lng - driverLocation.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(driverLocation.lat * Math.PI / 180) * Math.cos(trip.clientLocation.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
};

// Accions
const toggleOnlineStatus = () => {
  isOnline.value = !isOnline.value;
  
  if (isOnline.value) {
    // Posar online
    notificationStore.setDriverOnline(driverId.value);
    notificationStore.showToast('✓ Estàs en línia! Rebent sol·licituds...', 'success');
  } else {
    // Posar offline
    notificationStore.setDriverOffline(driverId.value);
    notificationStore.showToast('Has estat desconnectat.', 'info');
  }
};

const acceptTrip = (tripId) => {
  // tripId aquí es el ID del notificationStore
  const trip = availableTrips.value.find(t => t.id === tripId);
  if (trip) {
    // Acceptar el viatge via notificationStore
    const driverName = authStore.currentUser?.name || 'Conductor';
    const driverPhone = authStore.currentUser?.phone || '934 567 890';
    
    const result = notificationStore.acceptTrip(tripId, driverId.value, driverName, driverPhone);
    
    // Actualitzar el viatge en tripStore si existeix
    if (result && result.tripStoreId) {
      const tripInStore = store.trips.find(t => t.id === result.tripStoreId);
      if (tripInStore) {
        tripInStore.status = 'assigned';
        tripInStore.driverName = driverName;
        tripInStore.driverPhone = driverPhone;
        tripInStore.driverAssigned = true;
        const driverLocation = { lat: 41.3, lng: 2.0 }; // Ubicació actual del conductor
        tripInStore.driver = {
          id: driverId.value,
          name: driverName,
          phone: driverPhone,
          location: driverLocation
        };
      }
    }
    
    selectedTrip.value = null;
    
    notificationStore.showToast(`✓ Viatge acceptat! Dirigint-se al client...`, 'success');
  }
};

const rejectTrip = (tripId) => {
  const trip = notificationStore.pendingTrips.find(t => t.id === tripId);
  if (trip) {
    // Eliminar manualment de pending trips (en un sistema real, notificar el servidor)
    notificationStore.pendingTrips = notificationStore.pendingTrips.filter(t => t.id !== tripId);
    notificationStore.saveToLocalStorage();
    selectedTrip.value = null;
    notificationStore.showToast('Viatge rebutjat.', 'info');
  }
};

const startTrip = () => {
  if (currentTrip.value) {
    currentTrip.value.status = 'in-progress';
    driverStats.value.tripsToday++;
  }
};

const markArrived = () => {
  if (currentTrip.value) {
    currentTrip.value.status = 'arrived';
  }
};

const completeTrip = () => {
  if (currentTrip.value) {
    const distance = 2.5;
    const duration = 18;
    const earnings = distance * 0.35;
    
    driverStats.value.totalKms += distance;
    driverStats.value.earnings += earnings;
    
    // Notificar via notificationStore
    const tripId = currentTrip.value.id;
    notificationStore.completeTrip(tripId, driverId.value, distance, duration, earnings);
    
    notificationStore.showToast(`✓ Viatge complet! Ingressos: +€${earnings.toFixed(2)} (${distance} km)`, 'success');
    
    // Reinicialitzar estat
    store.trip = null;
    store.completeTrip('ok');
    
    driverStats.value.tripsToday++;
  }
};

const reportProblem = () => {
  alert('Has reportat un problema. L\'equip de suport contactarà aviat.');
};

const goToProfile = () => {
  router.push('/profile');
};

// Veure detalls del viatge
const viewTripDetails = (trip) => {
  selectedTrip.value = trip;
};

// Obrir ruta a Google Maps
const openGoogleMapsRoute = (routeType) => {
  if (!selectedTrip.value) return;

  const driverLocation = { lat: 41.3, lng: 2.0 };
  const pickupLocation = selectedTrip.value.clientLocation || { lat: 41.4, lng: 2.1 };
  const destinationLocation = selectedTrip.value.destinationCoords || { lat: 41.45, lng: 2.15 };

  let origin, destination;

  if (routeType === 'driver-to-client') {
    origin = `${driverLocation.lat},${driverLocation.lng}`;
    destination = `${pickupLocation.lat},${pickupLocation.lng}`;
  } else if (routeType === 'client-to-destination') {
    origin = `${pickupLocation.lat},${pickupLocation.lng}`;
    destination = `${destinationLocation.lat},${destinationLocation.lng}`;
  }

  const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
  window.open(url, '_blank');
};

// Inicialitzar mapes
const initializeMaps = async () => {
  if (!selectedTrip.value) return;

  try {
    await googleMapsService.loadGoogleMaps();
    
    if (!window.google?.maps) {
      console.error('Google Maps no disponible');
      return;
    }

    await nextTick();

    // Ubicacions reals del viatge
    const driverLocation = { lat: 41.3, lng: 2.0 };
    const pickupLocation = selectedTrip.value.clientLocation || { lat: 41.4, lng: 2.1 };
    const destinationLocation = selectedTrip.value.destinationCoords || { lat: 41.45, lng: 2.15 };

    // Mapa 1: Conductor a Client
    initializeDriverToClientMap(driverLocation, pickupLocation);
    
    // Mapa 2: Client a Destí
    initializeClientToDestinationMap(pickupLocation, destinationLocation);
  } catch (error) {
    console.error('Error carregant mapes:', error);
  }
};

const initializeDriverToClientMap = (driverLocation, pickupLocation) => {
  const container = document.getElementById('driver-to-client-map');
  if (!container) return;

  const bounds = new window.google.maps.LatLngBounds();
  bounds.extend(driverLocation);
  bounds.extend(pickupLocation);

  map1 = new window.google.maps.Map(container, {
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  map1.fitBounds(bounds);

  // Marcadors
  new window.google.maps.Marker({
    position: driverLocation,
    map: map1,
    title: 'Tu (Conductor)',
    icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
  });

  new window.google.maps.Marker({
    position: pickupLocation,
    map: map1,
    title: 'Client (Recollida)',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });

  // Ruta
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({
    map: map1,
    polylineOptions: {
      strokeColor: '#FF7300',
      strokeOpacity: 0.8,
      strokeWeight: 4
    }
  });

  directionsService.route({
    origin: driverLocation,
    destination: pickupLocation,
    travelMode: window.google.maps.TravelMode.DRIVING
  }).then(result => {
    directionsRenderer.setDirections(result);
  }).catch(error => {
    console.warn('Error en ruta 1:', error);
  });
};

const initializeClientToDestinationMap = (pickupLocation, destinationLocation) => {
  const container = document.getElementById('client-to-destination-map');
  if (!container) return;

  const bounds = new window.google.maps.LatLngBounds();
  bounds.extend(pickupLocation);
  bounds.extend(destinationLocation);

  map2 = new window.google.maps.Map(container, {
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  map2.fitBounds(bounds);

  // Marcadors
  new window.google.maps.Marker({
    position: pickupLocation,
    map: map2,
    title: 'Client (Recollida)',
    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
  });

  new window.google.maps.Marker({
    position: destinationLocation,
    map: map2,
    title: 'Destí',
    icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
  });

  // Ruta
  const directionsService = new window.google.maps.DirectionsService();
  const directionsRenderer = new window.google.maps.DirectionsRenderer({
    map: map2,
    polylineOptions: {
      strokeColor: '#00AA00',
      strokeOpacity: 0.8,
      strokeWeight: 4
    }
  });

  directionsService.route({
    origin: pickupLocation,
    destination: destinationLocation,
    travelMode: window.google.maps.TravelMode.DRIVING
  }).then(result => {
    directionsRenderer.setDirections(result);
  }).catch(error => {
    console.warn('Error en ruta 2:', error);
  });
};

// Watcher per inicialitzar mapes quan s'obre la modal
watch(selectedTrip, async (newTrip) => {
  if (newTrip) {
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 300));
    await initializeMaps();
  }
}, { deep: true });
</script>

<style scoped>
.driver-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header h1 {
  margin: 0;
  color: #000000;
  font-size: 28px;
  font-weight: 700;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.toggle-status {
  padding: 10px 20px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
  min-height: 40px;
}

.toggle-status.online {
  background: #008800;
}

.toggle-status:hover {
  transform: translateY(-2px);
}

.toggle-status:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.profile-btn {
  padding: 10px 20px;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 14px;
  min-height: 40px;
}

.profile-btn:hover {
  background: #003d99;
  transform: translateY(-2px);
}

.profile-btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  gap: 15px;
  align-items: flex-start;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 32px;
}

.stat-icon,
.detail-icon,
.btn-icon,
.inline-icon,
.empty-icon-svg {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: currentColor;
}

.detail-icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  vertical-align: middle;
}

.btn-icon {
  width: 20px;
  height: 20px;
  margin-right: 6px;
}

.inline-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
  vertical-align: middle;
}

.empty-icon-svg {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  color: #4ECDC4;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  color: #333333;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  margin: 5px 0 0 0;
  font-size: 28px;
  font-weight: 700;
  color: #0066cc;
}

.current-trip-section,
.available-section {
  background: white;
  padding: 25px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.current-trip-section h2,
.available-section h2 {
  margin-top: 0;
  color: #000000;
  font-weight: 700;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
}

.driver-status {
  margin-bottom: 30px;
}

.trip-card {
  background: #f8f9fa;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.trip-card:hover {
  border-color: #4ECDC4;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.trip-header h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.client-info {
  margin: 5px 0 0 0;
  font-size: 13px;
  color: #7f8c8d;
}

.trip-status {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label-icon {
  width: 18px;
  height: 18px;
}

.trip-status.driver-assigned {
  background: #f39c12;
}

.trip-status.in-progress {
  background: #3498db;
}

.trip-status.arrived {
  background: #27ae60;
}

.trip-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.detail {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #4ECDC4;
}

.detail .label {
  font-weight: 600;
  color: #2c3e50;
}

.detail .value {
  color: #555;
}

.path-rural {
  color: #e67e22 !important;
  font-weight: 600;
}

.path-urban {
  color: #27ae60 !important;
  font-weight: 600;
}

.trip-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.btn-large {
  flex: 1;
  min-width: 200px;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.trip-card-available {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.trip-card-available:hover {
  border-color: #4ECDC4;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
}

.trip-card-header {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  align-items: flex-start;
}

.service-badge {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.badge-icon {
  width: 32px;
  height: 32px;
}

.trip-card-header h4 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 16px;
}

.distance {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
  font-weight: 600;
}

.trip-card-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.card-detail {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  padding: 8px 0;
}

.card-detail .label {
  font-weight: 600;
  color: #2c3e50;
}

.card-detail .value {
  color: #555;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  font-size: 13px;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
  transform: translateY(-2px);
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-2px);
}

.btn-accept {
  background: #27ae60;
  color: white;
}

.btn-accept:hover {
  background: #229954;
}

.btn-reject {
  background: #e0e0e0;
  color: #555;
}

.btn-reject:hover {
  background: #c9c9c9;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
  transform: translateY(-2px);
}

.empty-state,
.offline-state {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.empty-state p,
.offline-state p {
  margin: 10px 0;
  color: #555;
}

.empty-subtitle {
  font-size: 13px;
  color: #7f8c8d;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
}

.trip-details-modal {
  background: white;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #c0392b;
  transform: scale(1.1);
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 5px;
}

.modal-subtitle {
  color: #7f8c8d;
  margin-bottom: 20px;
  font-size: 14px;
}

.trip-info-section {
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.trip-info-section h3 {
  margin-top: 0;
  color: #2c3e50;
  font-size: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item .label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 13px;
}

.info-item .value {
  color: #555;
  font-size: 14px;
}

.maps-section {
  margin-bottom: 25px;
}

.maps-section h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 16px;
}

.trip-map {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.map-btn {
  width: 100%;
  margin-top: 10px;
  padding: 10px 15px !important;
  background: #3498db !important;
  color: white !important;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.map-btn:hover {
  background: #2980b9 !important;
  transform: translateY(-2px);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.btn-large {
  flex: 1;
  padding: 12px 20px !important;
  font-size: 14px;
  font-weight: 600;
}

.btn-accept {
  background: #27ae60;
  color: white;
}

.btn-accept:hover {
  background: #229954;
}

.btn-reject {
  background: #e74c3c;
  color: white;
}

.btn-reject:hover {
  background: #c0392b;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 15px;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .toggle-status,
  .profile-btn {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .trips-grid {
    grid-template-columns: 1fr;
  }

  .trip-actions {
    flex-direction: column;
  }

  .btn {
    min-width: auto;
  }
}
</style>
