export const notificationService = {
  notifyFamily(msg) {
    console.log("Notificació família:", msg);
  },
  
  notifyDriverAssigned(driverName) {
    console.log(`Conductor assignat: ${driverName}`);
    return {
      type: 'success',
      message: `✓ Conductor assignat: ${driverName}`
    };
  },

  notifyDriverArriving(eta) {
    console.log(`Conductor arribant en ${eta} minuts`);
    return {
      type: 'info',
      message: `🚗 El conductor arriba en ${eta} minuts`
    };
  },

  notifyTripStarted() {
    console.log('Viatge iniciat');
    return {
      type: 'info',
      message: '🚗 Viatge iniciat'
    };
  },

  notifyTripCompleted(duration, distance) {
    console.log(`Viatge completat: ${duration} minuts, ${distance} km`);
    return {
      type: 'success',
      message: `✓ Viatge completat en ${duration} min (${distance} km)`
    };
  },

  notifyIncident(type) {
    console.log(`Incident reportat: ${type}`);
    return {
      type: 'warning',
      message: `⚠️ Incident: ${type}`
    };
  },

  notifyEmergency(location) {
    console.log(`Emergència activada a: ${location}`);
    return {
      type: 'danger',
      message: `🚨 Emergència activada a: ${location}`
    };
  }
};
