import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    allUsers: [],
    allTrips: [],
    statistics: {
      totalUsers: 0,
      totalClients: 0,
      totalDrivers: 0,
      totalTrips: 0,
      totalRevenue: 0,
      averageRating: 0,
      activeTrips: 0,
    },
    selectedUser: null,
    filter: {
      searchTerm: '',
      userType: 'all', // 'all', 'client', 'driver'
      status: 'all', // 'all', 'active', 'inactive', 'banned'
      sortBy: 'name' // 'name', 'createdAt', 'trips', 'rating'
    },
    editingUser: null,
    auditLog: [],
    platformSettings: {
      commissionRate: 20,
      minimumBalance: 10,
      maxRideDistance: 100,
      supportEmail: 'support@webruralgo.cat',
      emergencyPhone: '112',
      maintenanceMode: false,
    },
    reports: {
      daily: [],
      weekly: [],
      monthly: [],
    }
  }),

  getters: {
    getAllUsers: (state) => state.allUsers,
    
    getFilteredUsers: (state) => {
      let filtered = state.allUsers;

      // Filtro por tipo de usuario
      if (state.filter.userType !== 'all') {
        filtered = filtered.filter(u => u.role === state.filter.userType);
      }

      // Filtro por estado
      if (state.filter.status !== 'all') {
        filtered = filtered.filter(u => {
          if (state.filter.status === 'active') return u.isActive === true;
          if (state.filter.status === 'inactive') return u.isActive === false;
          if (state.filter.status === 'banned') return u.isBanned === true;
          return true;
        });
      }

      // Búsqueda
      if (state.filter.searchTerm) {
        const term = state.filter.searchTerm.toLowerCase();
        filtered = filtered.filter(u =>
          u.name.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          (u.phone && u.phone.includes(term))
        );
      }

      // Ordenar
      filtered.sort((a, b) => {
        switch (state.filter.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'createdAt':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'trips':
            return (b.tripHistory?.length || 0) - (a.tripHistory?.length || 0);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          default:
            return 0;
        }
      });

      return filtered;
    },

    getUserStats: (state) => {
      return {
        total: state.allUsers.length,
        clients: state.allUsers.filter(u => u.role === 'client').length,
        drivers: state.allUsers.filter(u => u.role === 'driver').length,
        active: state.allUsers.filter(u => u.isActive).length,
        inactive: state.allUsers.filter(u => !u.isActive).length,
        banned: state.allUsers.filter(u => u.isBanned).length,
      };
    },

    getTripStats: (state) => {
      const completedTrips = state.allTrips.filter(t => t.status === 'completed');
      const totalRevenue = completedTrips.reduce((sum, t) => sum + (t.fare || 0), 0);
      const averageRating = completedTrips.length > 0
        ? completedTrips.reduce((sum, t) => sum + (t.rating || 0), 0) / completedTrips.length
        : 0;

      return {
        total: state.allTrips.length,
        completed: completedTrips.length,
        active: state.allTrips.filter(t => t.status === 'in-progress').length,
        cancelled: state.allTrips.filter(t => t.status === 'cancelled').length,
        totalRevenue: totalRevenue.toFixed(2),
        averageRating: averageRating.toFixed(2),
      };
    },

    getPlatformStats: (state) => {
      const userStats = state.allUsers;
      const tripStats = state.allTrips;
      
      return {
        totalUsers: userStats.length,
        totalClients: userStats.filter(u => u.role === 'client').length,
        totalDrivers: userStats.filter(u => u.role === 'driver').length,
        totalTrips: tripStats.length,
        totalRevenue: tripStats
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.fare || 0), 0)
          .toFixed(2),
        averageRating: tripStats.length > 0
          ? (tripStats.reduce((sum, t) => sum + (t.rating || 0), 0) / tripStats.length).toFixed(2)
          : '0.00',
        activeTrips: tripStats.filter(t => t.status === 'in-progress').length,
      };
    },

    getAuditLog: (state) => state.auditLog.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),

    getPlatformSettings: (state) => state.platformSettings,
  },

  actions: {
    // Inicializar con datos del authStore
    initializeAdmin() {
      const authStore = useAuthStore();
      
      // Cargar todos los usuarios
      if (authStore.users && Array.isArray(authStore.users)) {
        this.allUsers = authStore.users.map(user => ({
          ...user,
          isActive: user.isActive !== false,
          isBanned: user.isBanned || false,
          rating: user.rating || 5,
          reviewsCount: user.reviewsCount || 0,
          createdAt: user.createdAt || new Date().toISOString(),
          lastLogin: user.lastLogin || new Date().toISOString(),
        }));
      }

      // Simular viajes para demostración
      this.generateSampleTrips();
      
      // Cargar desde localStorage si existe
      this.loadFromLocalStorage();
    },

    generateSampleTrips() {
      // Generar datos de ejemplo para viajes
      const sampleTrips = [];
      const statuses = ['completed', 'in-progress', 'cancelled'];
      
      for (let i = 0; i < 50; i++) {
        const driverId = Math.floor(Math.random() * this.allUsers.filter(u => u.role === 'driver').length) + 1;
        const clientId = Math.floor(Math.random() * this.allUsers.filter(u => u.role === 'client').length) + 1;
        
        sampleTrips.push({
          id: i + 1,
          driverId,
          clientId,
          pickupLocation: 'Location A',
          dropoffLocation: 'Location B',
          fare: Math.random() * 50 + 5,
          status: statuses[Math.floor(Math.random() * statuses.length)],
          rating: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null,
          distance: Math.random() * 50 + 1,
          duration: Math.floor(Math.random() * 60) + 5,
          createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
          completedAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000 * 30).toISOString() : null,
        });
      }
      
      this.allTrips = sampleTrips;
    },

    // Gestión de usuarios
    updateUser(userId, updatedData) {
      const userIndex = this.allUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        this.allUsers[userIndex] = { ...this.allUsers[userIndex], ...updatedData };
        this.logAction('UPDATE_USER', `Usuario ${this.allUsers[userIndex].name} actualizado`, userId);
        this.saveToLocalStorage();
      }
    },

    banUser(userId, reason = '') {
      const user = this.allUsers.find(u => u.id === userId);
      if (user) {
        user.isBanned = true;
        user.banReason = reason;
        user.bannedAt = new Date().toISOString();
        this.logAction('BAN_USER', `Usuario ${user.name} baneado. Razón: ${reason}`, userId);
        this.saveToLocalStorage();
      }
    },

    unbanUser(userId) {
      const user = this.allUsers.find(u => u.id === userId);
      if (user) {
        user.isBanned = false;
        user.banReason = '';
        this.logAction('UNBAN_USER', `Usuario ${user.name} desbaneado`, userId);
        this.saveToLocalStorage();
      }
    },

    deactivateUser(userId) {
      const user = this.allUsers.find(u => u.id === userId);
      if (user) {
        user.isActive = false;
        user.deactivatedAt = new Date().toISOString();
        this.logAction('DEACTIVATE_USER', `Usuario ${user.name} desactivado`, userId);
        this.saveToLocalStorage();
      }
    },

    activateUser(userId) {
      const user = this.allUsers.find(u => u.id === userId);
      if (user) {
        user.isActive = true;
        this.logAction('ACTIVATE_USER', `Usuario ${user.name} activado`, userId);
        this.saveToLocalStorage();
      }
    },

    deleteUser(userId) {
      const userIndex = this.allUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        const userName = this.allUsers[userIndex].name;
        this.allUsers.splice(userIndex, 1);
        this.logAction('DELETE_USER', `Usuario ${userName} eliminado permanentemente`, userId);
        this.saveToLocalStorage();
      }
    },

    setSelectedUser(userId) {
      this.selectedUser = this.allUsers.find(u => u.id === userId) || null;
    },

    setEditingUser(userId) {
      this.editingUser = this.allUsers.find(u => u.id === userId) || null;
    },

    cancelEditUser() {
      this.editingUser = null;
    },

    // Filtrado y búsqueda
    setSearchTerm(term) {
      this.filter.searchTerm = term;
    },

    setUserTypeFilter(type) {
      this.filter.userType = type;
    },

    setStatusFilter(status) {
      this.filter.status = status;
    },

    setSortBy(sortOption) {
      this.filter.sortBy = sortOption;
    },

    // Configuración de plataforma
    updatePlatformSetting(key, value) {
      if (key in this.platformSettings) {
        this.platformSettings[key] = value;
        this.logAction('UPDATE_SETTING', `Configuración ${key} actualizada a ${value}`);
        this.saveToLocalStorage();
      }
    },

    enableMaintenanceMode() {
      this.platformSettings.maintenanceMode = true;
      this.logAction('MAINTENANCE_MODE', 'Modo mantenimiento activado');
      this.saveToLocalStorage();
    },

    disableMaintenanceMode() {
      this.platformSettings.maintenanceMode = false;
      this.logAction('MAINTENANCE_MODE', 'Modo mantenimiento desactivado');
      this.saveToLocalStorage();
    },

    // Registros de auditoría
    logAction(action, description = '', userId = null) {
      this.auditLog.push({
        id: Date.now(),
        action,
        description,
        userId,
        timestamp: new Date().toISOString(),
        adminId: 1, // Cambiar por el admin actual si es necesario
      });
      this.saveToLocalStorage();
    },

    // Reportes
    generateDailyReport() {
      return {
        date: new Date().toISOString().split('T')[0],
        userStats: this.getUserStats,
        tripStats: this.getTripStats,
        revenue: this.getTripStats.totalRevenue,
      };
    },

    // Almacenamiento local
    saveToLocalStorage() {
      const adminData = {
        allUsers: this.allUsers,
        allTrips: this.allTrips,
        auditLog: this.auditLog,
        platformSettings: this.platformSettings,
      };
      localStorage.setItem('adminData', JSON.stringify(adminData));
    },

    loadFromLocalStorage() {
      try {
        const data = localStorage.getItem('adminData');
        if (data) {
          const parsed = JSON.parse(data);
          this.allUsers = parsed.allUsers || this.allUsers;
          this.allTrips = parsed.allTrips || this.allTrips;
          this.auditLog = parsed.auditLog || [];
          this.platformSettings = parsed.platformSettings || this.platformSettings;
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    },

    // Exportar datos
    exportUsersToCSV() {
      const headers = ['ID', 'Nombre', 'Email', 'Teléfono', 'Tipo', 'Estado', 'Viajes', 'Rating', 'Creado'];
      const rows = this.getFilteredUsers.map(u => [
        u.id,
        u.name,
        u.email,
        u.phone || '',
        u.role === 'client' ? 'Cliente' : 'Conductor',
        u.isBanned ? 'Baneado' : (u.isActive ? 'Activo' : 'Inactivo'),
        u.tripHistory?.length || 0,
        u.rating || 0,
        new Date(u.createdAt).toLocaleDateString(),
      ]);

      const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    },

    exportTripsToCSV() {
      const headers = ['ID', 'Conductor', 'Cliente', 'Tarifa', 'Estado', 'Distancia (km)', 'Duración (min)', 'Rating', 'Fecha'];
      const rows = this.allTrips.map(t => {
        const driver = this.allUsers.find(u => u.id === t.driverId);
        const client = this.allUsers.find(u => u.id === t.clientId);
        return [
          t.id,
          driver?.name || 'N/A',
          client?.name || 'N/A',
          t.fare.toFixed(2),
          t.status,
          t.distance.toFixed(2),
          t.duration,
          t.rating || '-',
          new Date(t.createdAt).toLocaleDateString(),
        ];
      });

      const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `viajes_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    },
  }
});
