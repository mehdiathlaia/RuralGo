import { defineStore } from 'pinia';
import { useNotificationStore } from './notificationStore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    userRole: null, // 'client', 'driver', 'admin', 'municipality'
    
    users: [],
    
    loginError: null,
    sessionTimeout: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated,
    getUserRole: (state) => state.userRole,
    getUser: (state) => state.currentUser,
    getBalance: (state) => state.currentUser?.balance || 0,
    hasSubscription: (state) => state.currentUser?.subscriptionType !== null,
    getSubscriptionType: (state) => state.currentUser?.subscriptionType || null
  },

  actions: {
    // Login
    login(email, password) {
      this.loginError = null;
      const user = this.users.find(u => u.email === email && u.password === password);
      
      if (!user) {
        this.loginError = 'Email o contrasenya incorrectes';
        return false;
      }

      this.currentUser = { ...user };
      this.isAuthenticated = true;
      this.userRole = user.role;
      
      // Simular timeout de sessió
      this.setSessionTimeout();
      
      return true;
    },

    // Logout
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.userRole = null;
      this.loginError = null;
      if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
      
      // Limpiar el notificationStore
      const notificationStore = useNotificationStore();
      notificationStore.clearStore();
    },

    // Registre
    register(userData) {
      const existingUser = this.users.find(u => u.email === userData.email);
      if (existingUser) {
        this.loginError = 'El correu ja està registrat';
        return false;
      }

      const newUser = {
        id: this.users.length + 1,
        ...userData,
        avatar: userData.name.charAt(0),
        createdAt: new Date(),
        tripHistory: [],
        balance: userData.role === 'client' ? 0 : 0,
        preferences: {
          notifications: true,
          smsAlerts: true,
          shareLocation: true,
          language: 'ca'
        }
      };

      if (userData.role === 'driver') {
        newUser.rating = 5.0;
        newUser.totalTrips = 0;
        newUser.verified = false;
        newUser.earnings = { thisMonth: 0, total: 0 };
      }

      this.users.push(newUser);
      return this.login(userData.email, userData.password);
    },

    // Actualitzar perfil
    updateProfile(updates) {
      if (this.currentUser) {
        this.currentUser = { ...this.currentUser, ...updates };
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex] = { ...this.currentUser };
        }
      }
    },

    // Actualitzar balanç
    updateBalance(amount) {
      if (this.currentUser) {
        this.currentUser.balance += amount;
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex].balance = this.currentUser.balance;
        }
      }
    },

    // Afegir a historial de viatges
    addTripToHistory(trip) {
      if (this.currentUser) {
        if (!this.currentUser.tripHistory) {
          this.currentUser.tripHistory = [];
        }
        this.currentUser.tripHistory.push({
          ...trip,
          completedAt: new Date()
        });
        const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
          this.users[userIndex].tripHistory = this.currentUser.tripHistory;
        }
      }
    },

    // Comprar subscripció
    buySubscription(type) {
      if (this.currentUser) {
        const prices = {
          'viva-pass-monthly': 12.99,
          'viva-pass-annual': 119.99
        };
        
        const price = prices[type];
        if (this.currentUser.balance >= price) {
          this.currentUser.subscriptionType = type;
          this.currentUser.subscriptionExpiry = new Date();
          if (type === 'viva-pass-monthly') {
            this.currentUser.subscriptionExpiry.setMonth(this.currentUser.subscriptionExpiry.getMonth() + 1);
          } else {
            this.currentUser.subscriptionExpiry.setFullYear(this.currentUser.subscriptionExpiry.getFullYear() + 1);
          }
          this.updateBalance(-price);
          return true;
        }
        return false;
      }
    },

    // Session timeout
    setSessionTimeout() {
      if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
      this.sessionTimeout = setTimeout(() => {
        this.logout();
      }, 1800000); // 30 minuts
    }
  }
});
