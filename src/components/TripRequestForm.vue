<template>
  <div class="form-container">
    <h2>
      <svg class="title-icon" viewBox="0 0 24 24">
        <path :d="mdiPhone" fill="currentColor" />
      </svg>
      Nova sol·licitud RURAL-GO VIVA
    </h2>

    <!-- Estat actual -->
    <div v-if="formState === 'service-selection'" class="form-section">
      <p class="section-title">Quin servei necessites?</p>
      
      <div class="service-grid">
        <div 
          v-for="service in store.serviceOptions" 
          :key="service.id"
          @click="selectService(service.id)"
          class="service-card"
          :style="{ borderColor: selectedService === service.id ? service.color : '#ddd' }"
        >
          <div class="service-icon" :style="{ background: service.color }">
            {{ service.icon }}
          </div>
          <h4>{{ service.name }}</h4>
          <p>{{ service.description }}</p>
        </div>
      </div>

      <button @click="nextStep" class="btn btn-primary btn-wide" :disabled="!selectedService">
        Següent →
      </button>
    </div>

    <!-- Dades del trajecte -->
    <div v-if="formState === 'trip-details'" class="form-section">
      <p class="section-title">On i quan?</p>

      <!-- Recollida agrupat -->
      <div class="form-group">
        <label>
          <svg class="label-icon" viewBox="0 0 24 24">
            <path :d="mdiMapMarker" fill="currentColor" />
          </svg>
          Adreça de recollida
        </label>
        <div class="address-input-container">
          <div class="address-search-wrapper">
            <input 
              v-model="formData.pickup" 
              type="text" 
              placeholder="Introdueix una adreça..."
              class="input" 
              id="trip-address-input"
              @focus="showAddressSuggestions = true"
              @input="searchAddresses(formData.pickup)"
            />
            <div v-if="showAddressSuggestions && addressSuggestions.length > 0" class="address-suggestions">
              <div
                v-for="(suggestion, index) in addressSuggestions"
                :key="index"
                class="suggestion-item"
                @click="selectAddress(suggestion)"
              >
                <svg class="suggestion-icon" viewBox="0 0 24 24">
                  <path :d="mdiMapMarker" fill="currentColor" />
                </svg>
                <div class="suggestion-text">
                  <p class="main">{{ suggestion.structured_formatting?.main_text || suggestion.main_text || suggestion.description }}</p>
                  <p class="secondary">{{ suggestion.structured_formatting?.secondary_text || suggestion.secondary_text }}</p>
                </div>
              </div>
            </div>
          </div>
          <button 
            type="button"
            @click="useCurrentLocationForPickup"
            class="btn-location-quick"
            :disabled="isLoadingPickupLocation"
            title="Usa la teva ubicació actual com a punt de recollida"
          >
            <span class="location-icon">{{ isLoadingPickupLocation ? '⏳' : '📍' }}</span>
            <span class="location-text">{{ isLoadingPickupLocation ? 'Buscant...' : 'Ubicació actual' }}</span>
          </button>
        </div>
      </div>

      <!-- Destí agrupat -->
      <div class="form-group">
        <label>Adreça de destí</label>
        <div class="address-search-wrapper">
          <input 
            v-model="formData.destination" 
            type="text" 
            placeholder="Introdueix una adreça de destí..."
            class="input" 
            id="trip-destination-input"
            @focus="showDestinationSuggestions = true"
            @input="searchAddresses(formData.destination, true)"
          />
          <div v-if="showDestinationSuggestions && destinationSuggestions.length > 0" class="address-suggestions">
            <div
              v-for="(suggestion, index) in destinationSuggestions"
              :key="index"
              class="suggestion-item"
              @click="selectAddress(suggestion, true)"
            >
              <svg class="suggestion-icon" viewBox="0 0 24 24">
                <path :d="mdiBullseye" fill="currentColor" />
              </svg>
              <div class="suggestion-text">
                <p class="main">{{ suggestion.structured_formatting?.main_text || suggestion.main_text || suggestion.description }}</p>
                <p class="secondary">{{ suggestion.structured_formatting?.secondary_text || suggestion.secondary_text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <label>Nombre d'assistents</label>
        <div class="assistants-input-container">
          <button 
            @click="decreaseAssistants" 
            class="assistants-btn minus"
            :disabled="formData.numberOfAssistants <= 1"
          >
            −
          </button>
          <input 
            v-model.number="formData.numberOfAssistants" 
            type="number" 
            min="1" 
            max="3" 
            class="input assistants-input"
            placeholder="1"
          />
          <button 
            @click="increaseAssistants" 
            class="assistants-btn plus"
            :disabled="formData.numberOfAssistants >= 3"
          >
            +
          </button>
        </div>
        <p class="assistants-help">Màxim 3 assistents</p>
      </div>

      <div class="form-group">
        <label>Data del viatge</label>
        <input 
          v-model="formData.tripDate" 
          type="date" 
          class="input"
          :min="minDate"
        />
      </div>

      <div class="form-group">
        <label>Hora preferida</label>
        <input 
          v-model="formData.tripTime" 
          type="time" 
          class="input"
        />
      </div>

      <div class="form-group">
        <label>Estat de la via</label>
        <div class="path-options">
          <button 
            v-for="path in pathConditions"
            :key="path.value"
            @click="formData.pathCondition = path.value"
            class="path-btn"
            :class="{ active: formData.pathCondition === path.value }"
          >
            <svg class="path-icon" viewBox="0 0 24 24">
              <path :d="path.icon" fill="currentColor" />
            </svg>
            <span class="path-name">{{ path.name }}</span>
          </button>
        </div>
      </div>

      <div class="form-actions">
        <button @click="previousStep" class="btn btn-secondary">
          ← Enrere
        </button>
        <button @click="nextStep" class="btn btn-primary">
          Següent →
        </button>
      </div>
    </div>

    <!-- Confirmació i assignació -->
    <div v-if="formState === 'confirmation'" class="form-section">
      <p class="section-title">Confirmació de la sol·licitud</p>

      <div class="confirmation-box">
        <div class="confirm-item">
          <span class="label">Servei:</span>
          <span class="value">{{ getServiceName() }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">Recollida:</span>
          <span class="value">{{ formData.pickup }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">Destí:</span>
          <span class="value">{{ formData.destination }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">👥 Assistents:</span>
          <span class="value">{{ formData.numberOfAssistants }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">📅 Data:</span>
          <span class="value">{{ formData.tripDate }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">⏰ Hora:</span>
          <span class="value">{{ formData.tripTime }}</span>
        </div>
        <div class="confirm-item">
          <span class="label">🛣️ Camí:</span>
          <span class="value" :class="getPathClass()">{{ pathCondition }}</span>
        </div>
      </div>

      <div v-if="!driverAssigned" class="form-actions">
        <button @click="previousStep" class="btn btn-secondary">
          ← Enrere
        </button>
        <button @click="submitRequest" class="btn btn-success btn-large">
Confirmar i buscar conductor
        </button>
      </div>

      <div v-if="assigningDriver" class="loading-section">
        <div class="spinner"></div>
        <p>Buscant el conductor més proper...</p>
      </div>

      <div v-if="driverAssigned" class="success-section">
        <svg class="success-icon" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        <p><strong>¡Conductor assignat!</strong></p>
        <p>Ja pots veure el seguiment en temps real.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/tripStore';
import { matchingAlgorithm } from '../services/matchingAlgorithm';
import { pathConditionService } from '../services/pathConditionService';
import { googleMapsService } from '../services/googleMapsService';
import {
  mdiMapMarker,
  mdiPhone,
  mdiCheckCircle,
  mdiClose,
  mdiCar,
  mdiWheelchairAccessibility,
  mdiCheck,
  mdiAlert,
  mdiRoadVariant,
  mdiBullseye
} from '@mdi/js'

const router = useRouter();
const store = useTripStore();

const formState = ref('service-selection');
const selectedService = ref(null);
const assigningDriver = ref(false);
const driverAssigned = ref(false);
const showAddressSuggestions = ref(false);
const addressSuggestions = ref([]);
const showDestinationSuggestions = ref(false);
const destinationSuggestions = ref([]);
const isLoadingPickupLocation = ref(false);

let autocompleteService = null;
let geocoder = null;

const formData = ref({
  pickup: '',
  pickupNumber: '',
  pickupCoords: null,
  destination: '',
  destinationNumber: '',
  destinationCoords: null,
  numberOfAssistants: 1,
  tripDate: '',
  tripTime: '',
  pathCondition: 'good',
  clientLocation: { lat: 41.4, lng: 2.1 }
});

const pathCondition = ref('');

// Path condition options
const pathConditions = [
  { value: 'good', name: 'Ben pavimentada', icon: mdiCheck },
  { value: 'medium', name: 'Estat normal', icon: mdiAlert },
  { value: 'poor', name: 'Mal estat', icon: mdiClose },
  { value: 'rural', name: 'Via rural', icon: mdiRoadVariant }
];

// Calculate minimum date (today)
const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Opcions de servei
const getServiceName = () => {
  const service = store.serviceOptions.find(s => s.id === selectedService.value);
  return service?.name || '';
};

const increaseAssistants = () => {
  if (formData.value.numberOfAssistants < 3) {
    formData.value.numberOfAssistants++;
  }
};

const decreaseAssistants = () => {
  if (formData.value.numberOfAssistants > 1) {
    formData.value.numberOfAssistants--;
  }
};

const getPathClass = () => {
  return formData.value.pathCondition === 'rural' ? 'path-rural' : 'path-urban';
};

const getPathConditionName = () => {
  const condition = pathConditions.find(p => p.value === formData.value.pathCondition);
  return condition?.name || '';
};

// Navegació
const selectService = (serviceId) => {
  selectedService.value = serviceId;
};

const nextStep = () => {
  if (formState.value === 'service-selection') {
    formState.value = 'trip-details';
  } else if (formState.value === 'trip-details') {
    // Validate required fields
    if (!formData.value.tripDate || !formData.value.tripTime) {
      alert('Si us plau, selecciona la data i hora del viatge');
      return;
    }
    if (!formData.value.destination || !formData.value.destinationCoords) {
      alert('Si us plau, introdueix la ubicació de destí');
      return;
    }
    // Use selected path condition
    pathCondition.value = getPathConditionName();
    formState.value = 'confirmation';
  }
};

const previousStep = () => {
  if (formState.value === 'confirmation') {
    formState.value = 'trip-details';
  } else if (formState.value === 'trip-details') {
    formState.value = 'service-selection';
  }
};

// Inicialitzar Google Places
const initializeGooglePlaces = async () => {
  try {
    console.log('📍 Inicialitzant Google Places API...');
    
    // Verificar si Google Maps està carregat
    if (!googleMapsService.isGoogleMapsReady()) {
      console.error('❌ Google Maps no disponible - esperant...');
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!googleMapsService.isGoogleMapsReady()) {
        console.error('❌ Google Maps segueix no disponible');
        return;
      }
    }

    // Obtenir AutocompleteService
    autocompleteService = googleMapsService.getAutocompleteService();
    if (!autocompleteService) {
      console.error('❌ No es pot crear AutocompleteService');
      return;
    }
    console.log('✅ AutocompleteService creat correctament');

    // Obtenir Geocoder
    geocoder = googleMapsService.getGeocoder();
    if (!geocoder) {
      console.error('❌ No es pot crear Geocoder');
      return;
    }
    console.log('✅ Geocoder creat correctament');

  } catch (error) {
    console.error('❌ Error inicialitzant Google Places:', error.message);
  }
};

// Buscar suggerències d'adreces
const searchAddresses = async (input, isDestination = false) => {
  if (!input || input.length < 3) {
    if (isDestination) {
      destinationSuggestions.value = [];
    } else {
      addressSuggestions.value = [];
    }
    return;
  }

  if (!autocompleteService) {
    console.warn('⚠️ AutocompleteService no està carregat');
    return;
  }

  try {
    const request = {
      input: input,
      componentRestrictions: { country: ['es'] },
      types: ['geocode']
    };

    const results = await autocompleteService.getPlacePredictions(request);
    if (isDestination) {
      destinationSuggestions.value = results.predictions || [];
    } else {
      addressSuggestions.value = results.predictions || [];
    }
    
    if (results.predictions && results.predictions.length > 0) {
      console.log(`✅ ${results.predictions.length} suggeriments d'adreça trobades`);
    }
  } catch (error) {
    console.error('❌ Error buscant adreces:', error);
    if (isDestination) {
      destinationSuggestions.value = [];
    } else {
      addressSuggestions.value = [];
    }
  }
};

// Seleccionar adreça de suggerència
const selectAddress = async (suggestion, isDestination = false) => {
  if (isDestination) {
    formData.value.destination = suggestion.description;
    showDestinationSuggestions.value = false;
    destinationSuggestions.value = [];
  } else {
    formData.value.pickup = suggestion.description;
    showAddressSuggestions.value = false;
    addressSuggestions.value = [];
  }

  try {
    if (!geocoder) {
      console.warn('⚠️ Geocoder no disponible, usando fallback...');
      // Usar coordenadas de fallback
      const fallbackCoords = { lat: 41.3851, lng: 2.1734 }; // Barcelona
      
      if (isDestination) {
        formData.value.destinationCoords = fallbackCoords;
        console.log('✅ Adreça destí (fallback):', formData.value.destinationCoords);
      } else {
        formData.value.pickupCoords = fallbackCoords;
        formData.value.clientLocation = fallbackCoords;
        console.log('✅ Adreça recollida (fallback):', formData.value.pickupCoords);
      }
      return;
    }

    const result = await geocoder.geocode({ address: suggestion.description });
    if (result.results && result.results.length > 0) {
      const location = result.results[0].geometry.location;
      const coords = {
        lat: location.lat(),
        lng: location.lng()
      };
      
      if (isDestination) {
        formData.value.destinationCoords = coords;
        console.log('✅ Adreça destí geocodificada:', formData.value.destinationCoords);
      } else {
        formData.value.pickupCoords = coords;
        formData.value.clientLocation = coords;
        console.log('✅ Adreça recollida geocodificada:', formData.value.pickupCoords);
      }
    } else {
      console.warn('⚠️ Geocoder no encontró resultados, usando fallback...');
      const fallbackCoords = { lat: 41.3851, lng: 2.1734 };
      
      if (isDestination) {
        formData.value.destinationCoords = fallbackCoords;
      } else {
        formData.value.pickupCoords = fallbackCoords;
        formData.value.clientLocation = fallbackCoords;
      }
    }
  } catch (error) {
    console.error('❌ Error geocodificant adreça:', error);
    console.warn('⚠️ Usando fallback por error...');
    
    const fallbackCoords = { lat: 41.3851, lng: 2.1734 };
    if (isDestination) {
      formData.value.destinationCoords = fallbackCoords;
    } else {
      formData.value.pickupCoords = fallbackCoords;
      formData.value.clientLocation = fallbackCoords;
    }
  }
};

const useCurrentLocationForPickup = async () => {
  isLoadingPickupLocation.value = true;
  try {
    // Assegurar-se que Google Maps està carregat
    if (!googleMapsService.isGoogleMapsReady()) {
      console.log('⏳ Carregant Google Maps...');
      await googleMapsService.loadGoogleMaps();
    }

    // Obtenir o crear el geocoder
    if (!geocoder) {
      geocoder = googleMapsService.getGeocoder();
      if (!geocoder) {
        console.warn('⚠️ No es pot crear el Geocoder, usando fallback...');
        throw new Error('No es pot crear el Geocoder');
      }
    }

    // Obtenir ubicació actual
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    });

    const { latitude, longitude } = position.coords;
    console.log(`📍 Ubicació actual obtinguda: ${latitude}, ${longitude}`);

    // Fer reverse geocoding
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
          resolve(results);
        } else {
          console.warn('⚠️ Geocoding fallido:', status);
          resolve(null); // Resolver con null en lugar de rechazar
        }
      });
    });

    let address = 'Ubicació actual';
    if (result && result.length > 0) {
      address = result[0].formatted_address;
      console.log('✅ Adreça obtinguda del geocoding:', address);
    } else {
      console.warn('⚠️ No s\'ha pogut fer reverse geocoding, usando fallback...');
      // Usar fallback - aproximación cercana
      address = `Ubicació actual (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
    }

    // Configurar formData
    formData.value.pickup = address;
    formData.value.pickupCoords = {
      lat: latitude,
      lng: longitude
    };
    formData.value.clientLocation = {
      lat: latitude,
      lng: longitude
    };

    // Tancar suggestions
    showAddressSuggestions.value = false;
    addressSuggestions.value = [];

    console.log('✅ Ubicació actual configurada:', {
      address: formData.value.pickup,
      coords: formData.value.pickupCoords
    });
  } catch (error) {
    console.error('❌ Error obtenint ubicació:', error);
    console.warn('⚠️ Usando ubicación de fallback...');
    
    // Fallback completo - usar ubicación por defecto
    formData.value.pickup = 'Ubicació per defecte (Barcelona)';
    formData.value.pickupCoords = {
      lat: 41.3851,
      lng: 2.1734
    };
    formData.value.clientLocation = {
      lat: 41.3851,
      lng: 2.1734
    };
    
    console.log('✅ Utilizando ubicación de fallback:', formData.value.pickupCoords);
    
    // Mostrar mensaje más amigable
    if (error.code === 1) {
      alert('Permisos denegados. Se usará una ubicación por defecto.');
    } else {
      alert('No s\'ha pogut obtenir la teva ubicació. Se usará una ubicación por defecte.');
    }
  } finally {
    isLoadingPickupLocation.value = false;
  }
};

// Enviar sol·licitud
const submitRequest = async () => {
  assigningDriver.value = true;

  // Usar ubicació de suggerencia o ubicació per defecte
  const clientLocationToUse = formData.value.pickupCoords || formData.value.clientLocation || { lat: 41.4, lng: 2.1 };

  // Obtenir l'usuari actual
  const { useAuthStore } = await import('../store/authStore');
  const { useNotificationStore } = await import('../store/notificationStore');
  const authStore = useAuthStore();
  const notificationStore = useNotificationStore();
  
  const currentUser = authStore.currentUser;
  const clientId = currentUser?.id || 1; // Default a client 1

  // 1. Crear trajecte en el tripStore (emmagatzemat a l'aplicació)
  store.createTrip({
    clientName: currentUser?.name || 'Client',
    pickup: formData.value.pickup,
    pickupNumber: formData.value.pickupNumber || '---',
    destination: formData.value.destination,
    destinationNumber: formData.value.destinationNumber || '---',
    service: selectedService.value,
    assistants: formData.value.numberOfAssistants,
    mode: 'planificat',
    pathCondition: formData.value.pathCondition,
    tripDate: formData.value.tripDate,
    tripTime: formData.value.tripTime,
    clientLocation: clientLocationToUse,
    pickupCoords: formData.value.pickupCoords,
    destinationCoords: formData.value.destinationCoords
  });

  // Obtenir l'ID del viatge que s'acaba de crear
  const tripStoreId = store.trip?.id;

  // 2. Crear trajecte en el notificationStore per notificacions
  const trip = notificationStore.createNewTrip({
    clientName: currentUser?.name || 'Client',
    service: selectedService.value,
    pickup: formData.value.pickup,
    pickupNumber: formData.value.pickupNumber || '---',
    destination: formData.value.destination,
    destinationNumber: formData.value.destinationNumber || '---',
    assistants: formData.value.numberOfAssistants,
    mode: 'planificat',
    pathCondition: formData.value.pathCondition,
    tripDate: formData.value.tripDate,
    tripTime: formData.value.tripTime,
    clientLocation: clientLocationToUse,
    pickupCoords: formData.value.pickupCoords,
    destinationCoords: formData.value.destinationCoords,
    clientId: clientId,
    tripStoreId: tripStoreId
  }, clientId);

  // 3. Mostrar notificació al client
  notificationStore.showToast(
    `✓ Viatge sol·licitat! Els conductors estan rebent la teva petició...`,
    'success',
    3000
  );

  assigningDriver.value = false;

  // 4. Navegar a MyTrips
  setTimeout(() => {
    router.push('/my-trips');
  }, 500);
};

onMounted(async () => {
  console.log('🚀 Inicialitzant TripRequestForm...');
  console.log(`ℹ️ API Key: ${import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10) || 'No configurada'}...`);
  
  try {
    console.log('📡 Carregant Google Maps API...');
    // Carregar Google Maps amb timeout
    const loadPromise = new Promise((resolve) => {
      setTimeout(() => {
        if (window.google?.maps) {
          resolve(true);
        } else {
          resolve(false);
        }
      }, 3000);
      googleMapsService.loadGoogleMaps();
    });
    
    const loaded = await loadPromise;
    if (loaded) {
      console.log('✅ Google Maps API carregat');
      
      // Esperar una mica a que els serveis estiguin completament disponibles
      await new Promise(resolve => setTimeout(resolve, 200));
      
      console.log('🔧 Inicialitzant Google Places...');
      await initializeGooglePlaces();
      console.log('✅ Google Places inicialitzat');
    } else {
      console.warn('⚠️ Google Maps no es va poder carregar. L\'aplicació funcionarà sense autocomplete.');
    }
    
  } catch (error) {
    console.warn('⚠️ L\'aplicació funcionarà sense autocomplete. Error:', error.message);
    console.warn('Verifica:');
    console.warn('  1. Que hi ha clau API real a .env (VITE_GOOGLE_MAPS_API_KEY)');
    console.warn('  2. Que les APIs estan habilitades: Places, Directions, Geocoding');
    console.warn('  3. Que es van reiniciar dev server després de canviar .env');
  }
});
</script>

<style scoped>
.form-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-width: 600px;
  margin: 0 auto;
}

.form-container h2 {
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  width: 32px;
  height: 32px;
  color: #4ECDC4;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.service-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.service-card {
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.service-card.active {
  border-color: currentColor;
}

.service-icon {
  font-size: 32px;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
  color: white;
}

.service-card h4 {
  margin: 10px 0 5px 0;
  font-size: 14px;
  color: #2c3e50;
}

.service-card p {
  margin: 0;
  font-size: 12px;
  color: #7f8c8d;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 8px;
}

.label-icon {
  width: 20px;
  height: 20px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.input {
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.assistants-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 180px;
}

.assistants-input {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}

.assistants-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #4ECDC4;
  border-radius: 6px;
  background: white;
  color: #4ECDC4;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistants-btn:hover:not(:disabled) {
  background: #4ECDC4;
  color: white;
}

.assistants-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.assistants-help {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

.path-options {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 10px;
}

.path-btn {
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

.path-btn:hover {
  border-color: #4ECDC4;
}

.path-btn.active {
  border-color: #4ECDC4;
  background: #f0f8f7;
}

.path-icon {
  width: 20px;
  height: 20px;
}

.path-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 12px;
  text-align: center;
}

.vehicle-icon {
  width: 24px;
  height: 24px;
}

.vehicle-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 12px;
}

.vehicle-desc {
  font-size: 10px;
  color: #7f8c8d;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #44A08D;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(78, 205, 196, 0.3);
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-wide {
  width: 100%;
}

.btn-large {
  padding: 15px 20px;
  font-size: 16px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.confirmation-box {
  background: #f8f9fa;
  border-left: 4px solid #4ECDC4;
  padding: 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.confirm-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
}

.confirm-item .label {
  font-weight: 600;
  color: #2c3e50;
}

.confirm-item .value {
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

.loading-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px 0;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top-color: #4ECDC4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.success-section {
  text-align: center;
  padding: 20px 0;
}

.success-icon {
  width: 64px;
  height: 64px;
  color: #27ae60;
  margin: 0 auto 10px auto;
}

.success-section p {
  margin: 10px 0;
  color: #555;
}

.success-section p:first-of-type {
  font-weight: 600;
  color: #2c3e50;
}

.address-search-wrapper {
  position: relative;
  flex: 1;
}

.address-input-container {
  display: flex;
  gap: 8px;
  align-items: flex-start;
}

.btn-location-quick {
  flex-shrink: 0;
  padding: 12px 14px;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  white-space: nowrap;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 0;
}

.btn-location-quick .location-icon {
  font-size: 16px;
}

.btn-location-quick .location-text {
  display: none;
}

@media (min-width: 600px) {
  .btn-location-quick .location-text {
    display: inline;
  }
}

.btn-location-quick:hover:not(:disabled) {
  background: #2E7D6E;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 110, 0.3);
}

.btn-location-quick:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.address-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.suggestion-item {
  padding: 12px 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f5f5f5;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item .icon {
  font-size: 18px;
  flex-shrink: 0;
}

.suggestion-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #4ECDC4;
}

.suggestion-text {
  flex: 1;
  min-width: 0;
}

.suggestion-text .main {
  margin: 0;
  font-weight: 500;
  color: #1a1a1a;
  font-size: 14px;
}

.suggestion-text .secondary {
  margin: 3px 0 0 0;
  color: #555;
  font-size: 12px;
}

.coords-display {
  margin-top: 8px;
  font-size: 12px;
  color: #27ae60;
  font-weight: 500;
}

@media (max-width: 768px) {
  .service-grid {
    grid-template-columns: 1fr;
  }

  .vehicle-options {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-container {
    padding: 20px;
  }
}
</style>
