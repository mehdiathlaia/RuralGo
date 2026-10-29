<template>
  <div class="client-dashboard">
    <!-- Si no hi ha viatge, mostrar formulari -->
    <div v-if="!trip" class="form-wrapper">
      <TripRequestForm />
    </div>

    <!-- Si hi ha viatge, mostrar tracking -->
    <div v-else class="trip-wrapper">
      <div class="header-section">
        <h2>Viatge en curs</h2>
        <button @click="goBack" class="btn btn-small">← Enrere</button>
      </div>

      <!-- Informació del conductor -->
      <DriverInfo />

      <!-- Mapa amb ruta -->
      <MapTracker />

      <!-- Estat del viatge -->
      <TripStatus />

      <!-- Botó d'emergència -->
      <div class="emergency-section">
        <button class="btn btn-emergency" @click="triggerEmergency">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path :d="mdiAlert" fill="currentColor" />
          </svg>
          Emergència / Soport
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/tripStore';
import { mdiCar, mdiAlert } from '@mdi/js';
import TripRequestForm from '../components/TripRequestForm.vue';
import DriverInfo from '../components/DriverInfo.vue';
import MapTracker from '../components/MapTracker.vue';
import TripStatus from '../components/TripStatus.vue';

const router = useRouter();
const store = useTripStore();

const trip = computed(() => store.trip);

const goBack = () => {
  // Cancelar viatge
  store.cancelTrip();
  router.push('/planification');
};

const triggerEmergency = () => {
  alert('Soport d\'emergència contactat!\nUn agent estarà con tigo en breus moments.');
  // Aquí s'integraria amb servei real d'emergència
};
</script>

<style scoped>
.client-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.form-wrapper {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.trip-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.header-section h2 {
  margin: 0;
  color: #2c3e50;
}

.emergency-section {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-small {
  padding: 8px 15px;
  font-size: 14px;
  background: #95a5a6;
  color: white;
}

.btn-small:hover {
  background: #7f8c8d;
}

.btn-emergency {
  padding: 15px 30px;
  font-size: 16px;
  background: #e74c3c;
  color: white;
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.btn-emergency:hover {
  background: #c0392b;
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(231, 76, 60, 0.4);
}

@media (max-width: 768px) {
  .client-dashboard {
    padding: 10px;
  }

  .header-section {
    flex-direction: column;
    gap: 10px;
  }

  .header-section h2 {
    font-size: 18px;
  }
}
</style>
