<template>
  <div class="map-tracker-container">
    <div class="map-section">
      <h3>
        <svg class="section-icon" viewBox="0 0 24 24">
          <path :d="mdiMap" fill="currentColor" />
        </svg>
        Ruta del trajecte
      </h3>
      
      <!-- Informació de la ruta -->
      <div v-if="trip" class="route-info">
        <div class="info-row">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiMapMarker" fill="currentColor" />
          </svg>
          <span class="label">Recollida:</span>
          <span class="value">{{ trip.pickup }} Nº{{ trip.pickupNumber }}</span>
        </div>
        <div v-if="trip.driver" class="info-row">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiCar" fill="currentColor" />
          </svg>
          <span class="label">Conductor:</span>
          <span class="value">{{ trip.driver.name }}</span>
        </div>
        <div v-if="distance" class="info-row">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiRuler" fill="currentColor" />
          </svg>
          <span class="label">Distància:</span>
          <span class="value">{{ distance.toFixed(2) }} km</span>
        </div>
        <div v-if="estimatedTime" class="info-row">
          <svg class="icon" viewBox="0 0 24 24">
            <path :d="mdiClockOutline" fill="currentColor" />
          </svg>
          <span class="label">Temps estimat:</span>
          <span class="value">{{ estimatedTime }} min</span>
        </div>
      </div>

      <!-- Mapa -->
      <div class="map-canvas" id="google-map"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useTripStore } from '../store/tripStore';
import { googleMapsService } from '../services/googleMapsService';
import {
  mdiMap,
  mdiMapMarker,
  mdiCar,
  mdiRuler,
  mdiClockOutline
} from '@mdi/js';

const store = useTripStore();
const trip = computed(() => store.trip);

const distance = ref(null);
const estimatedTime = ref(null);

let googleMap = null;
let geocoder = null;
let directionsService = null;
let directionsRenderer = null;
let markers = {
  driver: null,
  client: null
};

