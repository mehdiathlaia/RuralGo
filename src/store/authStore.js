import { defineStore } from 'pinia';
import { useNotificationStore } from './notificationStore';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    currentUser: null,
    isAuthenticated: false,
    userRole: null, // 'client', 'driver', 'admin', 'municipality'
    
    // Usuaris predefinits per demo
    users: [
      {
        id: 1,
        name: 'Maria García',
        email: 'maria@example.com',
        password: 'pass123',
        phone: '934 567 890',
        role: 'client',
        avatar: 'M',
        age: 72,
        address: 'Carrer Major, 42',
        interests: ['cultura', 'familia', 'natura'],
        mobilityNeeds: 'normal',
        emergencyContacts: [
          { name: 'Joan García', phone: '934 111 222', relation: 'fill' },
          { name: 'Teresa López', phone: '934 333 444', relation: 'germana' }
        ],
        subscriptionType: 'viva-pass-monthly', // null, 'viva-pass-monthly', 'viva-pass-annual'
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'Visa'
        },
        balance: 125.50, // Saldo de crèdit
        tripHistory: [],
        createdAt: new Date('2024-06-15'),
        preferences: {
          notifications: true,
          smsAlerts: true,
          shareLocation: true,
          language: 'ca'
        }
      },
      {
        id: 2,
        name: 'Joan Riera',
        email: 'joan@example.com',
        password: 'pass123',
        phone: '934 987 654',
        role: 'driver',
        avatar: 'J',
        vehicle: 'Citroën Berlingo Adaptada',
        plate: '5482-KDL',
        vehicleType: 'adapted',
        rating: 4.8,
        totalTrips: 156,
        verified: true,
        licenseExpiry: new Date('2026-12-31'),
        insurance: {
          provider: 'AXA Seguros',
          policyNumber: 'AXA-123456',
          expiryDate: new Date('2025-12-31')
        },
        bankAccount: {
          holder: 'Joan Riera',
          iban: 'ES9121007895****'
        },
        earnings: {
          thisMonth: 1250.00,
          total: 15680.50
        },
        workingHours: {
          monday: { start: '08:00', end: '18:00' },
          tuesday: { start: '08:00', end: '18:00' },
          wednesday: { start: '08:00', end: '18:00' },
          thursday: { start: '08:00', end: '18:00' },
          friday: { start: '08:00', end: '18:00' },
          saturday: null,
          sunday: null
        },
        createdAt: new Date('2023-03-20')
      },
      {
        id: 3,
        name: 'Rosa García',
        email: 'rosa@example.com',
        password: 'pass123',
        phone: '936 123 456',
        role: 'client',
        avatar: 'R',
        age: 68,
        address: 'Avinguda Pau Casals, 15',
        interests: ['cultura', 'salut'],
        mobilityNeeds: 'assisted',
        emergencyContacts: [
          { name: 'Dr. Josep López', phone: '933 456 789', relation: 'metge' }
        ],
        subscriptionType: null,
        balance: 45.00,
        tripHistory: [],
        createdAt: new Date('2024-09-10'),
        preferences: {
          notifications: true,
          smsAlerts: false,
          shareLocation: true,
          language: 'ca'
        }
      },
      {
        id: 999,
        name: 'Administrador',
        email: 'admin@ruralgo.com',
        password: 'admin123',
        phone: '931 000 000',
        role: 'admin',
        avatar: 'A',
        createdAt: new Date('2024-01-01'),
        preferences: {
          notifications: true,
          smsAlerts: true,
          shareLocation: false,
          language: 'ca'
        }
      }
    ],
    
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
