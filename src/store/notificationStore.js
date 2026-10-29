import { defineStore } from 'pinia';

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [],
    toasts: [],
    unreadCount: 0,
    pendingTrips: [], // Viatges esperant assignació
    activeTrips: {}, // { userId: trip }
    supportChat: {
      messages: [],
      unreadMessages: 0,
      isOpen: false
    },
    channels: {
      trip: true,
      payment: true,
      support: true,
      promo: true
    }
  }),

  getters: {
    getNotifications: (state) => state.notifications,
    getToasts: (state) => state.toasts,
    getUnreadCount: (state) => state.unreadCount,
    getSupportMessages: (state) => state.supportChat.messages,
    getUnreadMessages: (state) => state.supportChat.unreadMessages,
    isSupportChatOpen: (state) => state.supportChat.isOpen,
    getPendingTrips: (state) => state.pendingTrips,
    getActiveTripForUser: (state) => (userId) => state.activeTrips[userId],
  },

  actions: {
    // Afegir notificació
    addNotification(notification) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        timestamp: new Date(),
        read: false,
        ...notification
      };

      // Verificar canal está habilitado
      if (!this.channels[notification.channel || 'trip']) {
        return;
      }

      this.notifications.unshift(newNotification);
      this.unreadCount++;

      // Auto-eliminar notificaciones antiguas
      if (this.notifications.length > 50) {
        this.notifications.pop();
      }

      this.saveToLocalStorage();
      return newNotification;
    },

    // Crear un viatge nou (el client crea)
    createNewTrip(tripData, clientId) {
      console.log('📝 createNewTrip - tripData recibida:', tripData);
      console.log('📝 createNewTrip - tripStoreId:', tripData.tripStoreId);
      const trip = {
        ...tripData,
        id: Date.now(),
        tripStoreId: tripData.tripStoreId,  // IMPORTANTE: Asegurar que se guarda el tripStoreId
        status: 'pending', // pending, accepted, in_progress, completed
        clientId,
        assignedDriverId: null,
        createdAt: new Date(),
        acceptedAt: null,
        completedAt: null,
        driverName: null,
        driverPhone: null,
        numberOfAssistants: tripData.assistants || tripData.numberOfAssistants || 1,
      };
      
      console.log('✅ Viaje creado en notificationStore con tripStoreId:', trip.tripStoreId);

      this.pendingTrips.push(trip);
      this.saveToLocalStorage();

      // Notificar conductors disponibles
      this.notifyAvailableDrivers(trip);

      return trip;
    },

    // Notificar conductors disponibles
    notifyAvailableDrivers(trip) {
      // Aquí es notificaria a tots els conductors en línia
      if (typeof window !== 'undefined' && window.localStorage) {
        const drivers = JSON.parse(localStorage.getItem('onlineDrivers') || '[]');
        drivers.forEach(driverId => {
          this.addNotification({
            recipientId: driverId,
            title: '🚗 Nou viatge disponible!',
            message: `${trip.service} de ${trip.clientName}: ${trip.pickup} → ${trip.destination}`,
            type: 'info',
            channel: 'trip',
            action: {
              type: 'acceptTrip',
              tripId: trip.id,
            },
          });
        });
      }
    },

    // Conductor accepta viatge
    acceptTrip(tripId, driverId, driverName, driverPhone) {
      const trip = this.pendingTrips.find(t => t.id === tripId);
      if (!trip) return false;

      trip.status = 'accepted';
      trip.assignedDriverId = driverId;
      trip.acceptedAt = new Date();
      trip.driverName = driverName;
      trip.driverPhone = driverPhone;

      // Moure a activeTrips usant $patch per mantenir reactivitat
      this.$patch((state) => {
        state.activeTrips[driverId] = trip;
        state.activeTrips[trip.clientId] = trip;
      });

      // Guardar per sincronitzar amb tripStore més tard
      const tripStoreId = trip.tripStoreId;

      // Notificar client
      this.addNotification({
        recipientId: trip.clientId,
        title: '✓ Viatge acceptat',
        message: `${driverName} ha acceptat el teu viatge.`,
        type: 'success',
        channel: 'trip',
        icon: '🎉',
        action: {
          type: 'viewTrip',
          tripId: tripStoreId || tripId,
        }
      });

      // Eliminar de pending
      this.pendingTrips = this.pendingTrips.filter(t => t.id !== tripId);
      this.saveToLocalStorage();

      return {
        success: true,
        tripStoreId: tripStoreId,
        driverName,
        driverPhone,
        driverId
      };
    },

    // Cancelar viatge pel client
    cancelTrip(tripStoreId, assignedDriverId = null) {
      // IMPORTANTE: Recargar desde localStorage primero para asegurar que tenemos datos actuales
      this.loadFromLocalStorage();
      
      // Buscar el viatge a pending trips (buscar per tripStoreId)
      const pendingTrip = this.pendingTrips.find(t => t.tripStoreId === tripStoreId);
      if (pendingTrip) {
        // Si no ha estat acceptat, marcar como cancelado y eliminar-lo
        pendingTrip.status = 'cancelled';
        this.pendingTrips = this.pendingTrips.filter(t => t.tripStoreId !== tripStoreId);
        this.saveToLocalStorage();
        return { success: true, wasAccepted: false };
      }

      // Buscar a active trips per notificar el conductor (buscar per tripStoreId)
      let found = false;
      for (const driverId in this.activeTrips) {
        const activeTrip = this.activeTrips[driverId];
        if (activeTrip.tripStoreId === tripStoreId) {
          found = true;
          
          // Notificar el conductor que el client ha cancel·lat PRIMEIRO
          this.addNotification({
            recipientId: activeTrip.assignedDriverId,
            title: '❌ Viatge cancel·lat',
            message: `El client ha cancel·lat el viatge de ${activeTrip.service}`,
            type: 'warning',
            channel: 'trip',
            icon: '🛑',
          });

          // Después, actualizar activeTrips
          // Crear nuevo objeto activeTrips SIN el viatge cancel·lat
          const newActiveTrips = {};
          for (const key in this.activeTrips) {
            // Mantenir solo los viatges que NO sean el que se está cancelando
            if (this.activeTrips[key].tripStoreId !== tripStoreId) {
              newActiveTrips[key] = this.activeTrips[key];
            }
          }

          
          // Actualizar el estado con $patch
          this.$patch({ activeTrips: newActiveTrips });
          
          // Guardar a localStorage usando saveToLocalStorage para mantener todo sincronizado
          this.saveToLocalStorage();
          
          return { success: true, wasAccepted: true, driverId: activeTrip.assignedDriverId };
        }
      }

      // Si no está en notificationStore pero tenemos driverId, notificar al conductor
      if (assignedDriverId) {
        
        this.addNotification({
          recipientId: assignedDriverId,
          title: '❌ Viatge cancel·lat',
          message: `El client ha cancel·lat el viatge assignat`,
          type: 'warning',
          channel: 'trip',
          icon: '🛑',
        });
        
        // Tambén intentar eliminar de activeTrips si existe
        const newActiveTrips = {};
        for (const key in this.activeTrips) {
          if (this.activeTrips[key].tripStoreId !== tripStoreId) {
            newActiveTrips[key] = this.activeTrips[key];
          }
        }
        this.$patch({ activeTrips: newActiveTrips });
        this.saveToLocalStorage();
        
        return { success: true, wasAccepted: true, driverId: assignedDriverId };
      }

      // Si no está en notificationStore y no tenemos driverId, solo retornar success
      return { success: true, wasAccepted: false };
    },

    // Iniciar viatge

    startTrip(tripId, driverId) {
      const trip = this.activeTrips[driverId];
      if (!trip) return false;

      trip.status = 'in_progress';
      trip.startTime = new Date();

      // Notificar client
      this.addNotification({
        recipientId: trip.clientId,
        title: '🚗 Viatge iniciat!',
        message: `El viatge ha començat. Rastreig en temps real activat.`,
        type: 'info',
        channel: 'trip',
        icon: '📍',
      });

      this.saveToLocalStorage();
      return true;
    },

    // Completar viatge
    completeTrip(tripId, driverId, distance, duration, cost) {
      const trip = this.activeTrips[driverId];
      if (!trip) return false;

      trip.status = 'completed';
      trip.completedAt = new Date();
      trip.distance = distance;
      trip.duration = duration;
      trip.cost = cost;

      // Notificar client
      this.addNotification({
        recipientId: trip.clientId,
        title: '✓ Viatge completat!',
        message: `Distància: ${distance}km | Durada: ${duration}min | Cost: €${cost.toFixed(2)}`,
        type: 'success',
        channel: 'trip',
        icon: '🎉',
        action: {
          type: 'rateTrip',
          tripId,
        },
      });

      // Notificar conductor
      this.addNotification({
        recipientId: driverId,
        title: '✓ Viatge finalitzat',
        message: `Has guanyat €${cost.toFixed(2)} per aquest viatge.`,
        type: 'success',
        channel: 'payment',
      });

      this.saveToLocalStorage();
      return true;
    },

    // Mostrar toast
    showToast(message, type = 'info', duration = 3000) {
      const toast = {
        id: `toast-${Date.now()}`,
        message,
        type,
        visible: true
      };

      this.toasts.push(toast);

      if (duration) {
        setTimeout(() => {
          this.removeToast(toast.id);
        }, duration);
      }

      return toast;
    },

    // Remover toast
    removeToast(id) {
      const index = this.toasts.findIndex(t => t.id === id);
      if (index !== -1) {
        this.toasts.splice(index, 1);
      }
    },

    // Marcar como leído
    markAsRead(notificationId) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        notification.read = true;
        this.unreadCount--;
      }
    },

    // Marcar todos como leídos
    markAllAsRead() {
      this.notifications.forEach(n => n.read = true);
      this.unreadCount = 0;
    },

    // Guardar a localStorage
    saveToLocalStorage() {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          localStorage.setItem('notificationStore', JSON.stringify({
            notifications: this.notifications,
            pendingTrips: this.pendingTrips,
            activeTrips: this.activeTrips,
          }));
        } catch (e) {
          console.error('Error saving to localStorage:', e);
        }
      }
    },

    // Carregar de localStorage
    loadFromLocalStorage() {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          const saved = localStorage.getItem('notificationStore');
          console.log('📂 loadFromLocalStorage - Datos en localStorage:', saved ? JSON.parse(saved) : 'VACÍO');
          if (saved) {
            const data = JSON.parse(saved);
            this.notifications = data.notifications || [];
            this.pendingTrips = (data.pendingTrips || []).filter(t => t.status !== 'cancelled');
            
            console.log('📂 Pendingen Trips cargados:', this.pendingTrips.map(t => ({ id: t.id, tripStoreId: t.tripStoreId })));
            
            // Filtrar activeTrips para excluir viajes cancelados
            const activeTrips = data.activeTrips || {};
            const validActiveTrips = {};
            for (const key in activeTrips) {
              const trip = activeTrips[key];
              // Solo cargar si el viaje existe y NO está cancelado
              if (trip && trip.status !== 'cancelled') {
                validActiveTrips[key] = trip;
              }
            }
            this.activeTrips = validActiveTrips;
            console.log('📂 Cargado de localStorage - activeTrips válidos:', Object.keys(validActiveTrips).length, '- Notificaciones:', this.notifications.length);
          }
        } catch (e) {
          console.error('Error loading from localStorage:', e);
        }
      }
    },

    // Posar el conductor online
    setDriverOnline(driverId) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const onlineDrivers = JSON.parse(localStorage.getItem('onlineDrivers') || '[]');
        if (!onlineDrivers.includes(driverId)) {
          onlineDrivers.push(driverId);
          localStorage.setItem('onlineDrivers', JSON.stringify(onlineDrivers));
        }
      }
    },

    // Posar el conductor offline
    setDriverOffline(driverId) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const onlineDrivers = JSON.parse(localStorage.getItem('onlineDrivers') || '[]');
        const filtered = onlineDrivers.filter(d => d !== driverId);
        localStorage.setItem('onlineDrivers', JSON.stringify(filtered));
      }
    },

    // Limpiar notificaciones
    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
    },

    // Limpiar todo el store (llamado al logout)
    clearStore() {
      // NO limpiar notifications - el conductor las verá cuando vuelva a entrar
      // this.notifications = [];
      this.toasts = [];
      this.unreadCount = 0;
      // NO limpiar pendingTrips - son globales para todos los conductores
      // this.pendingTrips = [];
      this.activeTrips = {}; // Sí limpiar activeTrips - son específicos del usuario
      this.supportChat = {
        messages: [],
        unreadMessages: 0,
        isOpen: false
      };
      
      // Guardar estado (sin activeTrips) a localStorage
      this.saveToLocalStorage();
    },

    // Enviar mensaje de soporte
    sendSupportMessage(message, userName = 'Usuario') {
      const newMessage = {
        id: `msg-${Date.now()}`,
        from: userName,
        text: message,
        timestamp: new Date(),
        isUser: true,
        read: true
      };

      this.supportChat.messages.push(newMessage);

      // Simular respuesta automática
      setTimeout(() => {
        this.addSupportReply(
          this.getAutoReply(message),
          'Support Team'
        );
      }, 1000);

      return newMessage;
    },

    // Añadir respuesta de soporte
    addSupportReply(message, fromName = 'Support Team') {
      const reply = {
        id: `msg-${Date.now()}`,
        from: fromName,
        text: message,
        timestamp: new Date(),
        isUser: false,
        read: !this.supportChat.isOpen
      };

      this.supportChat.messages.push(reply);

      if (!this.supportChat.isOpen) {
        this.supportChat.unreadMessages++;
      }

      return reply;
    },

    // Respuestas automáticas
    getAutoReply(message) {
      const msg = message.toLowerCase();

      const responses = {
        'hola|hi|hola': '👋 Hola! Gràcies per contactar-nos. ¿En qué podem ajudarte?',
        'problema|problem|error|issue': '😔 Ens disculpa els problemes. El nostre equip tècnic està aquí per ajudarte. ¿Pots descriure el problema amb més detall?',
        'pago|payment|billing|factura': '💳 Sobre pagaments i facturació: ¿És sobre una transacció específica o necessites ajuda amb el teu mètode de pagament?',
        'reembolso|refund|devolver': '💰 Per sol·licitar un reemborç, necessitarem detalls del viatge. ¿Quan va ser el viatge?',
        'gracias|thank|thanks': '😊 ¡De res! Sempre estam aquí per ajudarte. ¿Hi ha algo més?',
        'chao|bye|goodbye|adiós': '👋 ¡Gràcies per usar RURAL-GO VIVA! ¡Que tingues un excellent dia!'
      };

      for (const [keywords, response] of Object.entries(responses)) {
        if (keywords.split('|').some(k => msg.includes(k))) {
          return response;
        }
      }

      return '💭 Gràcies pel teu missatge. Un agent es posarà en contacte amb tu aviat.';
    },

    // Obrir/tancar xat
    toggleSupportChat() {
      this.supportChat.isOpen = !this.supportChat.isOpen;
      if (this.supportChat.isOpen) {
        this.supportChat.unreadMessages = 0;
      }
    },

    // Canviar preferències de notificacions
    setChannelPreference(channel, enabled) {
      this.channels[channel] = enabled;
    },

    // Notificacions de viatge
    notifyTripCreated(trip) {
      return this.addNotification({
        channel: 'trip',
        type: 'trip_created',
        title: '🚗 Viatge sol·licitat',
        message: `El teu viatge a ${trip.pickup} ha estat sol·licitat`,
        tripId: trip.id,
        action: 'Veure detalls'
      });
    },

    notifyDriverAssigned(driver) {
      return this.addNotification({
        channel: 'trip',
        type: 'driver_assigned',
        title: '👤 Conductor assignat',
        message: `${driver.name} és el teu conductor`,
        driverId: driver.id,
        action: 'Veure conductor'
      });
    },

    notifyTripStarted() {
      return this.addNotification({
        channel: 'trip',
        type: 'trip_started',
        title: '🚗 Viatge iniciat',
        message: 'El teu viatge ha comenzat',
        action: 'Rastrejar'
      });
    },

    notifyTripCompleted(trip) {
      return this.addNotification({
        channel: 'trip',
        type: 'trip_completed',
        title: '✓ Viatge complet',
        message: `El teu viatge a ${trip.pickup} ha estat completat`,
        tripId: trip.id,
        action: 'Calificar'
      });
    },

    // Notificacions de pagament
    notifyPaymentProcessing() {
      return this.addNotification({
        channel: 'payment',
        type: 'payment_processing',
        title: '💳 Processant pagament',
        message: 'El teu pagament s\'està processant',
        action: 'Veure estat'
      });
    },

    notifyPaymentSuccess(amount) {
      return this.addNotification({
        channel: 'payment',
        type: 'payment_success',
        title: '✓ Pagament completat',
        message: `Pagament de ${amount}€ realitzat correctament`,
        action: 'Veure rebut'
      });
    },

    notifyPaymentFailed() {
      return this.addNotification({
        channel: 'payment',
        type: 'payment_failed',
        title: '❌ Pagament fallit',
        message: 'No hem pogut processar el teu pagament. Intenta de nou',
        action: 'Reintentar'
      });
    },

    // Notificacions d'emergència
    notifyEmergencyAssigned(driver) {
      return this.addNotification({
        channel: 'trip',
        type: 'emergency_assigned',
        title: '🚨 Ajuda en camí',
        message: `${driver.name} es dirigeix cap a tu`,
        driverId: driver.id,
        action: 'Rastrejar'
      });
    }
  }
});
