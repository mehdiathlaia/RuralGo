<template>
  <div class="rating-form-container">
    <div class="modal-overlay" v-if="showModal" @click="closeModal"></div>
    
    <div class="form-card" v-if="showModal">
      <button class="close-btn" @click="closeModal">✕</button>
      
      <div class="form-header">
        <h2>Valoració del viatge</h2>
        <p class="trip-info">
          {{ tripInfo.pickupAddress }} → {{ tripInfo.destinationAddress }}
        </p>
      </div>

      <!-- Fase 1: Valoració del conductor -->
      <div v-if="phase === 1" class="rating-phase">
        <h3>Com ha anat el viatge amb {{ tripInfo.driverName }}?</h3>
        
        <div class="rating-display">
          <p class="rating-label">Puntuació:</p>
          <div class="star-rating">
            <button 
              v-for="star in 5" 
              :key="star"
              :class="['star', { filled: star <= rating }]"
              @click="rating = star"
            >
              ⭐
            </button>
          </div>
          <span class="rating-value">{{ rating }}/5</span>
        </div>

        <!-- Tags de la valoració -->
        <div class="tags-section">
          <p class="section-title">Que ha estat molt bo?</p>
          <div class="tags-grid">
            <button 
              v-for="tag in availableTags" 
              :key="tag"
              :class="['tag-btn', { selected: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ getTagIcon(tag) }} {{ getTagLabel(tag) }}
            </button>
          </div>
        </div>

        <!-- Comentari -->
        <div class="comment-section">
          <label>Comentari (opcional)</label>
          <textarea 
            v-model="comment" 
            placeholder="Comenta sobre la teva experiència..."
            class="comment-input"
            maxlength="500"
          ></textarea>
          <span class="char-count">{{ comment.length }}/500</span>
        </div>

        <button @click="submitPhase1" class="btn btn-primary btn-large">
          Continuar
        </button>
      </div>

      <!-- Fase 2: Driver valora al client (opcional) -->
      <div v-if="phase === 2 && showDriverReview" class="rating-phase">
        <h3>El conductor {{ tripInfo.driverName }} vol valorar-te</h3>
        <p class="optional-note">Opcional - El conductor pot deixar una valoració</p>

        <div class="driver-pending">
          <p>⏳ Esperant valoració del conductor...</p>
          <p class="small-text">Rebràs una notificació quan el conductor hagi valorat</p>
        </div>

        <button @click="finishRating" class="btn btn-success btn-large">
          Finalitzar
        </button>
      </div>

      <!-- Fase 2: Direct finish si no hi ha driver review -->
      <div v-if="phase === 2 && !showDriverReview" class="rating-phase">
        <div class="success-message">
          <h3>✅ Valoració completada!</h3>
          <p>Gràcies per valorar el viatge</p>
        </div>

        <button @click="finishRating" class="btn btn-success btn-large">
          Tancar
        </button>
      </div>
    </div>

    <!-- Boto flotant si no hi ha modal obert -->
    <button v-if="!showModal && hasPendingRating" @click="openModal" class="floating-btn">
      ⭐ Valorar viatge
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRatingStore } from '../store/ratingStore';

const props = defineProps({
  tripId: String,
  driverId: String,
  clientId: String,
  tripInfo: {
    type: Object,
    default: () => ({
      driverName: 'Conductor',
      pickupAddress: 'Origen',
      destinationAddress: 'Destinació'
    })
  },
  onComplete: {
    type: Function,
    default: () => {}
  }
});

const ratingStore = useRatingStore();

// State
const showModal = ref(false);
const phase = ref(1); // Fase 1: valorar conductor, Fase 2: mostrar resultado
const rating = ref(0);
const selectedTags = ref([]);
const comment = ref('');
const showDriverReview = ref(true);

// Tags disponibles
const availableTags = ['puntualidad', 'seguridad', 'amabilidad', 'limpieza', 'comodidad'];

// Computed
const hasPendingRating = computed(() => {
  return ratingStore.getPendingRatingForTrip(props.tripId) !== undefined;
});

// Methods
const openModal = () => {
  showModal.value = true;
  phase.value = 1;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  rating.value = 0;
  selectedTags.value = [];
  comment.value = '';
  phase.value = 1;
};

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const getTagIcon = (tag) => {
  const icons = {
    puntualidad: '⧖',
    seguridad: '🛡️',
    amabilidad: '♥',
    limpieza: '✨',
    comodidad: '◐'
  };
  return icons[tag] || '✓';
};

const getTagLabel = (tag) => {
  const labels = {
    puntualidad: 'Puntualitat',
    seguridad: 'Seguretat',
    amabilidad: 'Amabilitat',
    limpieza: 'Neteja',
    comodidad: 'Comoditat'
  };
  return labels[tag] || tag;
};

const submitPhase1 = () => {
  // Guardar valoració
  ratingStore.submitRating(
    props.tripId,
    props.driverId,
    props.clientId,
    rating.value,
    comment.value,
    selectedTags.value
  );

  // Passar a fase 2
  phase.value = 2;
};

const finishRating = () => {
  props.onComplete?.();
  closeModal();
};
</script>

<style scoped>
.rating-form-container {
  position: relative;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
}

.form-card {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 30px 20px;
  max-height: 90vh;
  overflow-y: auto;
  z-index: 1000;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f0f0f0;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #e0e0e0;
  transform: rotate(90deg);
}

.form-header {
  margin-bottom: 25px;
  text-align: center;
}

.form-header h2 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 24px;
}

.trip-info {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.rating-phase {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rating-phase h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.rating-display {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.rating-label {
  margin: 0 0 15px 0;
  color: #7f8c8d;
  font-weight: 600;
}

.star-rating {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 15px;
}

.star {
  background: none;
  border: none;
  font-size: 40px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.4;
}

.star:hover,
.star.filled {
  opacity: 1;
  transform: scale(1.1);
}

.rating-value {
  font-size: 24px;
  font-weight: bold;
  color: #f39c12;
}

.tags-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.tags-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tag-btn {
  padding: 12px;
  background: #f0f0f0;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.tag-btn:hover {
  border-color: #4ECDC4;
  background: #f0fffe;
}

.tag-btn.selected {
  background: #4ECDC4;
  color: white;
  border-color: #4ECDC4;
}

.comment-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comment-section label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.comment-input {
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.3s ease;
}

.comment-input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.char-count {
  font-size: 12px;
  color: #95a5a6;
  text-align: right;
}

.driver-pending {
  background: #f8f9fa;
  border-left: 4px solid #f39c12;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}

.driver-pending p {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.small-text {
  margin-top: 8px !important;
  font-size: 12px;
  color: #7f8c8d;
  font-weight: normal !important;
}

.success-message {
  background: linear-gradient(135deg, #27ae60, #229954);
  color: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.success-message h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.success-message p {
  margin: 0;
  opacity: 0.9;
}

.btn {
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.3);
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.btn-large {
  padding: 16px;
  font-size: 18px;
}

.floating-btn {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 50px;
  padding: 16px 24px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
  transition: all 0.3s ease;
  z-index: 100;
}

.floating-btn:hover {
  background: #e67e22;
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(243, 156, 18, 0.4);
}

.optional-note {
  color: #7f8c8d;
  font-size: 12px;
  margin: 0;
}

@media (max-width: 768px) {
  .form-card {
    padding: 20px 16px;
  }

  .tags-grid {
    grid-template-columns: 1fr;
  }

  .star {
    font-size: 32px;
  }

  .floating-btn {
    bottom: 20px;
    right: 20px;
    padding: 12px 20px;
  }
}
</style>
