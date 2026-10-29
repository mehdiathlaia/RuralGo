import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRatingStore = defineStore('rating', () => {
  // Estado
  const ratings = ref([
    {
      id: '1',
      tripId: 'trip-001',
      driverId: 'driver-001',
      clientId: 'client-001',
      clientName: 'Maria Garcia',
      driverName: 'Joan Smith',
      rating: 5,
      comment: 'Excel·lent servei, conductor molt amable i vehicle net',
      date: '2024-01-15',
      tags: ['puntualidad', 'seguridad', 'amabilidad'],
      driverRating: null, // Driver no ha valorat al client
      driverComment: null
    },
    {
      id: '2',
      tripId: 'trip-002',
      driverId: 'driver-002',
      clientId: 'client-002',
      clientName: 'Rosa Pujol',
      driverName: 'Barcelona Taxi Driver',
      rating: 4,
      comment: 'Bon viatge, poc tràfic',
      date: '2024-01-14',
      tags: ['puntualidad', 'seguridad'],
      driverRating: 5,
      driverComment: 'Passatger molt educada'
    }
  ]);

  const pendingRatings = ref([
    {
      tripId: 'trip-003',
      driverId: 'driver-003',
      clientId: 'client-001',
      clientName: 'Maria Garcia',
      driverName: 'Miguel Torres',
      tripDate: '2024-01-13',
      pickupAddress: 'Carrer de la Pau, 10, Barcelona',
      destinationAddress: 'Plaça Reial, Barcelona'
    }
  ]);

  // Comptadors
  const averageRating = computed(() => {
    if (ratings.value.length === 0) return 0;
    const sum = ratings.value.reduce((acc, r) => acc + r.rating, 0);
    return (sum / ratings.value.length).toFixed(1);
  });

  const totalReviews = computed(() => ratings.value.length);

  const ratingDistribution = computed(() => {
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratings.value.forEach(r => {
      if (dist[r.rating] !== undefined) {
        dist[r.rating]++;
      }
    });
    return dist;
  });

  // Acciones
  const submitRating = (tripId, driverId, clientId, rating, comment, tags) => {
    const newRating = {
      id: 'rating-' + Date.now(),
      tripId,
      driverId,
      clientId,
      rating,
      comment,
      tags: tags || [],
      date: new Date().toISOString().split('T')[0],
      driverRating: null,
      driverComment: null
    };
    
    ratings.value.push(newRating);
    
    // Eliminar de pendientes
    pendingRatings.value = pendingRatings.value.filter(
      r => r.tripId !== tripId
    );
    
    return newRating;
  };

  const submitDriverRating = (ratingId, driverRating, driverComment) => {
    const rating = ratings.value.find(r => r.id === ratingId);
    if (rating) {
      rating.driverRating = driverRating;
      rating.driverComment = driverComment;
    }
  };

  const getRatingsByDriver = (driverId) => {
    return ratings.value.filter(r => r.driverId === driverId);
  };

  const getRatingsByClient = (clientId) => {
    return ratings.value.filter(r => r.clientId === clientId);
  };

  const getDriverAverageRating = (driverId) => {
    const driverRatings = getRatingsByDriver(driverId);
    if (driverRatings.length === 0) return 0;
    const sum = driverRatings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / driverRatings.length).toFixed(1);
  };

  const getPendingRatingForTrip = (tripId) => {
    return pendingRatings.value.find(r => r.tripId === tripId);
  };

  const getMostCommonTags = () => {
    const tagCount = {};
    ratings.value.forEach(r => {
      r.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  };

  const getDetailedStats = () => {
    return {
      averageRating: averageRating.value,
      totalReviews: totalReviews.value,
      ratingDistribution: ratingDistribution.value,
      mostCommonTags: getMostCommonTags(),
      recentReviews: ratings.value.slice(-5).reverse()
    };
  };

  return {
    // State
    ratings,
    pendingRatings,
    
    // Computed
    averageRating,
    totalReviews,
    ratingDistribution,
    
    // Actions
    submitRating,
    submitDriverRating,
    getRatingsByDriver,
    getRatingsByClient,
    getDriverAverageRating,
    getPendingRatingForTrip,
    getMostCommonTags,
    getDetailedStats
  };
});
