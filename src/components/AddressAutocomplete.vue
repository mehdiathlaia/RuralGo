<template>
  <div class="address-autocomplete">
    <label>{{ label }}</label>
    <div class="input-wrapper">
      <input
        v-model="searchInput"
        type="text"
        :placeholder="placeholder"
        @input="onSearchInput"
        @focus="showSuggestions = true"
        class="address-input"
      />
      <div v-if="showSuggestions && suggestions.length > 0" class="suggestions-dropdown">
        <div
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
          class="suggestion-item"
        >
          <span class="icon">📍</span>
          <div class="suggestion-text">
            <div class="main">{{ suggestion.structured_formatting?.main_text || suggestion.main_text || suggestion.description }}</div>
            <div class="secondary">{{ suggestion.structured_formatting?.secondary_text || suggestion.secondary_text }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedAddress" class="selected-info">
      <p><strong>Adreça seleccionada:</strong></p>
      <p class="address-display">{{ selectedAddress.description }}</p>
      <p v-if="selectedAddress.postalCode" class="detail">CP: {{ selectedAddress.postalCode }}</p>
      <p v-if="selectedAddress.city" class="detail">Ciutat: {{ selectedAddress.city }}</p>
      <p class="coords">Lat: {{ selectedAddress.lat.toFixed(4) }}, Lng: {{ selectedAddress.lng.toFixed(4) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { googleMapsService } from '../services/googleMapsService';

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  label: {
    type: String,
    default: 'Adreça'
  },
  placeholder: {
    type: String,
    default: 'Escriu l\'adreça...'
  }
});

const emit = defineEmits(['update:modelValue']);

const searchInput = ref('');
const suggestions = ref([]);
const selectedAddress = ref(props.modelValue);
const showSuggestions = ref(false);
const searchTimeout = ref(null);

let autocompleteService = null;
let geocoder = null;

// Inicialitzar Google Places
const initializeGooglePlaces = async () => {
  try {
    // Verificar si Google Maps està carregat
    if (!googleMapsService.isGoogleMapsReady()) {
      await googleMapsService.loadGoogleMaps();
    }

    // Obtenir AutocompleteService
    autocompleteService = googleMapsService.getAutocompleteService();
    if (!autocompleteService) {
      console.warn('⚠️ AddressAutocomplete: No es pot crear AutocompleteService');
      return;
    }

    // Obtenir Geocoder
    geocoder = googleMapsService.getGeocoder();
    if (!geocoder) {
      console.warn('⚠️ AddressAutocomplete: No es pot crear Geocoder');
      return;
    }

    console.log('✅ AddressAutocomplete: Google Places inicialitzat correctament');
  } catch (error) {
    console.error('❌ Error inicialitzant Google Places:', error);
  }
};

const onSearchInput = async () => {
  clearTimeout(searchTimeout.value);

  if (!searchInput.value || searchInput.value.length < 3) {
    suggestions.value = [];
    return;
  }

  searchTimeout.value = setTimeout(() => {
    searchAddresses(searchInput.value);
  }, 300);
};

const searchAddresses = async (input) => {
  if (!autocompleteService) {
    console.warn('⚠️ AutocompleteService no disponible');
    return;
  }

  try {
    const request = {
      input: input,
      componentRestrictions: { country: ['es'] },
      types: ['geocode']
    };

    const results = await autocompleteService.getPlacePredictions(request);
    suggestions.value = results.predictions || [];
    
    console.log(`✅ ${suggestions.value.length} suggeriments d'adreça trobades`);
    if (suggestions.value.length > 0) {
      console.log('📍 Primera suggerència:', suggestions.value[0]);
      console.log('📍 structured_formatting:', suggestions.value[0].structured_formatting);
    }
  } catch (error) {
    console.error('❌ Error buscant adreces:', error);
    suggestions.value = [];
  }
};

const selectSuggestion = async (suggestion) => {
  searchInput.value = suggestion.description;
  showSuggestions.value = false;
  suggestions.value = [];

  try {
    if (!geocoder) {
      console.error('❌ Geocoder no disponible');
      return;
    }

    // Obtenir detalls de la ubicació
    const result = await geocoder.geocode({ address: suggestion.description });
    if (result.results && result.results.length > 0) {
      const location = result.results[0];
      const addressComponents = location.address_components;
      
      console.log('🔍 Componentes de adreça:', addressComponents);
      
      // Extreure components de l'adreça
      let postalCode = '';
      let city = '';
      let administrative_area = '';

      addressComponents.forEach(component => {
        console.log(`   - Type: ${component.types}, Long: ${component.long_name}`);
        
        if (component.types.includes('postal_code')) {
          postalCode = component.long_name;
          console.log(`✅ Codi Postal trobat: ${postalCode}`);
        }
        
        if (component.types.includes('locality')) {
          city = component.long_name;
          console.log(`✅ Localitat trobada: ${city}`);
        }
        
        // Backup si no trobes locality
        if (component.types.includes('administrative_area_level_2') && !city) {
          administrative_area = component.long_name;
        }
      });

      // Si no tenim city, usar administrative_area com a fallback
      if (!city && administrative_area) {
        city = administrative_area;
      }

      const coords = location.geometry.location;
      const address = {
        description: suggestion.description,
        fullAddress: suggestion.description,
        lat: coords.lat(),
        lng: coords.lng(),
        postalCode: postalCode || '',
        city: city || ''
      };

      console.log('📍 Direcció completa:', address);
      selectedAddress.value = address;
      emit('update:modelValue', address);
      console.log('✅ Emit enviado al pare:', address);
    }
  } catch (error) {
    console.error('❌ Error obtenint detalls de l\'adreça:', error);
  }
};

onMounted(() => {
  initializeGooglePlaces();
});

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    selectedAddress.value = newVal;
    searchInput.value = newVal.description || newVal.name || '';
  }
});
</script>

<style scoped>
.address-autocomplete {
  width: 100%;
}

.address-autocomplete label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.address-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.address-input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  border: 2px solid #333;
  border-top: none;
  border-radius: 0 0 6px 6px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.suggestion-item {
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  border-bottom: 1px solid #e9ecef;
  transition: background 0.2s;
  background: #ffffff !important;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f0faf8 !important;
}

.suggestion-item .icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-top: 2px;
  color: #4ECDC4;
}

.suggestion-text {
  flex: 1;
  min-width: 0;
  color: #1a1a1a !important;
  background: transparent !important;
  padding: 0 !important;
}

.suggestion-text .main {
  font-weight: 600;
  color: #1a1a1a !important;
  font-size: 14px !important;
  white-space: normal;
  word-break: break-word;
  display: block !important;
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

.suggestion-text .secondary {
  font-size: 12px !important;
  color: #666666 !important;
  margin-top: 4px;
  white-space: normal;
  word-break: break-word;
  display: block !important;
  margin: 4px 0 0 0 !important;
  padding: 0 !important;
  background: transparent !important;
}

.selected-info {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9fc;
  border-radius: 6px;
  border-left: 3px solid #4ECDC4;
}

.selected-info p {
  margin: 4px 0;
  font-size: 13px;
}

.selected-info strong {
  color: #2c3e50;
}

.address-display {
  color: #1a1a1a;
  font-weight: 600;
}

.detail {
  color: #555;
}

.coords {
  color: #999;
  font-family: monospace;
  font-size: 12px;
}
</style>