// Inicialitzar mapa
const initMap = async () => {
  try {
    // Verificar Google Maps
    if (!googleMapsService.isGoogleMapsReady()) {
      console.error('❌ Google Maps no disponible');
      return;
    }

    const mapElement = document.getElementById('google-map');
    if (!mapElement) {
      console.error('❌ Element del mapa no trobat');
      return;
    }

    // Barcelona coord per defecte
    const center = { lat: 41.3851, lng: 2.1734 };
    
    console.log('🗺️ Creant mapa a:', center);
    googleMap = new window.google.maps.Map(mapElement, {
      zoom: 14,
      center: center,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true
    });

    // Inicialitzar serveis
    console.log('🔧 Inicialitzant serveis de Google Maps...');
    
    geocoder = new window.google.maps.Geocoder();
    
    directionsService = googleMapsService.getDirectionsService();
    if (!directionsService) {
      console.error('❌ No es pot crear DirectionsService');
      return;
    }

    directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: googleMap,
      polylineOptions: {
        strokeColor: '#4ECDC4',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    // Marcadors
    console.log('📍 Creant marcadors...');
    markers.driver = new window.google.maps.Marker({
      map: googleMap,
      title: 'Conductor',
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    markers.client = new window.google.maps.Marker({
      map: googleMap,
      title: 'Client',
      icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });

    console.log('✅ Mapa inicialitzat correctament');

  } catch (error) {
    console.error('❌ Error inicialitzant mapa:', error.message);
  }
};

// Calcular ruta entre conductor i client
const calculateRoute = async () => {
  if (!trip.value || !trip.value.driver || !directionsService) {
    console.log('⚠️ No es pot calcular ruta - falten dades necessàries');
    return;
  }

  try {
    const driverLocation = trip.value.driver.location;
    const clientLocation = trip.value.clientLocation || trip.value.pickupCoords;

    if (!clientLocation) {
      console.warn('⚠️ No hi ha ubicació del client');
      return;
    }

    if (!driverLocation) {
      console.warn('⚠️ No hi ha ubicació del conductor');
      return;
    }

    console.log('📍 Calculant ruta:', {
      conductor: driverLocation,
      client: clientLocation
    });

    // Actualitzar marcadors
    if (markers.driver && driverLocation) {
      markers.driver.setPosition({
        lat: driverLocation.lat,
        lng: driverLocation.lng
      });
    }

    if (markers.client && clientLocation) {
      markers.client.setPosition({
        lat: clientLocation.lat,
        lng: clientLocation.lng
      });
    }

    // Calcular ruta
    const request = {
      origin: { lat: driverLocation.lat, lng: driverLocation.lng },
      destination: { lat: clientLocation.lat, lng: clientLocation.lng },
      travelMode: 'DRIVING',
      region: 'es'
    };

    console.log('📡 Sol·licitant ruta a Directions API...');
    const result = await directionsService.route(request);
    
    if (result.routes && result.routes.length > 0) {
      console.log('✅ Ruta calculada correctament');
      directionsRenderer.setDirections(result);
      
      const route = result.routes[0];
      const leg = route.legs[0];
      
      // Calcular distància i temps
      const distanceInMeters = leg.distance.value;
      distance.value = distanceInMeters / 1000;
      
      const durationInSeconds = leg.duration.value;
      estimatedTime.value = Math.ceil(durationInSeconds / 60);

      console.log(`✅ Distància: ${distance.value.toFixed(2)}km, Temps: ${estimatedTime.value}min`);

      // Centrar mapa a la ruta
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend({ lat: driverLocation.lat, lng: driverLocation.lng });
      bounds.extend({ lat: clientLocation.lat, lng: clientLocation.lng });
      googleMap.fitBounds(bounds, 100);
    } else {
      console.error('❌ No s\'ha trobat cap ruta disponible');
    }
  } catch (error) {
    console.error('❌ Error calculant ruta:', error.message);
    if (error.message?.includes('REQUEST_DENIED')) {
      console.error('❌ Accés denegat a Directions API - verifica permissos');
    } else if (error.message?.includes('ZERO_RESULTS')) {
      console.error('❌ No s\'ha trobat ruta entre les dues ubicacions');
    }
  }
};

// Watch per a canvis de trip
watch(() => trip.value, (newTrip) => {
  if (newTrip && newTrip.driver && googleMap) {
    calculateRoute();
  }
}, { deep: true });

onMounted(async () => {
  console.log('🚀 Inicialitzant MapTracker...');
  try {
    await googleMapsService.loadGoogleMaps();
    console.log('✅ Google Maps carregat');
    
    await new Promise(resolve => setTimeout(resolve, 200));
    await initMap();
    console.log('✅ Mapa inicialitzat');
    
    // Calcular ruta si ja hi ha trip
    if (trip.value && trip.value.driver) {
      console.log('📍 Calculant ruta inicial...');
      await calculateRoute();
    }
  } catch (error) {
    console.error('❌ Error carregant Google Maps:', error.message);
  }
});

onUnmounted(() => {
  if (markers.driver) markers.driver.setMap(null);
  if (markers.client) markers.client.setMap(null);
});
</script>

<style scoped>
.map-tracker-container {
  display: block;
  margin-top: 20px;
}

.map-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-section h3 {
  margin-top: 0;
  color: #2c3e50;
}

.section-icon {
  width: 24px;
  height: 24px;
  display: inline;
  margin-right: 8px;
  vertical-align: middle;
}

.icon {
  width: 20px;
  height: 20px;
  display: inline;
  margin-right: 8px;
  vertical-align: middle;
}

.map-canvas {
  width: 100%;
  height: 500px;
  border: 2px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 15px;
  position: relative;
  background: white;
}

.route-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #4ECDC4;
}

.label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.value {
  color: #555;
  font-size: 14px;
}

@media (max-width: 768px) {
  .map-canvas {
    height: 350px;
  }
  
  .map-section {
    padding: 15px;
  }
}
</style>
