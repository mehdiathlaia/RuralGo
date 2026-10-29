<template>
  <div class="history-page">
    <div class="header">
      <h1><svg class="header-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg> Historial de Viatges</h1>
      <p>Consulta tots els teus viatges realitzats</p>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <label>Filtra per data</label>
        <input 
          v-model="filterStartDate" 
          type="date" 
          class="date-input"
        />
        <span class="separator">-</span>
        <input 
          v-model="filterEndDate" 
          type="date" 
          class="date-input"
        />
      </div>

      <div class="filter-group">
        <label>Filtra per servei</label>
        <select v-model="filterService" class="select-input">
          <option value="">Tots els serveis</option>
          <option value="cultura">RURAL-GO Cultura</option>
          <option value="familia">RURAL-GO Família</option>
          <option value="salut">RURAL-GO Salut</option>
          <option value="compres">RURAL-GO Serveis Comunitaris</option>
          <option value="natura">RURAL-GO Natura</option>
        </select>
      </div>

      <button @click="applyFilters" class="btn-filter">Filtrar</button>
      <button @click="clearFilters" class="btn-clear">Netejar</button>
    </div>

    <!-- Statistics -->
    <div class="statistics-grid">
      <div class="stat-card">
        <span class="stat-label">Total Viatges</span>
        <span class="stat-value">{{ statistics.totalTrips }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Valoració Mitjana</span>
        <span class="stat-value"><svg class="stat-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ statistics.averageRating }}/5</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Km Recorreguts</span>
        <span class="stat-value">{{ statistics.totalKm }} km</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">Viatges Aquest Mes</span>
        <span class="stat-value">{{ statistics.tripsThisMonth }}</span>
      </div>
    </div>

    <!-- Trips List -->
    <div class="trips-list">
      <div v-if="filteredTrips.length === 0" class="no-trips">
        <svg class="empty-icon" viewBox="0 0 24 24"><path :d="mdiEmoticonSadOutline" fill="currentColor" /></svg>
        <p>No hi ha viatges per mostrar</p>
      </div>

      <div 
        v-for="trip in filteredTrips"
        :key="trip.id"
        class="trip-card"
        @click="selectedTrip = trip"
      >
        <div class="trip-header">
          <div class="trip-info">
            <span class="trip-service" :style="{ color: getServiceColor(trip.service) }">
              {{ getServiceName(trip.service) }}
            </span>
            <span class="trip-date">{{ formatDate(trip.createdAt) }}</span>
          </div>
          <span class="trip-rating"><svg class="rating-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ trip.rating }}/5</span>
        </div>

        <div class="trip-details">
          <div class="detail">
            <span class="label">Pickup:</span>
            <span class="value">{{ trip.pickup }}</span>
          </div>
          <div class="detail">
            <span class="label">Conductor:</span>
            <span class="value">{{ trip.driver?.name || 'No assignat' }}</span>
          </div>
          <div class="detail">
            <span class="label">Distància:</span>
            <span class="value">{{ trip.totalKm || 0 }} km</span>
          </div>
          <div class="detail">
            <span class="label">Estat:</span>
            <span class="value status" :class="trip.finalState">
              <svg v-if="trip.finalState === 'ok'" class="status-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
              <svg v-else class="status-icon" viewBox="0 0 24 24"><path :d="mdiAlert" fill="currentColor" /></svg>
              {{ trip.finalState === 'ok' ? 'Completat' : 'Incident' }}
            </span>
          </div>
        </div>

        <div class="trip-footer">
          <button class="btn-details" @click.stop="viewDetails(trip)">Veure Detalls</button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div v-if="selectedTrip" class="modal-overlay" @click.self="selectedTrip = null">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Detalls del Viatge</h2>
          <button class="close-btn" @click="selectedTrip = null">✕</button>
        </div>

        <div class="modal-body">
          <!-- Basic Info -->
          <div class="section">
            <h3>Informació General</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="label">Servei:</span>
                <span class="value">{{ getServiceName(selectedTrip.service) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Data:</span>
                <span class="value">{{ formatDate(selectedTrip.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Tipus Vehicle:</span>
                <span class="value">{{ getVehicleType(selectedTrip.vehicleType) }}</span>
              </div>
              <div class="info-item">
                <span class="label">Estat Final:</span>
                <span class="value" :class="selectedTrip.finalState">
                  <svg v-if="selectedTrip.finalState === 'ok'" class="status-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                  <svg v-else class="status-icon" viewBox="0 0 24 24"><path :d="mdiAlert" fill="currentColor" /></svg>
                  {{ selectedTrip.finalState === 'ok' ? 'Completat' : 'Incident' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Route -->
          <div class="section">
            <h3>Ruta</h3>
            <div class="route-info">
              <div class="route-item">
                <svg class="route-icon" viewBox="0 0 24 24"><path :d="mdiMapMarker" fill="currentColor" /></svg>
                <div>
                  <span class="label">Pickup:</span>
                  <span class="value">{{ selectedTrip.pickup }}</span>
                </div>
              </div>
              <div class="route-item">
                <svg class="route-icon" viewBox="0 0 24 24"><path :d="mdiTarget" fill="currentColor" /></svg>
                <div>
                  <span class="label">Destí:</span>
                  <span class="value">{{ selectedTrip.destination || 'No especificat' }}</span>
                </div>
              </div>
              <div class="distance-info">
                <svg class="distance-icon" viewBox="0 0 24 24"><path :d="mdiRuler" fill="currentColor" /></svg> {{ selectedTrip.totalKm || 0 }} km
              </div>
            </div>
          </div>

          <!-- Driver -->
          <div class="section">
            <h3>Conductor</h3>
            <div class="driver-info">
              <span class="driver-name">{{ selectedTrip.driver?.name || 'No assignat' }}</span>
              <span class="driver-rating"><svg class="rating-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ selectedTrip.driver?.rating || 0 }}/5</span>
              <span class="driver-vehicle"><svg class="vehicle-icon" viewBox="0 0 24 24"><path :d="mdiCar" fill="currentColor" /></svg> {{ selectedTrip.driver?.vehicle || '-' }}</span>
            </div>
          </div>

          <!-- Rating -->
          <div class="section">
            <h3>Valoració</h3>
            <div class="rating-display">
              <div class="stars">
                <svg 
                  v-for="i in 5" 
                  :key="i"
                  class="star"
                  :class="{ filled: i <= selectedTrip.rating }"
                  viewBox="0 0 24 24"
                ><path :d="mdiStar" fill="currentColor" /></svg>
              </div>
              <span class="rating-text">{{ selectedTrip.rating }}/5</span>
            </div>
          </div>

          <!-- Incident (if any) -->
          <div v-if="selectedTrip.finalState === 'incidence' && selectedTrip.incidentReport" class="section warning">
            <h3><svg class="alert-icon" viewBox="0 0 24 24"><path :d="mdiAlert" fill="currentColor" /></svg> Incident Reportat</h3>
            <div class="incident-info">
              <p>{{ selectedTrip.incidentReport }}</p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="selectedTrip = null" class="btn btn-primary">Tancar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTripStore } from '../store/tripStore'
import { mdiStar, mdiMapMarker, mdiTarget, mdiRuler, mdiCar, mdiAlert, mdiCheck, mdiEmoticonSadOutline } from '@mdi/js'

const tripStore = useTripStore()
const selectedTrip = ref(null)
const filterStartDate = ref('')
const filterEndDate = ref('')
const filterService = ref('')
const displayedTrips = ref([])

// Get statistics
const statistics = computed(() => {
  return tripStore.getStatistics();
})

// Filtered trips
const filteredTrips = computed(() => {
  let filtered = displayedTrips.value;

  if (filterService.value) {
    filtered = filtered.filter(t => t.service === filterService.value);
  }

  return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
})

// Methods
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('ca-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const getServiceName = (service) => {
  const services = {
    cultura: 'RURAL-GO Cultura',
    familia: 'RURAL-GO Família',
    salut: 'RURAL-GO Salut',
    compres: 'RURAL-GO Serveis Comunitaris',
    natura: 'RURAL-GO Natura'
  };
  return services[service] || service;
}

const getServiceColor = (service) => {
  const colors = {
    cultura: '#FF6B6B',
    familia: '#4ECDC4',
    salut: '#45B7D1',
    compres: '#96CEB4',
    natura: '#FFEAA7'
  };
  return colors[service] || '#2c3e50';
}

const getVehicleType = (type) => {
  const types = {
    normal: 'Normal',
    assisted: 'Assistit',
    adapted: 'Adaptat'
  };
  return types[type] || type;
}

const applyFilters = () => {
  let filtered = tripStore.getTripsHistory();

  if (filterStartDate.value && filterEndDate.value) {
    const start = new Date(filterStartDate.value);
    const end = new Date(filterEndDate.value);
    end.setHours(23, 59, 59, 999);
    filtered = filtered.filter(t => {
      const tripDate = new Date(t.createdAt);
      return tripDate >= start && tripDate <= end;
    });
  }

  displayedTrips.value = filtered;
}

const clearFilters = () => {
  filterStartDate.value = '';
  filterEndDate.value = '';
  filterService.value = '';
  displayedTrips.value = tripStore.getTripsHistory();
}

const viewDetails = (trip) => {
  selectedTrip.value = trip;
}

onMounted(() => {
  displayedTrips.value = tripStore.getTripsHistory();
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: white;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

/* Filters */
.filters-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.date-input,
.select-input {
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-size: 14px;
}

.date-input:focus,
.select-input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.separator {
  padding: 0 5px;
  align-self: center;
  color: #7f8c8d;
}

.btn-filter,
.btn-clear {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-end;
}

.btn-filter {
  background: #4ECDC4;
  color: white;
}

.btn-filter:hover {
  background: #3fa99f;
  transform: translateY(-2px);
}

.btn-clear {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-clear:hover {
  background: #bdc3c7;
}

/* Statistics */
.statistics-grid {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 600;
}

.stat-value {
  color: #4ECDC4;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.stat-icon {
  width: 24px;
  height: 24px;
  color: #f39c12;
  flex-shrink: 0;
}

/* Trips List */
.trips-list {
  max-width: 1200px;
  margin: 0 auto;
}

.no-trips {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  color: #7f8c8d;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 15px;
  color: white;
}

.trip-card {
  background: white;
  border-radius: 12px;
  margin-bottom: 15px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.trip-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.trip-service {
  font-weight: 600;
  font-size: 16px;
}

.trip-date {
  color: #7f8c8d;
  font-size: 12px;
}

.trip-rating {
  color: #f39c12;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.trip-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.detail .label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.detail .value {
  color: #2c3e50;
  font-weight: 500;
  font-size: 14px;
}

.value.status {
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.value.status.ok {
  color: #27ae60;
}

.value.status.incidence {
  color: #e74c3c;
}

.trip-footer {
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
}

.btn-details {
  padding: 10px 20px;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-details:hover {
  background: #3fa99f;
  transform: translateY(-2px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-body {
  padding: 20px;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.info-item .label,
.route-info .label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.info-item .value,
.route-info .value {
  color: #2c3e50;
  font-weight: 500;
}

.route-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.route-item {
  display: flex;
  gap: 15px;
  align-items: flex-start;
}

.route-icon {
  width: 20px;
  height: 20px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.distance-info {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4ECDC4;
  display: flex;
  align-items: center;
  gap: 8px;
}

.distance-icon {
  width: 20px;
  height: 20px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.driver-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.driver-name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 16px;
}

.driver-rating,
.driver-vehicle {
  color: #7f8c8d;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.vehicle-icon {
  width: 16px;
  height: 16px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.rating-display {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stars {
  display: flex;
  gap: 5px;
}

.star {
  width: 24px;
  height: 24px;
  color: #f39c12;
  opacity: 0.3;
  flex-shrink: 0;
}

.star.filled {
  opacity: 1;
}

.rating-text {
  color: #2c3e50;
  font-weight: 600;
  font-size: 16px;
}

.section.warning {
  background: #fff3cd;
  border-left: 4px solid #f39c12;
  padding: 15px;
  border-radius: 8px;
}

.section.warning h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.alert-icon {
  width: 20px;
  height: 20px;
  color: #f39c12;
  flex-shrink: 0;
}

.incident-info p {
  color: #2c3e50;
  margin: 0;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #ecf0f1;
  display: flex;
  justify-content: flex-end;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #3fa99f;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .header h1 {
    font-size: 24px;
  }

  .filters-section {
    grid-template-columns: 1fr;
  }

  .statistics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .trip-details {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
