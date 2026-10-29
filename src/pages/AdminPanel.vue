<template>
  <div class="admin-panel" role="main" aria-label="Panel d'administració principal">
    <div class="admin-header">
      <h1>🔧 Panel d'Administració</h1>
      <div class="admin-actions">
        <span v-if="adminStore.platformSettings.maintenanceMode" class="maintenance-badge" role="status" aria-live="polite">
          🔴 Mode Manteniment Actiu
        </span>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="admin-tabs" role="tablist" aria-label="Navegació del panel d'administració">
      <button 
        @click="activeTab = 'dashboard'" 
        :class="['tab-btn', { active: activeTab === 'dashboard' }]"
        role="tab"
        :aria-selected="activeTab === 'dashboard'"
        :tabindex="activeTab === 'dashboard' ? 0 : -1"
        aria-controls="dashboard-content"
      >
        📊 Panell Principal
      </button>
      <button 
        @click="activeTab = 'users'" 
        :class="['tab-btn', { active: activeTab === 'users' }]"
        role="tab"
        :aria-selected="activeTab === 'users'"
        :tabindex="activeTab === 'users' ? 0 : -1"
        aria-controls="users-content"
      >
        👥 Usuaris ({{ adminStore.getUserStats.total }})
      </button>
      <button 
        @click="activeTab = 'trips'" 
        :class="['tab-btn', { active: activeTab === 'trips' }]"
        role="tab"
        :aria-selected="activeTab === 'trips'"
        :tabindex="activeTab === 'trips' ? 0 : -1"
        aria-controls="trips-content"
      >
        🚗 Viatges ({{ adminStore.getTripStats.total }})
      </button>
      <button 
        @click="activeTab = 'registrations'" 
        :class="['tab-btn', { active: activeTab === 'registrations' }]"
        role="tab"
        :aria-selected="activeTab === 'registrations'"
        :tabindex="activeTab === 'registrations' ? 0 : -1"
        aria-controls="registrations-content"
      >
        ⏳ Sol·licituds
      </button>
      <button 
        @click="activeTab = 'drivers'" 
        :class="['tab-btn', { active: activeTab === 'drivers' }]"
        role="tab"
        :aria-selected="activeTab === 'drivers'"
        :tabindex="activeTab === 'drivers' ? 0 : -1"
        aria-controls="drivers-content"
      >
        👨‍🦰 Conductors
      </button>
      <button 
        @click="activeTab = 'analytics'" 
        :class="['tab-btn', { active: activeTab === 'analytics' }]"
        role="tab"
        :aria-selected="activeTab === 'analytics'"
        :tabindex="activeTab === 'analytics' ? 0 : -1"
        aria-controls="analytics-content"
      >
        📈 Estadístiques
      </button>
      <button 
        @click="activeTab = 'audit'" 
        :class="['tab-btn', { active: activeTab === 'audit' }]"
        role="tab"
        :aria-selected="activeTab === 'audit'"
        :tabindex="activeTab === 'audit' ? 0 : -1"
        aria-controls="audit-content"
      >
        📋 Auditoria
      </button>
      <button 
        @click="activeTab = 'settings'" 
        :class="['tab-btn', { active: activeTab === 'settings' }]"
        role="tab"
        :aria-selected="activeTab === 'settings'"
        :tabindex="activeTab === 'settings' ? 0 : -1"
        aria-controls="settings-content"
      >
        ⚙️ Configuració
      </button>
    </div>

    <!-- DASHBOARD TAB -->
    <div v-if="activeTab === 'dashboard'" class="tab-content" id="dashboard-content" role="tabpanel">
      <h2>Panell Principal</h2>
      <div class="stats-grid" role="list">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Usuaris Totals</h3>
            <p class="stat-number">{{ adminStore.getUserStats.total }}</p>
            <p class="stat-detail">{{ adminStore.getUserStats.clients }} clients, {{ adminStore.getUserStats.drivers }} conductors</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Usuaris Actius</h3>
            <p class="stat-number">{{ adminStore.getUserStats.active }}</p>
            <p class="stat-detail">{{ adminStore.getUserStats.inactive }} inactius</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🚗</div>
          <div class="stat-content">
            <h3>Viatges Totals</h3>
            <p class="stat-number">{{ adminStore.getTripStats.total }}</p>
            <p class="stat-detail">{{ adminStore.getTripStats.active }} en curs</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Ingressos Totals</h3>
            <p class="stat-number">€{{ adminStore.getTripStats.totalRevenue }}</p>
            <p class="stat-detail">Rating mitjà: {{ adminStore.getTripStats.averageRating }}⭐</p>
          </div>
        </div>
      </div>
    </div>

    <!-- USERS TAB -->
    <div v-if="activeTab === 'users'" class="tab-content">
      <div class="users-header">
        <h2>Gestió d'Usuaris</h2>
        <div class="users-controls">
          <input 
            v-model="adminStore.filter.searchTerm"
            @input="adminStore.setSearchTerm"
            type="text" 
            placeholder="Cercar per nom, email o telèfon..."
            class="search-input"
          >
          <select 
            v-model="adminStore.filter.userType"
            @change="adminStore.setUserTypeFilter(adminStore.filter.userType)"
            class="filter-select"
          >
            <option value="all">Tots els tipus</option>
            <option value="client">Clients</option>
            <option value="driver">Conductors</option>
          </select>
          <select 
            v-model="adminStore.filter.status"
            @change="adminStore.setStatusFilter(adminStore.filter.status)"
            class="filter-select"
          >
            <option value="all">Tots els estats</option>
            <option value="active">Actius</option>
            <option value="inactive">Inactius</option>
            <option value="banned">Baneats</option>
          </select>
          <select 
            v-model="adminStore.filter.sortBy"
            @change="adminStore.setSortBy(adminStore.filter.sortBy)"
            class="filter-select"
          >
            <option value="name">Ordenar per nom</option>
            <option value="createdAt">Més recents</option>
            <option value="trips">Per viatges</option>
            <option value="rating">Per rating</option>
          </select>
          <button @click="adminStore.exportUsersToCSV()" class="btn btn-export">
            📥 Exportar CSV
          </button>
        </div>
      </div>

      <div v-if="adminStore.getFilteredUsers.length === 0" class="empty-state">
        <p>No s'han trobat usuaris</p>
      </div>

      <div v-else class="users-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Telèfon</th>
              <th>Tipus</th>
              <th>Viatges</th>
              <th>Rating</th>
              <th>Estat</th>
              <th>Accions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in adminStore.getFilteredUsers" :key="user.id">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone || '-' }}</td>
              <td>
                <span :class="['badge', user.role === 'client' ? 'badge-client' : 'badge-driver']">
                  {{ user.role === 'client' ? 'Client' : 'Conductor' }}
                </span>
              </td>
              <td>{{ user.tripHistory?.length || 0 }}</td>
              <td>{{ user.rating || '-' }}⭐</td>
              <td>
                <span v-if="user.isBanned" class="badge badge-banned">Banejat</span>
                <span v-else-if="!user.isActive" class="badge badge-inactive">Inactiu</span>
                <span v-else class="badge badge-active">Actiu</span>
              </td>
              <td>
                <div class="action-buttons">
                  <button @click="adminStore.setSelectedUser(user.id); showUserDetailDialog = true" class="btn-small">
                    👁️ Veure
                  </button>
                  <button @click="adminStore.setEditingUser(user.id); showEditUserDialog = true" class="btn-small">
                    ✏️ Editar
                  </button>
                  <div class="dropdown-menu">
                    <button class="btn-small">⋮</button>
                    <div class="dropdown-content">
                      <button v-if="!user.isBanned" @click="banUserAction(user)" class="dropdown-item danger">
                        🚫 Banear
                      </button>
                      <button v-if="user.isBanned" @click="unbanUserAction(user)" class="dropdown-item">
                        ✅ Desbanear
                      </button>
                      <button v-if="user.isActive" @click="deactivateUserAction(user)" class="dropdown-item danger">
                        ❌ Desactivar
                      </button>
                      <button v-if="!user.isActive" @click="activateUserAction(user)" class="dropdown-item">
                        ✅ Activar
                      </button>
                      <button @click="deleteUserAction(user)" class="dropdown-item danger">
                        🗑️ Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- TRIPS TAB -->
    <div v-if="activeTab === 'trips'" class="tab-content">
      <div class="trips-header">
        <h2>Gestió de Viatges</h2>
        <button @click="adminStore.exportTripsToCSV()" class="btn btn-export">
          📥 Exportar CSV
        </button>
      </div>

      <div v-if="adminStore.allTrips.length === 0" class="empty-state">
        <p>No hi ha viatges registrats</p>
      </div>

      <div v-else class="trips-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Conductor</th>
              <th>Client</th>
              <th>Tarifa</th>
              <th>Distància</th>
              <th>Durada</th>
              <th>Estat</th>
              <th>Rating</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trip in adminStore.allTrips" :key="trip.id" @click="viewTripDetail(trip)" class="trip-row clickable-row">
              <td>#{{ trip.id }}</td>
              <td>{{ getDriverName(trip.driverId) }}</td>
              <td>{{ getClientName(trip.clientId) }}</td>
              <td>€{{ trip.fare.toFixed(2) }}</td>
              <td>{{ trip.distance.toFixed(2) }} km</td>
              <td>{{ trip.duration }} min</td>
              <td>
                <span :class="['badge', 'badge-' + trip.status]">
                  {{ formatTripStatus(trip.status) }}
                </span>
              </td>
              <td>{{ trip.rating ? trip.rating + '⭐' : '-' }}</td>
              <td>{{ formatDate(trip.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- REGISTRATIONS TAB -->
    <div v-if="activeTab === 'registrations'" class="tab-content">
      <h2>Sol·licituds de Registre Pendents</h2>
      
      <div v-if="pendingRequests.length === 0" class="empty-state">
        <p>No hi ha sol·licituds pendents</p>
      </div>

      <div v-else class="requests-grid">
        <div v-for="request in pendingRequests" :key="request.id" class="request-card">
          <div class="request-header">
            <h3>{{ request.name }}</h3>
            <span class="badge badge-pending">{{ request.userType === 'client' ? 'Client' : 'Conductor' }}</span>
          </div>

          <div class="request-details">
            <p><strong>Correu:</strong> {{ request.email }}</p>
            <p><strong>Telèfon:</strong> {{ request.phone }}</p>
            <p><strong>DNI:</strong> {{ request.dni }}</p>
            <p class="request-date">Sol·licitud: {{ formatDate(request.createdAt) }}</p>
          </div>

          <div class="request-actions">
            <button @click="viewRegistrationDetail(request)" class="btn btn-info">Detalls</button>
            <button @click="approveRegistration(request)" class="btn btn-success">✓ Aprovar</button>
            <button @click="showRejectDialog = true; selectedRequest = request" class="btn btn-danger">✗ Rebutjar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- DRIVERS TAB -->
    <div v-if="activeTab === 'drivers'" class="tab-content">
      <h2>Gestió de Conductors</h2>
      
      <div class="drivers-header">
        <h3>Performance dels Conductors</h3>
      </div>

      <div v-if="adminStore.allUsers.filter(u => u.role === 'driver').length === 0" class="empty-state">
        <p>No hi ha conductors registrats</p>
      </div>

      <div v-else class="drivers-grid">
        <div v-for="driver in adminStore.allUsers.filter(u => u.role === 'driver')" :key="driver.id" class="driver-card">
          <div class="driver-header">
            <h3>{{ driver.name }}</h3>
            <span class="rating-badge">⭐ {{ driver.rating || 0 }}</span>
          </div>
          
          <div class="driver-info">
            <p><strong>Vehicle:</strong> {{ driver.vehicle || '-' }}</p>
            <p><strong>Matrícula:</strong> {{ driver.plate || '-' }}</p>
            <p><strong>Email:</strong> {{ driver.email }}</p>
            <p><strong>Telèfon:</strong> {{ driver.phone || '-' }}</p>
          </div>

          <div class="driver-stats">
            <div class="stat-item">
              <span class="stat-label">Viatges</span>
              <span class="stat-value">{{ getDriverStats(driver.id).totalTrips }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Completats</span>
              <span class="stat-value">{{ getDriverStats(driver.id).completed }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Cancelled</span>
              <span class="stat-value">{{ getDriverStats(driver.id).cancelled }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Guanys</span>
              <span class="stat-value">€{{ getDriverStats(driver.id).earnings.toFixed(2) }}</span>
            </div>
          </div>

          <div class="driver-actions">
            <button @click="adminStore.setSelectedUser(driver.id); showUserDetailDialog = true" class="btn btn-small">
              👁️ Veure Detalls
            </button>
            <button @click="adminStore.setEditingUser(driver.id); showEditUserDialog = true" class="btn btn-small">
              ✏️ Editar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ANALYTICS TAB -->
    <div v-if="activeTab === 'analytics'" class="tab-content">
      <h2>Estadístiques i Reportes</h2>
      
      <div class="analytics-section">
        <h3>KPIs Principals</h3>
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-value">{{ analyticsDashboard.users.total }}</div>
            <div class="kpi-label">Usuaris Totals</div>
            <div class="kpi-detail">{{ analyticsDashboard.users.drivers }} conductors, {{ analyticsDashboard.users.clients }} clients</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-value">{{ analyticsDashboard.trips.total }}</div>
            <div class="kpi-label">Viatges</div>
            <div class="kpi-detail">{{ analyticsDashboard.trips.completed }} completats ({{ analyticsDashboard.trips.completionRate }}%)</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-value">€{{ analyticsDashboard.revenue.total }}</div>
            <div class="kpi-label">Ingressos Totals</div>
            <div class="kpi-detail">Comissió: €{{ analyticsDashboard.revenue.commission }}</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-value">{{ analyticsDashboard.ratings.average }}⭐</div>
            <div class="kpi-label">Rating Mitjà</div>
            <div class="kpi-detail">{{ analyticsDashboard.trips.completed }} viatges valorats</div>
          </div>
        </div>
      </div>

      <div class="analytics-section">
        <h3>Top 5 Conductors</h3>
        <div v-if="analyticsDashboard.drivers.topDrivers.length === 0" class="empty-state">
          <p>No hi ha dades de conductors</p>
        </div>
        <div v-else class="top-drivers-table">
          <table>
            <thead>
              <tr>
                <th>Conductor</th>
                <th>Viatges</th>
                <th>Guanys</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="driver in analyticsDashboard.drivers.topDrivers" :key="driver.id">
                <td>{{ driver.name }}</td>
                <td>{{ driver.tripCount }}</td>
                <td>€{{ driver.earnings.toFixed(2) }}</td>
                <td>{{ driver.rating }}⭐</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="analytics-section">
        <h3>Distribució de Ratings</h3>
        <div class="rating-distribution">
          <div v-for="(count, rating) in analyticsDashboard.ratings.distribution" :key="rating" class="rating-bar">
            <span class="rating-label">{{ rating }}⭐</span>
            <div class="bar">
              <div class="fill" :style="{ width: getRatingBarWidth(count) + '%' }"></div>
            </div>
            <span class="count">{{ count }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'audit'" class="tab-content">
      <h2>Registre d'Auditoria</h2>

      <div v-if="adminStore.getAuditLog.length === 0" class="empty-state">
        <p>No hi ha accions registrades</p>
      </div>

      <div v-else class="audit-table">
        <table>
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Acció</th>
              <th>Descripció</th>
              <th>Admin ID</th>
              <th>Usuari ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in adminStore.getAuditLog" :key="log.id">
              <td>{{ formatDate(log.timestamp) }}</td>
              <td><code>{{ log.action }}</code></td>
              <td>{{ log.description }}</td>
              <td>#{{ log.adminId }}</td>
              <td>{{ log.userId ? '#' + log.userId : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SETTINGS TAB -->
    <div v-if="activeTab === 'settings'" class="tab-content">
      <h2>Configuració de la Plataforma</h2>

      <div class="settings-container">
        <div class="settings-section">
          <h3>Configuració General</h3>
          
          <div class="setting-item">
            <label>Percentatge de Comissió (%)</label>
            <input 
              v-model.number="adminStore.platformSettings.commissionRate"
              type="number"
              min="0"
              max="100"
              @change="adminStore.updatePlatformSetting('commissionRate', adminStore.platformSettings.commissionRate)"
            >
          </div>

          <div class="setting-item">
            <label>Saldo Mínim (€)</label>
            <input 
              v-model.number="adminStore.platformSettings.minimumBalance"
              type="number"
              min="0"
              @change="adminStore.updatePlatformSetting('minimumBalance', adminStore.platformSettings.minimumBalance)"
            >
          </div>

          <div class="setting-item">
            <label>Distància Màxima de Viatge (km)</label>
            <input 
              v-model.number="adminStore.platformSettings.maxRideDistance"
              type="number"
              min="0"
              @change="adminStore.updatePlatformSetting('maxRideDistance', adminStore.platformSettings.maxRideDistance)"
            >
          </div>

          <div class="setting-item">
            <label>Email de Suport</label>
            <input 
              v-model="adminStore.platformSettings.supportEmail"
              type="email"
              @change="adminStore.updatePlatformSetting('supportEmail', adminStore.platformSettings.supportEmail)"
            >
          </div>

          <div class="setting-item">
            <label>Telèfon d'Emergència</label>
            <input 
              v-model="adminStore.platformSettings.emergencyPhone"
              type="tel"
              @change="adminStore.updatePlatformSetting('emergencyPhone', adminStore.platformSettings.emergencyPhone)"
            >
          </div>
        </div>

        <div class="settings-section">
          <h3>Mode de Manteniment</h3>
          <p class="setting-description">Activa el mode de manteniment per restringir l'accés a la plataforma</p>
          
          <div class="setting-item">
            <label class="toggle-label">
              <input 
                v-model="adminStore.platformSettings.maintenanceMode"
                type="checkbox"
                @change="toggleMaintenanceMode"
              >
              <span>Mode de Manteniment Actiu</span>
            </label>
            <p v-if="adminStore.platformSettings.maintenanceMode" class="warning">
              ⚠️ La plataforma està en mode de manteniment. Els usuaris no podran accedir.
            </p>
          </div>
        </div>

        <div class="settings-section danger">
          <h3>Accions Perilloses</h3>
          <p class="setting-description">Aquestes accions no es poden desfer</p>
          
          <button @click="confirmClearAllData" class="btn btn-danger-full">
            🗑️ Esborrar Totes les Dades de Demostració
          </button>
        </div>
      </div>
    </div>

    <!-- DIALOGS -->

    <!-- User Detail Dialog -->
    <div v-if="showUserDetailDialog && adminStore.selectedUser" class="dialog-overlay" @click.self="showUserDetailDialog = false">
      <div class="dialog detail-dialog">
        <h3>{{ adminStore.selectedUser.name }}</h3>
        <div class="detail-content">
          <div class="detail-section">
            <h4>Informació Bàsica</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Nom:</label>
                <p>{{ adminStore.selectedUser.name }}</p>
              </div>
              <div class="detail-item">
                <label>Email:</label>
                <p>{{ adminStore.selectedUser.email }}</p>
              </div>
              <div class="detail-item">
                <label>Telèfon:</label>
                <p>{{ adminStore.selectedUser.phone || '-' }}</p>
              </div>
              <div class="detail-item">
                <label>Tipus:</label>
                <p>{{ adminStore.selectedUser.role === 'client' ? 'Client' : 'Conductor' }}</p>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Estadístiques</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Viatges Totals:</label>
                <p>{{ adminStore.selectedUser.tripHistory?.length || 0 }}</p>
              </div>
              <div class="detail-item">
                <label>Rating:</label>
                <p>{{ adminStore.selectedUser.rating || '-' }}⭐</p>
              </div>
              <div class="detail-item">
                <label>Creat:</label>
                <p>{{ formatDate(adminStore.selectedUser.createdAt) }}</p>
              </div>
              <div class="detail-item">
                <label>Estat:</label>
                <p>{{ adminStore.selectedUser.isBanned ? 'Banejat' : (adminStore.selectedUser.isActive ? 'Actiu' : 'Inactiu') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="dialog-actions">
          <button @click="showUserDetailDialog = false" class="btn btn-secondary">Tancar</button>
        </div>
      </div>
    </div>

    <!-- Edit User Dialog -->
    <div v-if="showEditUserDialog && adminStore.editingUser" class="dialog-overlay" @click.self="showEditUserDialog = false">
      <div class="dialog">
        <h3>Editar Usuari</h3>
        <div class="form-group">
          <label>Nom</label>
          <input v-model="adminStore.editingUser.name" type="text">
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="adminStore.editingUser.email" type="email">
        </div>
        <div class="form-group">
          <label>Telèfon</label>
          <input v-model="adminStore.editingUser.phone" type="tel">
        </div>
        <div class="dialog-actions">
          <button @click="showEditUserDialog = false; adminStore.cancelEditUser()" class="btn btn-secondary">Cancelar</button>
          <button @click="saveEditedUser" class="btn btn-success">Guardar</button>
        </div>
      </div>
    </div>

    <!-- Ban User Dialog -->
    <div v-if="showBanDialog && selectedUserForAction" class="dialog-overlay" @click.self="showBanDialog = false">
      <div class="dialog">
        <h3>Banear Usuari</h3>
        <p>¿Estàs segur que vols banear a <strong>{{ selectedUserForAction.name }}</strong>?</p>
        <textarea 
          v-model="banReason"
          placeholder="Motiu del ban..."
          rows="3"
        ></textarea>
        <div class="dialog-actions">
          <button @click="showBanDialog = false" class="btn btn-secondary">Cancelar</button>
          <button @click="confirmBanUser" class="btn btn-danger">Banear</button>
        </div>
      </div>
    </div>

    <!-- Reject Registration Dialog -->
    <div v-if="showRejectDialog && selectedRequest" class="dialog-overlay" @click.self="showRejectDialog = false">
      <div class="dialog">
        <h3>Rebutjar Sol·licitud</h3>
        <p>¿Per què vols rebutjar la sol·licitud de <strong>{{ selectedRequest.name }}</strong>?</p>
        <textarea 
          v-model="rejectionReason"
          placeholder="Motiu del rebuig..."
          rows="4"
        ></textarea>
        <div class="dialog-actions">
          <button @click="showRejectDialog = false" class="btn btn-secondary">Cancelar</button>
          <button @click="rejectRegistration" class="btn btn-danger">Rebutjar</button>
        </div>
      </div>
    </div>

    <!-- Trip Detail Dialog -->
    <div v-if="showTripDetailDialog && selectedTrip" class="dialog-overlay" @click.self="showTripDetailDialog = false">
      <div class="dialog detail-dialog">
        <h3>Detalls del Viatge #{{ selectedTrip.id }}</h3>
        <div class="detail-content">
          <div class="detail-section">
            <h4>Informació General</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>ID Viatge:</label>
                <p>#{{ selectedTrip.id }}</p>
              </div>
              <div class="detail-item">
                <label>Estat:</label>
                <p>
                  <span :class="['badge', 'badge-' + selectedTrip.status]">
                    {{ formatTripStatus(selectedTrip.status) }}
                  </span>
                </p>
              </div>
              <div class="detail-item">
                <label>Data:</label>
                <p>{{ formatDate(selectedTrip.createdAt) }}</p>
              </div>
              <div class="detail-item">
                <label>Rating:</label>
                <p>{{ selectedTrip.rating ? selectedTrip.rating + '⭐' : '-' }}</p>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Participants</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Conductor:</label>
                <p>{{ getDriverName(selectedTrip.driverId) }}</p>
              </div>
              <div class="detail-item">
                <label>Client:</label>
                <p>{{ getClientName(selectedTrip.clientId) }}</p>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Ruta i Distància</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Distància:</label>
                <p>{{ selectedTrip.distance.toFixed(2) }} km</p>
              </div>
              <div class="detail-item">
                <label>Durada:</label>
                <p>{{ selectedTrip.duration }} minuts</p>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h4>Tarifa i Pagament</h4>
            <div class="detail-grid">
              <div class="detail-item">
                <label>Tarifa Base:</label>
                <p>€{{ (selectedTrip.fare || 0).toFixed(2) }}</p>
              </div>
              <div class="detail-item">
                <label>Mètode de Pagament:</label>
                <p>{{ selectedTrip.paymentMethod || '-' }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedTrip.notes" class="detail-section">
            <h4>Notes</h4>
            <p>{{ selectedTrip.notes }}</p>
          </div>
        </div>

        <div class="dialog-actions">
          <button @click="showTripDetailDialog = false" class="btn btn-secondary">Tancar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '../store/adminStore';
import { useRegistrationStore } from '../store/registrationStore';
import { useAnalyticsStore } from '../store/analyticsStore';

const adminStore = useAdminStore();
const registrationStore = useRegistrationStore();
const analyticsStore = useAnalyticsStore();

const activeTab = ref('dashboard');
const showUserDetailDialog = ref(false);
const showEditUserDialog = ref(false);
const showBanDialog = ref(false);
const showRejectDialog = ref(false);
const showTripDetailDialog = ref(false);
const selectedUserForAction = ref(null);
const selectedRequest = ref(null);
const selectedTrip = ref(null);
const banReason = ref('');
const rejectionReason = ref('');

const pendingRequests = computed(() => registrationStore.getPendingRequests);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ca-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatTripStatus = (status) => {
  const statuses = {
    'completed': 'Completat',
    'in-progress': 'En curs',
    'cancelled': 'Cancel·lat'
  };
  return statuses[status] || status;
};

const getDriverName = (driverId) => {
  const driver = adminStore.allUsers.find(u => u.id === driverId);
  return driver?.name || 'Desconegut';
};

const getClientName = (clientId) => {
  const client = adminStore.allUsers.find(u => u.id === clientId);
  return client?.name || 'Desconegut';
};

const banUserAction = (user) => {
  selectedUserForAction.value = user;
  banReason.value = '';
  showBanDialog.value = true;
};

const unbanUserAction = (user) => {
  adminStore.unbanUser(user.id);
  adminStore.logAction('UNBAN_USER', `Usuari desbaneajat: ${user.name}`);
};

const deactivateUserAction = (user) => {
  adminStore.deactivateUser(user.id);
};

const activateUserAction = (user) => {
  adminStore.activateUser(user.id);
};

const deleteUserAction = (user) => {
  if (confirm(`¿Estàs segur de que vols eliminar permanentment a ${user.name}?`)) {
    adminStore.deleteUser(user.id);
  }
};

const confirmBanUser = () => {
  if (selectedUserForAction.value) {
    adminStore.banUser(selectedUserForAction.value.id, banReason.value);
    showBanDialog.value = false;
    selectedUserForAction.value = null;
  }
};

const saveEditedUser = () => {
  if (adminStore.editingUser) {
    adminStore.updateUser(adminStore.editingUser.id, adminStore.editingUser);
    showEditUserDialog.value = false;
    adminStore.cancelEditUser();
  }
};

const approveRegistration = (request) => {
  registrationStore.approveRequest(request.id);
  adminStore.logAction('APPROVE_REGISTRATION', `Sol·licitud aprovada: ${request.name}`);
};

const rejectRegistration = () => {
  if (!rejectionReason.value.trim()) {
    alert('Si us plau, proporciona un motiu');
    return;
  }
  if (selectedRequest.value) {
    registrationStore.rejectRequest(selectedRequest.value.id, rejectionReason.value);
    adminStore.logAction('REJECT_REGISTRATION', `Sol·licitud rebutjada: ${selectedRequest.value.name} - ${rejectionReason.value}`);
    showRejectDialog.value = false;
    selectedRequest.value = null;
  }
};

const viewRegistrationDetail = (request) => {
  adminStore.setSelectedUser(request.id);
  showUserDetailDialog.value = true;
};

const viewTripDetail = (trip) => {
  selectedTrip.value = trip;
  showTripDetailDialog.value = true;
};

const toggleMaintenanceMode = () => {
  if (adminStore.platformSettings.maintenanceMode) {
    adminStore.enableMaintenanceMode();
  } else {
    adminStore.disableMaintenanceMode();
  }
};

const confirmClearAllData = () => {
  if (confirm('¿Estàs segur? Això eliminarà TOTES les dades de demostració. NO ES POT DESFER.')) {
    adminStore.allUsers = [];
    adminStore.allTrips = [];
    adminStore.auditLog = [];
    adminStore.saveToLocalStorage();
    alert('Totes les dades han estat esborrades');
  }
};

// Analytics computed
const analyticsDashboard = computed(() => analyticsStore.getDashboardStats);

// Mètodes per analytics
const getDriverStats = (driverId) => {
  const trips = adminStore.allTrips;
  const totalTrips = trips.filter(t => t.driverId === driverId).length;
  const completed = trips.filter(t => t.driverId === driverId && t.status === 'completed').length;
  const cancelled = trips.filter(t => t.driverId === driverId && t.status === 'cancelled').length;
  const earnings = trips
    .filter(t => t.driverId === driverId && t.status === 'completed')
    .reduce((sum, t) => sum + (t.fare || 0) * 0.8, 0); // 80% al conductor

  return { totalTrips, completed, cancelled, earnings };
};

const getRatingBarWidth = (count) => {
  const maxCount = 20; // Valor per referència
  return (count / maxCount) * 100;
};

onMounted(() => {
  adminStore.initializeAdmin();
  registrationStore.loadFromLocalStorage();
});
</script>

<style scoped>
.admin-panel {
  padding: 40px 20px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f8f9fa;
  min-height: 100vh;
  font-size: 16px;
  line-height: 1.6;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.admin-header h1 {
  color: #0066cc;
  margin: 0;
  font-size: 32px;
  font-weight: 700;
}

.maintenance-badge {
  background: #cc0000;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.admin-tabs {
  display: flex;
  gap: 5px;
  margin-bottom: 30px;
  border-bottom: 2px solid #ddd;
  flex-wrap: wrap;
}

.tab-btn {
  background: none;
  border: none;
  padding: 12px 16px;
  border-bottom: 3px solid transparent;
  cursor: pointer;
  font-weight: 600;
  color: #333333;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 14px;
}

.tab-btn:hover {
  color: #1d5047;
  background-color: #f0f0f0;
}

.tab-btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.tab-btn.active {
  color: #1d5047;
  border-bottom-color: #1d5047;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.tab-content h2 {
  color: #000000;
  margin-bottom: 20px;
  font-size: 24px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.stat-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.stat-content h3 {
  margin: 0 0 10px 0;
  color: #000000;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.stat-number {
  margin: 0 0 5px 0;
  font-size: 32px;
  font-weight: 700;
  color: #0066cc;
}

.stat-detail {
  margin: 0;
  font-size: 14px;
  color: #333333;
  line-height: 1.5;
}

/* Users Section */
.users-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.users-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  flex: 1;
}

.search-input,
.filter-select {
  padding: 10px 12px;
  border: 2px solid #cccccc;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #000000;
  min-height: 40px;
  font-family: inherit;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
}

.btn-export {
  background: #0066cc;
  color: white;
  padding: 10px 16px;
  font-size: 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  min-height: 40px;
}

.btn-export:hover {
  background: #003d99;
}

.btn-export:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Tables */
.users-table,
.trips-table,
.audit-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

thead {
  background: #f5f5f5;
  border-bottom: 2px solid #cccccc;
}

th {
  padding: 14px;
  text-align: left;
  font-weight: 700;
  font-size: 14px;
  color: #000000;
  white-space: nowrap;
}

td {
  padding: 14px;
  border-bottom: 1px solid #e9ecef;
  font-size: 14px;
  color: #000000;
  line-height: 1.5;
}

tbody tr:hover {
  background: #f9f9f9;
}

.clickable-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.clickable-row:hover {
  background: #e8f5f4;
  box-shadow: inset 0 0 0 1px #2E7D6E;
}

/* Badges */
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-client {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-driver {
  background: #f3e5f5;
  color: #7b1fa2;
}

.badge-active {
  background: #ccffcc;
  color: #006600;
  border: 1px solid #008800;
}

.badge-inactive {
  background: #f0f0f0;
  color: #000000;
  border: 1px solid #999999;
}

.badge-banned {
  background: #ffcccc;
  color: #660000;
  border: 1px solid #cc0000;
}

.badge-pending {
  background: #ffffcc;
  color: #000000;
  border: 1px solid #999999;
}

.badge-completed {
  background: #ccffcc;
  color: #006600;
  border: 1px solid #008800;
}

.badge-in-progress {
  background: #d1ecf1;
  color: #0c5460;
}

.badge-cancelled {
  background: #f8d7da;
  color: #721c24;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 5px;
  position: relative;
}

.btn-small {
  padding: 5px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.2s;
}

.btn-small:hover {
  border-color: #2E7D6E;
  color: #2E7D6E;
}

.dropdown-menu {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: none;
  flex-direction: column;
  z-index: 100;
  min-width: 150px;
}

.dropdown-menu:hover .dropdown-content {
  display: flex;
}

.dropdown-item {
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
  color: #333;
  transition: all 0.2s;
  border-bottom: 1px solid #e9ecef;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.dropdown-item.danger {
  color: #d32f2f;
}

/* Requests Grid */
.requests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.request-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.request-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #e9ecef;
}

.request-header h3 {
  margin: 0;
  color: #000000;
  font-size: 16px;
}

.request-details {
  margin-bottom: 15px;
  font-size: 13px;
}

.request-details p {
  margin: 6px 0;
}

.request-date {
  font-size: 11px;
  color: #999;
  font-style: italic;
}

.request-actions {
  display: flex;
  gap: 8px;
  flex-direction: column;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  transition: all 0.3s ease;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn:focus {
  outline: 2px solid #0066cc;
}

.btn-info {
  background: #0066cc;
  color: white;
}

.btn-info:hover {
  background: #0052a3;
}

.btn-success {
  background: #228822;
  color: white;
}

.btn-success:hover {
  background: #1a6a1a;
}

.btn-danger {
  background: #cc0000;
  color: white;
}

.btn-danger:hover {
  background: #990000;
}

.btn-danger-full {
  width: 100%;
  padding: 12px;
  background: #cc0000;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 10px;
  outline: 2px solid transparent;
  outline-offset: 2px;
}

.btn-danger-full:focus {
  outline: 2px solid #0066cc;
}

.btn-danger-full:hover {
  background: #990000;
}

.btn-secondary {
  background: #eeeeee;
  color: #000000;
  border: 1px solid #999999;
}

.btn-secondary:hover {
  background: #dddddd;
}

/* Dialogs */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog {
  background: white;
  border-radius: 8px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.detail-dialog {
  max-width: 700px;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog h3 {
  margin: 0 0 20px 0;
  color: #000000;
  font-size: 18px;
}

.detail-content {
  margin: 20px 0;
}

.detail-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e9ecef;
}

.detail-section:last-of-type {
  border-bottom: none;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #0066cc;
  font-size: 14px;
  font-weight: 600;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  flex-direction: column;
}

.detail-item label {
  font-weight: 600;
  color: #000000;
  font-size: 12px;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.detail-item p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #000000;
  margin-bottom: 6px;
  font-size: 13px;
}

.form-group input,
.dialog textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #333333;
  border-radius: 4px;
  font-family: inherit;
  font-size: 13px;
  color: #000000;
}

.form-group input:focus,
.dialog textarea:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.2);
}

.form-group input::placeholder,
.dialog textarea::placeholder {
  color: #666666;
}

.dialog-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-actions .btn {
  flex: 1;
}

/* Settings */
.settings-container {
  background: white;
  border-radius: 8px;
  padding: 30px;
}

.settings-section {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e9ecef;
}

.settings-section:last-of-type {
  border-bottom: none;
}

.settings-section h3 {
  margin: 0 0 15px 0;
  color: #1a1a1a;
  font-size: 18px;
}

.settings-section.danger {
  border: 1px solid #f8d7da;
  border-radius: 6px;
  padding: 20px;
  background: #fff8f9;
}

.setting-description {
  color: #666;
  font-size: 13px;
  margin-bottom: 15px;
}

.setting-item {
  margin-bottom: 15px;
}

.setting-item label {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  font-size: 13px;
}

.setting-item input {
  width: 100%;
  max-width: 300px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 13px;
}

.setting-item input:focus {
  outline: none;
  border-color: #2E7D6E;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 13px;
}

.toggle-label input {
  width: auto;
}

.warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 12px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* Drivers Grid */
.drivers-header {
  margin-bottom: 20px;
}

.drivers-header h3 {
  color: #1a1a1a;
  margin: 0 0 15px 0;
}

.drivers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.driver-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.driver-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.driver-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
}

.driver-header h3 {
  margin: 0;
  color: #000000;
  font-size: 18px;
}

.rating-badge {
  background: #ffffcc;
  color: #000000;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
  border: 1px solid #999999;
}

.driver-info {
  margin-bottom: 15px;
  font-size: 13px;
}

.driver-info p {
  margin: 6px 0;
  color: #666;
}

.driver-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 11px;
  color: #333333;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 5px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #0066cc;
}

.driver-actions {
  display: flex;
  gap: 8px;
}

.driver-actions .btn-small {
  flex: 1;
}

/* Analytics Section */
.analytics-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.analytics-section h3 {
  margin: 0 0 20px 0;
  color: #000000;
  font-size: 18px;
  font-weight: 600;
}

/* KPI Grid */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.kpi-card {
  background: linear-gradient(135deg, #0066cc 0%, #003d99 100%);
  border-radius: 8px;
  padding: 20px;
  color: white;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 102, 204, 0.3);
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 5px;
}

.kpi-label {
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 5px;
  opacity: 0.9;
}

.kpi-detail {
  font-size: 11px;
  opacity: 0.8;
}

/* Top Drivers Table */
.top-drivers-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Rating Distribution */
.rating-distribution {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.rating-label {
  min-width: 40px;
  font-weight: 600;
  color: #000000;
  font-size: 13px;
}

.bar {
  flex: 1;
  height: 24px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #0066cc, #003d99);
  border-radius: 4px;
  transition: all 0.3s ease;
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Focus visible for keyboard navigation */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

/* Improve text color contrast */
a {
  color: #0066cc;
  text-decoration: underline;
}

a:hover {
  color: #003d99;
}

/* High contrast for dropdown items */
.dropdown-item {
  color: #000000;
}

.dropdown-item.danger {
  color: #cc0000;
}

.count {
  min-width: 30px;
  text-align: right;
  font-weight: 600;
  color: #666;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 768px) {
  .admin-panel {
    padding: 20px;
  }

  .admin-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .admin-header h1 {
    font-size: 24px;
  }

  .admin-tabs {
    overflow-x: auto;
    padding-bottom: 10px;
  }

  .tab-btn {
    padding: 10px 12px;
    font-size: 12px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .users-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input,
  .filter-select,
  .btn-export {
    width: 100%;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .dialog {
    width: 95%;
    padding: 20px;
  }

  table {
    font-size: 12px;
  }

  th, td {
    padding: 8px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-small {
    width: 100%;
  }
}
</style>
