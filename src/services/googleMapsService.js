// Google Maps Service
// Integración con Google Maps API

export const googleMapsService = {
  // Configuración
  API_KEY: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDemoKey',
  MAP_ID: 'demo-map-id',
  loaded: false,
  loadPromise: null,

  // Cargar Google Maps
  async loadGoogleMaps() {
    return new Promise((resolve, reject) => {
      // Si ya está cargado, resolver inmediatamente
      if (this.loaded && window.google?.maps) {
        resolve();
        return;
      }

      // Si hay una carga en progreso, esperar a esa promesa
      if (this.loadPromise) {
        return this.loadPromise.then(resolve).catch(reject);
      }

      // Si ya existe un script en el DOM, esperar a que cargue
      if (document.querySelector('script[src*="maps.googleapis.com"]')) {
        const checkInterval = setInterval(() => {
          if (window.google?.maps) {
            this.loaded = true;
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);
        return;
      }

      // Crear y cargar el script
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.API_KEY}&libraries=places,geometry,directions`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.loaded = true;
        console.log('✅ Google Maps API carregat correctament');
        resolve();
      };
      
      script.onerror = () => {
        const isDemo = this.API_KEY === 'AIzaSyDemoKey';
        const errorMsg = isDemo 
          ? '❌ API key de demostració - afegeix la clau real a .env (VITE_GOOGLE_MAPS_API_KEY) i reinicia'
          : '❌ Error al carregar Google Maps. Verifica que la clau API és correcta i que les APIs estan habilitades';
        
        console.error(errorMsg);
        console.warn('ℹ️ APIs necessàries: Places, Directions, Geocoding');
        console.warn('ℹ️ Origins autoritzats: localhost:5173, localhost:5174');
        
        this.loaded = false;
        reject(new Error(errorMsg));
      };
      
      document.head.appendChild(script);
    });
  },

  // Inicialitzar mapa
  initMap(elementId, center = { lat: 41.3851, lng: 2.1734 }, zoom = 13) {
    return new google.maps.Map(document.getElementById(elementId), {
      zoom: zoom,
      center: center,
      mapTypeControl: true,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      styles: this.getMapStyles()
    });
  },

  // Estilos per al mapa
  getMapStyles() {
    return [
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#c9c9c9' }]
      },
      {
        featureType: 'landscape',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ebebeb' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.fill',
        stylers: [{ color: '#ffffff' }]
      }
    ];
  },

  // Afegir marcador
  addMarker(map, position, title, options = {}) {
    return new google.maps.Marker({
      position,
      map,
      title,
      icon: options.icon || null,
      animation: options.animation || null,
      ...options
    });
  },

  // Afegir InfoWindow
  addInfoWindow(marker, content) {
    const infoWindow = new google.maps.InfoWindow({
      content: content
    });
    marker.addListener('click', () => {
      infoWindow.open(marker.getMap(), marker);
    });
    return infoWindow;
  },

  // Dibuixar ruta
  drawRoute(map, startLocation, endLocation, driverLocation = null) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#4ECDC4',
        strokeWeight: 4,
        strokeOpacity: 0.8
      }
    });

    const request = {
      origin: startLocation,
      destination: endLocation,
      travelMode: 'DRIVING'
    };

    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result);
        
        // Afegir marcador del conductor si existeix
        if (driverLocation) {
          this.addMarker(map, driverLocation, 'Conductor', {
            icon: this.getDriverIcon()
          });
        }
      }
    });

    return directionsRenderer;
  },

  // Icons personalitzats
  getClientIcon() {
    return {
      path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
      fillColor: '#FF6B6B',
      fillOpacity: 0.8,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 1.5
    };
  },

  getDriverIcon() {
    return {
      path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h7.59L13.96 12.29z',
      fillColor: '#4ECDC4',
      fillOpacity: 0.8,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 1.5
    };
  },

  getDestinationIcon() {
    return {
      path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
      fillColor: '#27ae60',
      fillOpacity: 0.8,
      strokeColor: '#fff',
      strokeWeight: 2,
      scale: 1.5
    };
  },

  // Geocodificar adreça
  geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            formattedAddress: results[0].formatted_address
          });
        } else {
          reject('No es va poder geocodificar l\'adreça: ' + status);
        }
      });
    });
  },

  // Calcular distancia
  calculateDistance(origin, destination) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.DistanceMatrixService();
      service.getDistanceMatrix({
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {
          const distance = response.rows[0].elements[0].distance.value / 1000; // en km
          const duration = response.rows[0].elements[0].duration.text;
          resolve({ distance, duration });
        } else {
          reject('Error en la consulta de distancia');
        }
      });
    });
  },

  // Verificar si Google Maps està carregat
  isGoogleMapsReady() {
    if (!this.loaded || !window.google?.maps) {
      console.warn('⚠️ Google Maps no està carregat');
      return false;
    }
    return true;
  },

  // Obtenir AutocompleteService
  getAutocompleteService() {
    if (!this.isGoogleMapsReady()) {
      console.error('❌ Google Maps no disponible - AutocompleteService no es pot crear');
      return null;
    }
    if (!window.google.maps.places) {
      console.error('❌ Places API no disponible. Verifica que Places API està habilitada a Google Cloud');
      return null;
    }
    try {
      return new window.google.maps.places.AutocompleteService();
    } catch (error) {
      console.error('❌ Error al crear AutocompleteService:', error);
      return null;
    }
  },

  // Obtenir Geocoder
  getGeocoder() {
    if (!this.isGoogleMapsReady()) {
      console.error('❌ Google Maps no disponible - Geocoder no es pot crear');
      return null;
    }
    try {
      return new window.google.maps.Geocoder();
    } catch (error) {
      console.error('❌ Error al crear Geocoder:', error);
      return null;
    }
  },

  // Obtenir DirectionsService
  getDirectionsService() {
    if (!this.isGoogleMapsReady()) {
      console.error('❌ Google Maps no disponible - DirectionsService no es pot crear');
      return null;
    }
    if (!window.google.maps.DirectionsService) {
      console.error('❌ Directions API no disponible. Verifica que Directions API està habilitada a Google Cloud');
      return null;
    }
    try {
      return new window.google.maps.DirectionsService();
    } catch (error) {
      console.error('❌ Error al crear DirectionsService:', error);
      return null;
    }
  },

  // Autocomplete per a adreçes
  setupAddressAutocomplete(inputElement, callback) {
    if (!this.isGoogleMapsReady()) {
      console.error('❌ Google Maps no carregat - autocomplete no es pot configurar');
      return null;
    }

    try {
      const autocomplete = new google.maps.places.Autocomplete(inputElement, {
        componentRestrictions: { country: 'es' },
        fields: ['formatted_address', 'geometry', 'address_components']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          callback({
            address: place.formatted_address,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          });
        }
      });

      return autocomplete;
    } catch (error) {
      console.error('❌ Error al configurar autocomplete:', error);
      return null;
    }
  },

  // Búsqueda de llocs propers
  nearbySearch(map, center, radius, types) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(map);
      const request = {
        location: center,
        radius: radius,
        types: types
      };

      service.nearbySearch(request, (results, status) => {
        if (status === 'OK') {
          resolve(results);
        } else {
          reject('Error en nearbySearch: ' + status);
        }
      });
    });
  },

  // Bounds per veure múltiples markers
  fitBounds(map, markers) {
    const bounds = new google.maps.LatLngBounds();
    markers.forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    map.fitBounds(bounds);
  },

  // Simular ubicació actual (per a development)
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          error => {
            // Fallback a Barcelona si no es pot obtenir ubicació
            resolve({
              lat: 41.3851,
              lng: 2.1734
            });
          }
        );
      } else {
        resolve({
          lat: 41.3851,
          lng: 2.1734
        });
      }
    });
  }
};
