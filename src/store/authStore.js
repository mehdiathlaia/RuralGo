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
    // Restore a previously authenticated session after a page reload.
    async restoreSession() {
      const token = localStorage.getItem('ruralgoUserToken');
      if (!token) return false;
      try {
        const response = await fetch('https://ruralgo-backend-ighg.onrender.com/api/auth/me', {
          headers: { Authorization: 'Bearer ' + token }
        });
        if (response.status === 401 || response.status === 403) throw new Error('Sessió caducada');
        if (!response.ok) return false;
        const result = await response.json();
        this.currentUser = { ...result.user, role: result.user.role === 'passenger' ? 'client' : result.user.role };
        this.isAuthenticated = true;
        this.userRole = this.currentUser.role;
        this.setSessionTimeout();
        return true;
      } catch (_error) {
        if (_error?.name === 'TypeError') return false; // Keep the token during temporary network outages.
        localStorage.removeItem('ruralgoUserToken');
        this.currentUser = null;
        this.isAuthenticated = false;
        this.userRole = null;
        return false;
      }
    },

    // Login
    async login(email, password) {
      this.loginError = null;
      try {
        const response = await fetch('https://ruralgo-backend-ighg.onrender.com/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Correu o contrasenya incorrectes');
        this.currentUser = { ...result.user, role: result.user.role === 'passenger' ? 'client' : result.user.role };
        this.isAuthenticated = true;
        this.userRole = this.currentUser.role;
        localStorage.setItem('ruralgoUserToken', result.token);
        this.setSessionTimeout();
        return true;
      } catch (error) {
        this.loginError = error?.name === 'TypeError'
          ? 'No s’ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.'
          : error?.name === 'SyntaxError'
            ? 'El servidor ha retornat una resposta inesperada. Torna-ho a provar.'
            : error.message || 'No s’ha pogut iniciar sessió';
        return false;
      }
    },

    // Logout
    logout() {
      this.currentUser = null;
      this.isAuthenticated = false;
      this.userRole = null;
      this.loginError = null;
      localStorage.removeItem('ruralgoUserToken');
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
