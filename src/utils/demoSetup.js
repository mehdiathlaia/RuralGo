// Inicialitzar la base de dades amb dades de demo per a la presentació
export function initializeDemoData() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  // Verificar si ja s'ha inicialitzat
  const initialized = localStorage.getItem('demo-initialized');
  if (initialized && initialized === 'true') {
    return; // Ja inicialitzat
  }

  try {
    // Inicialitzar conductors en línia per demo
    const demoOnlineDrivers = [2, 3]; // Conductors Joan i Maria en línia
    localStorage.setItem('onlineDrivers', JSON.stringify(demoOnlineDrivers));

    // Crear some viatges de prova al notificationStore
    const demoTrips = {
      pendingTrips: [],
      activeTrips: {},
    };
    localStorage.setItem('notificationStore', JSON.stringify(demoTrips));

    // Marcar com inicialitzat
    localStorage.setItem('demo-initialized', 'true');

    console.log('✓ Demo data initialized successfully');
  } catch (error) {
    console.error('Error initializing demo data:', error);
  }
}

// Netejar la base de dades de demo
export function clearDemoData() {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    localStorage.removeItem('demo-initialized');
    localStorage.removeItem('onlineDrivers');
    localStorage.removeItem('notificationStore');
    console.log('✓ Demo data cleared');
  } catch (error) {
    console.error('Error clearing demo data:', error);
  }
}

// Crear trip de prova
export function createDemoTrip() {
  if (typeof window === 'undefined' || !window.localStorage) return null;

  const trip = {
    id: Date.now(),
    clientName: 'Maria García',
    clientId: 1,
    service: 'cultura',
    pickup: 'Carrer Major',
    pickupNumber: '45',
    destination: 'Teatre Municipal',
    destinationNumber: '10',
    vehicleType: 'normal',
    pathCondition: 'Via urbana: asfaltat',
    tripDate: new Date().toISOString().split('T')[0],
    tripTime: '14:30',
    status: 'pending',
    createdAt: new Date().toISOString(),
    assignedDriverId: null,
    driverName: null,
    driverPhone: null,
    clientLocation: { lat: 41.4, lng: 2.1 },
    pickupCoords: { lat: 41.4, lng: 2.1 },
    destinationCoords: { lat: 41.41, lng: 2.11 }
  };

  try {
    const stored = localStorage.getItem('notificationStore');
    const data = stored ? JSON.parse(stored) : { pendingTrips: [], activeTrips: {} };
    
    data.pendingTrips.push(trip);
    localStorage.setItem('notificationStore', JSON.stringify(data));
    
    console.log('✓ Demo trip created:', trip);
    return trip;
  } catch (error) {
    console.error('Error creating demo trip:', error);
    return null;
  }
}
