// tests/googleMapsDebug.js
// Debugging script per validar la configuració de Google Maps

export const debugGoogleMaps = () => {
  console.log('='.repeat(60));
  console.log('🔍 Google Maps Debug Report');
  console.log('='.repeat(60));

  // Verificar clau API a .env
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  console.log('\n📝 Configuració:');
  console.log(`  API Key carregada: ${apiKey ? '✅ Sí' : '❌ No'}`);
  if (apiKey) {
    const isDemo = apiKey === 'AIzaSyDemoKey';
    console.log(`  API Key és demo: ${isDemo ? '⚠️ Sí (no funciona)' : '✅ Sembla real'}`);
    console.log(`  API Key (primeres 20 chars): ${apiKey.substring(0, 20)}...`);
  }

  // Verificar Google Maps carregat
  console.log('\n📦 Google Maps JavaScript API:');
  const hasGoogleMaps = window.google && window.google.maps;
  console.log(`  window.google.maps disponible: ${hasGoogleMaps ? '✅ Sí' : '❌ No'}`);

  // Verificar servei disponible
  if (hasGoogleMaps) {
    console.log('\n🔧 Serveis disponibles:');
    console.log(`  DirectionsService: ${window.google.maps.DirectionsService ? '✅' : '❌'}`);
    console.log(`  Geocoder: ${window.google.maps.Geocoder ? '✅' : '❌'}`);
    console.log(`  places.AutocompleteService: ${window.google.maps.places?.AutocompleteService ? '✅' : '❌'}`);
  }

  console.log('\n' + '='.repeat(60));

  return {
    apiKeySet: !!apiKey,
    isDemoKey: apiKey === 'AIzaSyDemoKey',
    googleMapsLoaded: hasGoogleMaps
  };
};

// Executar automàticament si es carrega en dev
if (import.meta.env.DEV) {
  // Esperar a que Google Maps es carregue
  const checkInterval = setInterval(() => {
    if (window.google?.maps) {
      clearInterval(checkInterval);
      setTimeout(() => debugGoogleMaps(), 500);
    }
  }, 100);

  // Timeout après 10 segons
  setTimeout(() => clearInterval(checkInterval), 10000);
}
