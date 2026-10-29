import { defineStore } from 'pinia';

export const useTripStore = defineStore('trip', {
  state: () => ({
    // Dades del trajecte actual
    trip: null,
    trips: [],
    
    // Drivers disponibles
    drivers: [
      { id: 1, name: 'Joan Riera', vehicle: 'Citroën Berlingo Adaptada', plate: '5482-KDL', type: 'adapted', location: { lat: 41.4, lng: 2.1 }, available: true, rating: 4.8 },
      { id: 2, name: 'Maria Garcia', vehicle: 'Ford Transit Assistit', plate: '3821-JKL', type: 'assisted', location: { lat: 41.42, lng: 2.15 }, available: true, rating: 4.9 },
      { id: 3, name: 'Pere Martínez', vehicle: 'Volkswagen Caddy Normal', plate: '7392-MNO', type: 'normal', location: { lat: 41.38, lng: 2.05 }, available: true, rating: 4.7 },
      { id: 4, name: 'Teresa López', vehicle: 'Mercedes Sprinter Adaptada', plate: '1029-PQR', type: 'adapted', location: { lat: 41.45, lng: 2.12 }, available: false, rating: 4.9 }
    ],
    
    // Ruta i seguiment
    route: {
      pickupAddress: null,
      pickupNumber: null,
      destination: null,
      pathCondition: null,
      totalKm: null,
      remainingKm: null,
      estimatedTime: null,
      actualStartTime: null,
      estimatedArrival: null
    },
    
    // Opcions de servei RURAL-GO
    serviceOptions: [
      { id: 'cultura', name: 'RURAL-GO Cultura', icon: '🎭', color: '#FF6B6B', description: 'Teatre, cinema, museus, concerts' },
      { id: 'familia', name: 'RURAL-GO Família', icon: '👨‍👩‍👧', color: '#4ECDC4', description: 'Visites familiars i celebracions' },
      { id: 'salut', name: 'RURAL-GO Salut', icon: '🏥', color: '#45B7D1', description: 'CAP, hospital, farmàcia' },
      { id: 'compres', name: 'RURAL-GO Serveis Comunitaris', icon: '🛒', color: '#96CEB4', description: 'Anar de compres, voluntariat i activitats locals' },
      { id: 'natura', name: 'RURAL-GO Natura', icon: '🌲', color: '#FFEAA7', description: 'Passejades i activitats naturals' }
    ],
    
    // Tipus de vehicle
    vehicleTypes: [
      { id: 'normal', name: 'Normal', icon: '🚗', description: 'Transport estàndard' },
      { id: 'assisted', name: 'Assistit', icon: '♿', description: 'Amb suport d\'accés' },
      { id: 'adapted', name: 'Adaptat', icon: '🦽', description: 'Completament accessible' }
    ],
    
    // Mode d'emergència
    emergencyMode: false,
    
    // Estat de seguiment
    trackingActive: false,
    
    // Valoració final
    finalRating: null,
    incidentReport: null
  }),

  getters: {
    availableDrivers: (state) => state.drivers.filter(d => d.available),
    
    getServiceByType: (state) => (type) => state.serviceOptions.find(s => s.id === type),
    
    getVehicleType: (state) => (type) => state.vehicleTypes.find(v => v.id === type),
    
    currentTrip: (state) => state.trip
  },

  actions: {
    // Crear nou trajecte
    createTrip(data) {
      this.trip = {
        id: Date.now(),
        clientName: data.clientName || 'Client',
        pickup: data.pickup,
        pickupNumber: data.pickupNumber,
        destination: data.destination,
        destinationNumber: data.destinationNumber,
        service: data.service,
        vehicleType: data.vehicleType,
        assistants: data.assistants || 1,
        numberOfAssistants: data.assistants || 1,
        mode: data.mode,
        pathCondition: data.pathCondition,
        tripDate: data.tripDate,
        tripTime: data.tripTime,
        status: 'planned',
        createdAt: new Date(),
        completedAt: null,
        driver: null,
        driverName: null,
        driverPhone: null,
        driverRating: 0,
        vehicleInfo: null,
        startTime: null,
        endTime: null,
        totalKm: 0,
        remainingKm: 0,
        estimatedTime: 0,
        incidentReport: null,
        finalState: null,
        rating: 0,
        driverAssigned: false,
        clientLocation: data.clientLocation || { lat: 41.4, lng: 2.1 },
        pickupCoords: data.pickupCoords || data.clientLocation || { lat: 41.4, lng: 2.1 },
        destinationCoords: data.destinationCoords || { lat: 41.4, lng: 2.1 }
      };
      this.trips.push(this.trip);
    },

    // Assignar conductor (algoritme intel·ligent)
    assignDriver(driverId) {
      const driver = this.drivers.find(d => d.id === driverId);
      if (driver && this.trip) {
        this.trip.driver = {
          id: driver.id,
          name: driver.name,
          vehicle: driver.vehicle,
          plate: driver.plate,
          type: driver.type,
          rating: driver.rating,
          location: driver.location,
          eta: this.calculateDistance(driver.location, this.trip.clientLocation)
        };
        // Actualitzar les dades del conductor al viatge
        this.trip.driverName = driver.name;
        this.trip.driverPhone = driver.phone || '934 567 890';
        this.trip.driverRating = driver.rating;
        this.trip.vehicleInfo = `${driver.vehicle} (${driver.plate})`;
        this.trip.driverAssigned = true;
        this.trip.status = 'assigned';
        this.trip.estimatedTime = this.trip.driver.eta + 15; // minuts
        this.trip.startTime = new Date();
        driver.available = false;
      }
    },

    // Calcular distància entre dos punts
    calculateDistance(from, to) {
      const R = 6371; // Radi de la Terra en km
      const dLat = (to.lat - from.lat) * Math.PI / 180;
      const dLng = (to.lng - from.lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return Math.round((R * c) * 10) / 10; // km amb 1 decimal
    },

    // Actualitzar quilòmetres restants
    updateKm(km) {
      if (this.trip) {
        this.trip.remainingKm = Math.max(0, km);
        if (km <= 0.5) {
          this.trip.status = 'arrived';
        }
      }
    },

    // Completar trajecte
    completeTrip(finalState, incidentReport = null) {
      if (this.trip) {
        this.trip.status = 'completed';
        this.trip.finalState = finalState; // 'ok', 'incidence'
        this.trip.incidentReport = incidentReport;
        this.trip.endTime = new Date();
        
        // Alliberar conductor
        if (this.trip.driver) {
          const driver = this.drivers.find(d => d.id === this.trip.driver.id);
          if (driver) driver.available = true;
        }
      }
    },

    // Marcar com a en viatge
    startTrip() {
      if (this.trip && this.trip.driver) {
        this.trip.status = 'in-progress';
        this.trip.totalKm = this.calculateDistance(this.trip.driver.location, this.trip.clientLocation) + 2; // Distància estimada
        this.trip.remainingKm = this.trip.totalKm;
        this.trackingActive = true;
      }
    },

    // Establir valoració final
    rateTrip(rating) {
      if (this.trip) {
        this.trip.rating = rating;
      }
    },

    // Mode emergència
    activateEmergency(clientName, clientLocation) {
      this.emergencyMode = true;
      this.createTrip({
        clientName,
        clientLocation,
        service: 'emergencia',
        vehicleType: 'adapted',
        mode: 'urgencia',
        pickup: 'Ubicació actual',
        pickupNumber: '---'
      });
    },

    // Desactivar emergència
    deactivateEmergency() {
      this.emergencyMode = false;
    },

    // Cancelar viatge
    cancelTrip() {
      if (this.trip && this.trip.driver) {
        const driver = this.drivers.find(d => d.id === this.trip.driver.id);
        if (driver) driver.available = true;
      }
      this.trip = null;
      this.trackingActive = false;
    },

    // Obtenir historial de viatges
    getTripsHistory() {
      return this.trips.filter(t => t.status === 'completed').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    // Obtenir viatges filtrats per data
    getTripsByDate(startDate, endDate) {
      return this.trips.filter(t => {
        const tripDate = new Date(t.createdAt);
        return tripDate >= startDate && tripDate <= endDate && t.status === 'completed';
      });
    },

    // Calcular estadístiques de viatges
    getStatistics() {
      const completedTrips = this.getTripsHistory();
      return {
        totalTrips: completedTrips.length,
        averageRating: completedTrips.length > 0 ? (completedTrips.reduce((sum, t) => sum + t.rating, 0) / completedTrips.length).toFixed(1) : 0,
        totalKm: completedTrips.reduce((sum, t) => sum + (t.totalKm || 0), 0).toFixed(1),
        tripsThisMonth: completedTrips.filter(t => {
          const tripDate = new Date(t.createdAt);
          const now = new Date();
          return tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear();
        }).length,
        incidentsReported: completedTrips.filter(t => t.finalState === 'incidence').length
      };
    },

    // Marcar com a arribat
    markAsArrived() {
      if (this.trip && this.trip.driver) {
        this.trip.status = 'arrived';
      }
    },

    // Cancelar viatge
    cancelTrip(tripId) {
      const trip = this.trips.find(t => t.id === tripId);
      if (trip) {
        trip.status = 'cancelled';
        
        // Si el conductor estava assignat, marcar-lo com disponible
        let assignedDriver = null;
        if (trip.driver) {
          const driver = this.drivers.find(d => d.id === trip.driver.id);
          if (driver) {
            driver.available = true;
            assignedDriver = driver;
          }
        }
        
        // Retornar informació del conductor si estava assignat
        return {
          success: true,
          assignedDriver: assignedDriver,
          driverId: trip.driver?.id,
          driverName: trip.driver?.name
        };
      }
      return { success: false };
    },

    // Valorar viatge
    rateTrip(tripId, rating) {
      const trip = this.trips.find(t => t.id === tripId);
      if (trip) {
        trip.rating = rating;
      }
    }
  }
});
