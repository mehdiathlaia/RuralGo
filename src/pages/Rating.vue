<template>
  <div class="rating-container">
    <div class="rating-card">
      <h2>⭐ Valoració del Viatge</h2>

      <div v-if="trip" class="trip-info">
        <div class="info-row">
          <span class="label">Conductor:</span>
          <span class="value">{{ trip.driver?.name }}</span>
        </div>
        <div class="info-row">
          <span class="label">Vehicle:</span>
          <span class="value">{{ trip.driver?.vehicle }}</span>
        </div>
        <div class="info-row">
          <span class="label">Durada:</span>
          <span class="value">{{ calculateDuration() }}</span>
        </div>
      </div>

      <!-- Puntuació amb estreles -->
      <div class="rating-section">
        <p class="rating-label">Com ha anat el viatge?</p>
        <div class="stars">
          <button 
            v-for="star in 5"
            :key="star"
            @click="rating = star"
            class="star"
            :class="{ active: star <= rating }"
          >
            ⭐
          </button>
        </div>
        <p v-if="rating" class="rating-text">
          {{ getRatingText(rating) }}
        </p>
      </div>

      <!-- Categories de valoració -->
      <div class="categories-section">
        <p class="rating-label">Valoracions específiques</p>
        <div class="category-item">
          <span class="category-name">🧹 Neteja</span>
          <div class="category-stars">
            <button 
              v-for="star in 5"
              :key="star"
              @click="categories.cleanliness = star"
              class="small-star"
              :class="{ active: star <= categories.cleanliness }"
            >
              ⭐
            </button>
          </div>
        </div>

        <div class="category-item">
          <span class="category-name">🛡️ Seguretat</span>
          <div class="category-stars">
            <button 
              v-for="star in 5"
              :key="star"
              @click="categories.safety = star"
              class="small-star"
              :class="{ active: star <= categories.safety }"
            >
              ⭐
            </button>
          </div>
        </div>

        <div class="category-item">
          <span class="category-name">😊 Amabilitat</span>
          <div class="category-stars">
            <button 
              v-for="star in 5"
              :key="star"
              @click="categories.kindness = star"
              class="small-star"
              :class="{ active: star <= categories.kindness }"
            >
              ⭐
            </button>
          </div>
        </div>

        <div class="category-item">
          <span class="category-name">⏱️ Puntualitat</span>
          <div class="category-stars">
            <button 
              v-for="star in 5"
              :key="star"
              @click="categories.punctuality = star"
              class="small-star"
              :class="{ active: star <= categories.punctuality }"
            >
              ⭐
            </button>
          </div>
        </div>
      </div>

      <!-- Comentaris -->
      <div class="comments-section">
        <label for="comments" class="rating-label">💬 Comentaris (opcional)</label>
        <textarea 
          id="comments"
          v-model="comments"
          placeholder="Comparteix la teva experiència..."
          rows="4"
          class="comments-input"
        ></textarea>
      </div>

      <!-- Botons d'acció -->
      <div class="actions">
        <button @click="submitRating" class="btn btn-primary" :disabled="!rating">
          ✓ Enviar Valoració
        </button>
        <button @click="skip" class="btn btn-secondary">
          Saltar
        </button>
      </div>
    </div>

    <!-- Confirmació d'enviament -->
    <div v-if="submitted" class="success-message">
      <div class="success-icon">✓</div>
      <p>Gràcies per la teva valoració!</p>
      <p>Redirigint al menú principal...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTripStore } from '../store/tripStore';

const router = useRouter();
const store = useTripStore();

const trip = computed(() => store.trip);
const rating = ref(0);
const comments = ref('');
const submitted = ref(false);
const categories = ref({
  cleanliness: 0,
  safety: 0,
  kindness: 0,
  punctuality: 0
});

const getRatingText = (value) => {
  const texts = {
    1: '❌ Molt dolent',
    2: '😞 Dolent',
    3: '😐 Acceptable',
    4: '😊 Bo',
    5: '😍 Excel·lent!'
  };
  return texts[value] || '';
};

const calculateDuration = () => {
  if (trip.value?.startTime && trip.value?.endTime) {
    const minutes = Math.round((trip.value.endTime - trip.value.startTime) / 60000);
    return `${minutes} minuts`;
  }
  return 'N/A';
};

const submitRating = () => {
  if (!rating.value) {
    alert('Si us plau, selecciona una valoració');
    return;
  }

  // Guardar valoració al store
  store.rateTrip(rating.value);

  submitted.value = true;

  // Redirigir al home après 2 segons
  setTimeout(() => {
    store.cancelTrip();
    router.push('/');
  }, 2000);
};

const skip = () => {
  router.push('/');
};

onMounted(() => {
  if (!trip.value) {
    router.push('/');
  }
});
</script>

<style scoped>
.rating-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.rating-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.rating-card h2 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

.trip-info {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 30px;
  border-left: 4px solid #4ECDC4;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.info-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #2c3e50;
}

.value {
  color: #555;
}

.rating-section {
  text-align: center;
  margin-bottom: 30px;
}

.rating-label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 16px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
}

.star {
  font-size: 40px;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
  opacity: 0.3;
}

.star:hover {
  transform: scale(1.1);
  opacity: 0.6;
}

.star.active {
  opacity: 1;
  transform: scale(1.2);
}

.rating-text {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.categories-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
}

.category-stars {
  display: flex;
  gap: 5px;
}

.small-star {
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.3;
  transition: transform 0.2s;
}

.small-star:hover {
  transform: scale(1.1);
  opacity: 0.6;
}

.small-star.active {
  opacity: 1;
  transform: scale(1.15);
}

.comments-section {
  margin-bottom: 30px;
}

.comments-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.3s;
  resize: vertical;
}

.comments-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  flex: 1;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #c9c9c9;
}

.success-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  z-index: 1000;
}

.success-icon {
  font-size: 48px;
  color: #27ae60;
  margin-bottom: 15px;
}

.success-message p {
  margin: 10px 0;
  color: #555;
}

@media (max-width: 768px) {
  .rating-card {
    padding: 20px;
  }

  .star {
    font-size: 32px;
  }

  .small-star {
    font-size: 20px;
  }

  .actions {
    flex-direction: column;
  }
}
</style>
