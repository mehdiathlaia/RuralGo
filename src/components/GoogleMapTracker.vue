<template>
  <div class="map-container">
    <div class="map-header">
      <h2>{{ title }}</h2>
      <div class="map-info" v-if="tripInfo">
        <div class="info-item">
          <span>Pickup:</span>
          <strong>{{ tripInfo.pickup }}</strong>
        </div>
        <div class="info-item">
          <span>Destino:</span>
          <strong>{{ tripInfo.destination || 'Por asignar' }}</strong>
        </div>
        <div v-if="tripInfo.distance" class="info-item">
          <span>Distancia:</span>
          <strong>{{ tripInfo.distance }} km</strong>
        </div>
        <div v-if="tripInfo.driver" class="info-item">
          <span>Conductor:</span>
          <strong>{{ tripInfo.driver }}</strong>
        </div>
      </div>
    </div>

    <div class="map-wrapper">
      <div id="google-map" class="google-map"></div>
      
      <div class="map-controls">
        <button class="control-btn" @click="centerMap" title="Centrar mapa">
          📍
        </button>
        <button class="control-btn" @click="zoomIn" title="Ampliar">
          +
        </button>
        <button class="control-btn" @click="zoomOut" title="Reduir">
          -
        </button>
        <button class="control-btn" @click="toggleSatellite" title="Satèl·lit">
          🛰️
        </button>
      </div>

      <div class="address-search" v-if="showSearch">
        <input 
          id="address-input"
          type="text"
          placeholder="Buscar adreça..."
          class="address-input"
          ref="addressInput"
        />
        <button class="search-btn" @click="searchAddress">🔍</button>
      </div>

      <div class="legend">
        <div class="legend-item">
          <span class="legend-icon client">📍</span>
          <span>Client/Pickup</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon driver">🚗</span>
          <span>Conductor</span>
        </div>
        <div class="legend-item">
          <span class="legend-icon destination">✓</span>
          <span>Destino</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="map-loading">
      <span>⏳ Carregant mapa...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { googleMapsService } from '../services/googleMapsService';

const props = defineProps({
  title: {
    type: String,
    default: 'Rastreig en temps real'
  },
  tripInfo: {
    type: Object,
    default: null
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  onLocationSelected: {
    type: Function,
    default: null
  }
});

const map = ref(null);
const loading = ref(true);
const markers = ref([]);
const addressInput = ref(null);
let isSatellite = false;

const initMap = async () => {
  try {
    // Caregar Google Maps
    await googleMapsService.loadGoogleMaps();

    // Obtenir ubicació actual
    const currentLocation = await googleMapsService.getCurrentLocation();

    // Inicializar mapa
    map.value = googleMapsService.initMap('google-map', currentLocation, 14);

    // Afegir marcador de client si existeix
    if (props.tripInfo?.pickup) {
      try {
        const pickupLocation = await googleMapsService.geocodeAddress(props.tripInfo.pickup);
        const clientMarker = googleMapsService.addMarker(
          map.value,
          pickupLocation,
          'Pickup',
          { icon: googleMapsService.getClientIcon() }
        );
        markers.value.push(clientMarker);

        // Afegir infowindow
        googleMapsService.addInfoWindow(
          clientMarker,
          `<div class="info-window">
            <strong>📍 ${props.tripInfo.pickup}</strong>
            <p>Punto de pickup</p>
          </div>`
        );

        // Afegir marcador de driver si existeix
        if (props.tripInfo?.driver) {
          const driverMarker = googleMapsService.addMarker(
            map.value,
            currentLocation,
            `🚗 ${props.tripInfo.driver}`,
            { icon: googleMapsService.getDriverIcon() }
          );
          markers.value.push(driverMarker);

          // Afegir infowindow
          googleMapsService.addInfoWindow(
            driverMarker,
            `<div class="info-window">
              <strong>🚗 ${props.tripInfo.driver}</strong>
              <p>Conductor en camí</p>
            </div>`
          );

          // Dibuixar ruta
          googleMapsService.drawRoute(
            map.value,
            currentLocation,
            pickupLocation,
            currentLocation
          );

          // Ajustar view a tots els marcadors
          googleMapsService.fitBounds(map.value, markers.value);
        }
      } catch (error) {
        console.error('Error geocodificant adreça:', error);
      }
    }

    // Setup autocomplete si es mostrat
    if (props.showSearch && addressInput.value) {
      googleMapsService.setupAddressAutocomplete(addressInput.value, (location) => {
        if (props.onLocationSelected) {
          props.onLocationSelected(location);
        }
        // Afegir marcador
        const newMarker = googleMapsService.addMarker(
          map.value,
          location,
          'Ubicació seleccionada',
          { icon: googleMapsService.getDestinationIcon() }
        );
        markers.value.push(newMarker);
        map.value.setCenter(location);
      });
    }

    loading.value = false;
  } catch (error) {
    console.error('Error inicialitzant mapa:', error);
    loading.value = false;
  }
};

const centerMap = () => {
  if (map.value && markers.value.length > 0) {
    googleMapsService.fitBounds(map.value, markers.value);
  }
};

const zoomIn = () => {
  if (map.value) {
    map.value.setZoom(map.value.getZoom() + 1);
  }
};

const zoomOut = () => {
  if (map.value) {
    map.value.setZoom(Math.max(map.value.getZoom() - 1, 1));
  }
};

const toggleSatellite = () => {
  if (map.value) {
    isSatellite = !isSatellite;
    map.value.setMapTypeId(isSatellite ? 'satellite' : 'roadmap');
  }
};

const searchAddress = () => {
  // El autocomplete maneja la busca automàticament
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  // Limpiar
  markers.value = [];
});
</script>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 15px;
}

.map-header {
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.map-header h2 {
  margin: 0 0 12px 0;
  color: var(--dark-color);
}

.map-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 6px;
  font-size: 13px;
}

.info-item span {
  color: #666;
}

.info-item strong {
  color: var(--primary-color);
}

.map-wrapper {
  position: relative;
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.google-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.map-controls {
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: white;
  border: 1px solid #ddd;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.control-btn:hover {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: scale(1.05);
}

.address-search {
  position: absolute;
  bottom: 15px;
  left: 15px;
  right: 15px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.address-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.address-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 2px 10px rgba(78, 205, 196, 0.3);
}

.search-btn {
  padding: 12px 15px;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.search-btn:hover {
  background: #3ab5ad;
}

.legend {
  position: absolute;
  bottom: 70px;
  left: 15px;
  background: white;
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-size: 12px;
  z-index: 10;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 0;
}

.legend-icon {
  font-size: 16px;
}

.legend-icon.client {
  color: #FF6B6B;
}

.legend-icon.driver {
  color: #4ECDC4;
}

.legend-icon.destination {
  color: #27ae60;
}

.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  z-index: 100;
}

/* Info window personalitzat */
:deep(.info-window) {
  padding: 10px;
  background: white;
  border-radius: 6px;
  min-width: 150px;
}

:deep(.info-window strong) {
  display: block;
  margin-bottom: 5px;
  color: var(--dark-color);
}

:deep(.info-window p) {
  margin: 0;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .map-info {
    grid-template-columns: 1fr;
  }

  .map-controls {
    flex-direction: row;
    top: auto;
    right: auto;
    bottom: 70px;
    left: 15px;
  }

  .google-map {
    min-height: 300px;
  }
}
</style>
