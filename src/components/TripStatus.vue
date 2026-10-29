<template>
  <div v-if="trip" class="trip-status-container">
    <div class="status-card">
      <h3>📍 Estat del Viatge</h3>
      
      <!-- Timeline de l'estat -->
      <div class="status-timeline">
        <div class="timeline-item" :class="{ active: statusCheck('waiting-driver') }">
          <div class="timeline-dot">⏳</div>
          <div class="timeline-text">
            <p class="timeline-label">Cercant Conductor</p>
            <p class="timeline-time" v-if="statusCheck('waiting-driver')">Buscant el conductor més apropiat...</p>
          </div>
        </div>

        <div class="timeline-item" :class="{ active: statusCheck('driver-assigned') }">
          <div class="timeline-dot">✓</div>
          <div class="timeline-text">
            <p class="timeline-label">Conductor Assignat</p>
            <p class="timeline-time" v-if="statusCheck('driver-assigned')">{{ trip.driver?.name || 'Assignant...' }}</p>
          </div>
        </div>

        <div class="timeline-item" :class="{ active: statusCheck('in-progress') }">
          <div class="timeline-dot">-</div>
          <div class="timeline-text">
            <p class="timeline-label">En Ruta</p>
            <p class="timeline-time" v-if="statusCheck('in-progress')">
              {{ trip.remainingKm?.toFixed(1) }} km restants
            </p>
          </div>
        </div>

        <div class="timeline-item" :class="{ active: statusCheck('arrived') }">
          <div class="timeline-dot">🎉</div>
          <div class="timeline-text">
            <p class="timeline-label">Arribat</p>
            <p class="timeline-time" v-if="statusCheck('arrived')">Ja has arribat!</p>
          </div>
        </div>

        <div class="timeline-item" :class="{ active: statusCheck('completed') }">
          <div class="timeline-dot">⭐</div>
          <div class="timeline-text">
            <p class="timeline-label">Completat</p>
            <p class="timeline-time" v-if="statusCheck('completed')">Viatge finalitzat</p>
          </div>
        </div>
      </div>

      <!-- Informació d'estimat -->
      <div v-if="!statusCheck('completed')" class="info-section">
        <div class="info-item">
          <span class="label">Temps estimat:</span>
          <span class="value">{{ trip.estimatedTime }} minuts</span>
        </div>
        <div v-if="trip.driver" class="info-item">
          <span class="label">Conductor:</span>
          <span class="value">{{ trip.driver.name }}</span>
        </div>
        <div v-if="trip.driver" class="info-item">
          <span class="label">⭐ Valoració conductor:</span>
          <span class="value">{{ trip.driver.rating }}/5</span>
        </div>
      </div>

      <!-- Accions finals quan arribi -->
      <div v-if="statusCheck('arrived') || statusCheck('completed')" class="final-actions">
        <button v-if="statusCheck('arrived')" @click="finishTrip('ok')" class="btn btn-success">
          ✓ Viatge Completat - Tot OK
        </button>
        <button v-if="statusCheck('arrived')" @click="finishTrip('incidence')" class="btn btn-warning">
          Incidència Detectada
        </button>
        <button v-if="statusCheck('completed')" @click="goToRating" class="btn btn-primary">
          ⭐ Valorar Viatge
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/tripStore';

const router = useRouter();
const store = useTripStore();

const trip = computed(() => store.trip);

const statusCheck = (status) => {
  return trip.value?.status === status;
};

const finishTrip = (finalState) => {
  store.completeTrip(finalState);
};

const goToRating = () => {
  router.push('/rating');
};
</script>

<style scoped>
.trip-status-container {
  margin: 20px 0;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.status-card h3 {
  margin-top: 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 20px 0;
}

.timeline-item {
  display: flex;
  gap: 15px;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  border-left: 3px solid #ddd;
}

.timeline-item.active {
  background: #f0f8f7;
  border-left-color: #4ECDC4;
}

.timeline-dot {
  font-size: 24px;
  min-width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-text {
  flex: 1;
}

.timeline-label {
  margin: 0;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.timeline-time {
  margin: 5px 0 0 0;
  color: #7f8c8d;
  font-size: 12px;
}

.info-section {
  background: #f0f8f7;
  padding: 15px;
  border-radius: 8px;
  margin: 15px 0;
  display: grid;
  gap: 10px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.value {
  color: #555;
  font-size: 14px;
}

.final-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.btn {
  flex: 1;
  min-width: 150px;
  padding: 12px 15px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-2px);
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .final-actions {
    flex-direction: column;
  }

  .btn {
    min-width: auto;
  }
}
</style>
