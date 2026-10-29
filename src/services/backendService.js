import axios from 'axios';
import io from 'socket.io-client';

// Cambia esto cuando despliegues en producción
const API_URL = 'https://ruralgo-backend.onrender.com/api';
const SOCKET_URL = 'https://ruralgo-backend.onrender.com';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Socket.io instance
let socket = null;

export const backendService = {
  // Autenticación
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user.id);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    if (socket) socket.disconnect();
  },

  // Perfil
  getProfile: async () => {
    try {
      const response = await api.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateLocation: async (latitude, longitude, address) => {
    try {
      const response = await api.put('/auth/location', {
        latitude,
        longitude,
        address
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Viajes
  createTrip: async (tripData) => {
    try {
      const response = await api.post('/trips', tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getActiveTrips: async () => {
    try {
      const response = await api.get('/trips/active');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getTripHistory: async () => {
    try {
      const response = await api.get('/trips/history');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  acceptTrip: async (tripId) => {
    try {
      const response = await api.put(`/trips/${tripId}/accept`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  startTrip: async (tripId) => {
    try {
      const response = await api.put(`/trips/${tripId}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  completeTrip: async (tripId, data) => {
    try {
      const response = await api.put(`/trips/${tripId}/complete`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  cancelTrip: async (tripId) => {
    try {
      const response = await api.put(`/trips/${tripId}/cancel`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Socket.io real-time
  connectSocket: () => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        auth: {
          token: localStorage.getItem('authToken')
        }
      });

      socket.on('connect', () => {
        console.log('✅ Conectado al servidor en tiempo real');
        const userId = localStorage.getItem('userId');
        socket.emit('user_online', userId);
      });

      socket.on('disconnect', () => {
        console.log('❌ Desconectado del servidor en tiempo real');
      });

      socket.on('error', (error) => {
        console.error('Error de Socket:', error);
      });
    }
    return socket;
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  getSocket: () => socket,

  // Emitir eventos
  emitTripRequest: (tripData) => {
    if (socket) {
      socket.emit('trip_requested', tripData);
    }
  },

  emitTripAccepted: (tripData) => {
    if (socket) {
      socket.emit('trip_accepted', tripData);
    }
  },

  emitTripStarted: (tripData) => {
    if (socket) {
      socket.emit('trip_started', tripData);
    }
  },

  emitUpdateLocation: (locationData) => {
    if (socket) {
      socket.emit('update_location', locationData);
    }
  },

  emitTripCompleted: (tripData) => {
    if (socket) {
      socket.emit('trip_completed', tripData);
    }
  },

  // Escuchar eventos
  onNewTripAvailable: (callback) => {
    if (socket) {
      socket.on('new_trip_available', callback);
    }
  },

  onTripAcceptedNotification: (callback) => {
    if (socket) {
      socket.on('trip_accepted_notification', callback);
    }
  },

  onTripStartedNotification: (callback) => {
    if (socket) {
      socket.on('trip_started_notification', callback);
    }
  },

  onTripCompletedNotification: (callback) => {
    if (socket) {
      socket.on('trip_completed_notification', callback);
    }
  },

  onDriverLocationUpdated: (callback) => {
    if (socket) {
      socket.on('driver_location_updated', callback);
    }
  }
};

export default backendService;
