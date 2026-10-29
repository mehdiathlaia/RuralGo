import { defineStore } from 'pinia';
import { useAdminStore } from './adminStore';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    selectedDateRange: 'month', // 'week', 'month', 'year', 'all'
  }),

  getters: {
    getDashboardStats: (state) => {
      const adminStore = useAdminStore();
      const trips = adminStore.allTrips;
      const users = adminStore.allUsers;

      // Calcular estadístiques per tipus d'usuari
      const drivers = users.filter(u => u.role === 'driver');
      const clients = users.filter(u => u.role === 'client');

      // Calcular viatges per estat
      const completedTrips = trips.filter(t => t.status === 'completed');
      const inProgressTrips = trips.filter(t => t.status === 'in-progress');
      const cancelledTrips = trips.filter(t => t.status === 'cancelled');

      // Calcular ingressos
      const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.fare || 0), 0);
      const averageTicket = completedTrips.length > 0 ? totalRevenue / completedTrips.length : 0;

      // Rating mitjà
      const averageRating = completedTrips.length > 0 
        ? completedTrips.reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrips.length 
        : 0;

      // Estadístiques de conductors
      const driversWithTrips = drivers.filter(d => 
        trips.some(t => t.driverId === d.id && t.status === 'completed')
      );

      const topDrivers = drivers
        .map(d => ({
          id: d.id,
          name: d.name,
          tripCount: trips.filter(t => t.driverId === d.id && t.status === 'completed').length,
          earnings: trips
            .filter(t => t.driverId === d.id && t.status === 'completed')
            .reduce((sum, t) => sum + (t.fare || 0) * 0.8, 0), // 80% al conductor
          rating: d.rating || 0,
        }))
        .sort((a, b) => b.tripCount - a.tripCount)
        .slice(0, 10);

      return {
        users: {
          total: users.length,
          drivers: drivers.length,
          clients: clients.length,
          active: users.filter(u => u.isActive).length,
          banned: users.filter(u => u.isBanned).length,
        },
        trips: {
          total: trips.length,
          completed: completedTrips.length,
          inProgress: inProgressTrips.length,
          cancelled: cancelledTrips.length,
          completionRate: trips.length > 0 ? ((completedTrips.length / trips.length) * 100).toFixed(2) : 0,
        },
        revenue: {
          total: totalRevenue.toFixed(2),
          average: averageTicket.toFixed(2),
          commission: (totalRevenue * 0.2).toFixed(2), // 20% comissió
        },
        ratings: {
          average: averageRating.toFixed(2),
          distribution: calculateRatingDistribution(completedTrips),
        },
        drivers: {
          active: driversWithTrips.length,
          topDrivers: topDrivers,
        },
      };
    },

    getMonthlyTrends: (state) => {
      const adminStore = useAdminStore();
      const trips = adminStore.allTrips;

      // Agrupar viatges per mes
      const monthlyData = {};
      
      trips.forEach(trip => {
        const date = new Date(trip.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            tripCount: 0,
            revenue: 0,
            completed: 0,
          };
        }
        
        monthlyData[monthKey].tripCount++;
        if (trip.status === 'completed') {
          monthlyData[monthKey].revenue += trip.fare || 0;
          monthlyData[monthKey].completed++;
        }
      });

      return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    },

    getUserGrowth: (state) => {
      const adminStore = useAdminStore();
      const users = adminStore.allUsers;

      // Agrupar usuaris per mes de registre
      const monthlyData = {};
      
      users.forEach(user => {
        const date = new Date(user.createdAt);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            clients: 0,
            drivers: 0,
          };
        }
        
        if (user.role === 'client') {
          monthlyData[monthKey].clients++;
        } else if (user.role === 'driver') {
          monthlyData[monthKey].drivers++;
        }
      });

      return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    },

    getDriverPerformance: (state) => {
      const adminStore = useAdminStore();
      const drivers = adminStore.allUsers.filter(u => u.role === 'driver');
      const trips = adminStore.allTrips;

      return drivers.map(driver => ({
        id: driver.id,
        name: driver.name,
        totalTrips: trips.filter(t => t.driverId === driver.id).length,
        completedTrips: trips.filter(t => t.driverId === driver.id && t.status === 'completed').length,
        cancelledTrips: trips.filter(t => t.driverId === driver.id && t.status === 'cancelled').length,
        earnings: trips
          .filter(t => t.driverId === driver.id && t.status === 'completed')
          .reduce((sum, t) => sum + (t.fare || 0) * 0.8, 0),
        rating: driver.rating || 0,
        avgTripTime: calculateAvgTripTime(driver.id, trips),
        avgTripDistance: calculateAvgTripDistance(driver.id, trips),
      }));
    },
  },

  actions: {
    setDateRange(range) {
      this.selectedDateRange = range;
    },
  }
});

// Funcions auxiliars
function calculateRatingDistribution(trips) {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  trips.forEach(trip => {
    if (trip.rating) {
      const rating = Math.round(trip.rating);
      if (distribution.hasOwnProperty(rating)) {
        distribution[rating]++;
      }
    }
  });

  return distribution;
}

function calculateAvgTripTime(driverId, trips) {
  const driverTrips = trips.filter(t => t.driverId === driverId && t.duration);
  if (driverTrips.length === 0) return 0;
  return (driverTrips.reduce((sum, t) => sum + t.duration, 0) / driverTrips.length).toFixed(1);
}

function calculateAvgTripDistance(driverId, trips) {
  const driverTrips = trips.filter(t => t.driverId === driverId && t.distance);
  if (driverTrips.length === 0) return 0;
  return (driverTrips.reduce((sum, t) => sum + t.distance, 0) / driverTrips.length).toFixed(1);
}
