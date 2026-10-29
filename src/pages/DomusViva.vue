<template>
  <div class="domus-viva-container">
    <div class="page-header">
      <h1><svg class="header-icon" viewBox="0 0 24 24"><path :d="mdiTheater" fill="currentColor" /></svg> Domus Viva - Activitats Recomanades</h1>
      <p>Descobreix activitats culturals i socials adaptades a tu</p>
    </div>

    <!-- Recomanació del dia -->
    <div class="daily-rec-section">
      <h2><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> Recomanació del dia</h2>
      <div v-if="dailyRec" class="daily-rec-card">
        <div class="daily-rec-content">
          <div class="daily-rec-header">
            <h3>{{ dailyRec.name }}</h3>
            <span class="rating"><svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ dailyRec.rating }}/5</span>
          </div>
          <p class="description">{{ dailyRec.description }}</p>
          <div class="details-grid">
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiMapMarker" fill="currentColor" /></svg>
              <span>{{ dailyRec.location }}</span>
            </div>
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiClockOutline" fill="currentColor" /></svg>
              <span>{{ dailyRec.duration }}</span>
            </div>
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiCurrencyEur" fill="currentColor" /></svg>
              <span>{{ dailyRec.price === 0 ? 'Gratis' : dailyRec.price + '€' }}</span>
            </div>
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiClipboardList" fill="currentColor" /></svg>
              <span class="difficulty" :class="'diff-' + dailyRec.difficulty">{{ getDifficultyLabel(dailyRec.difficulty) }}</span>
            </div>
          </div>
          <div class="tags">
            <span v-for="tag in dailyRec.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
          <button class="btn btn-primary btn-large">Detalls</button>
        </div>
      </div>
    </div>

    <!-- Filtres -->
    <div class="filters-section">
      <h2>Filtra per categoria</h2>
      <div class="filter-buttons">
        <button 
          v-for="cat in categories"
          :key="cat.id"
          :class="['filter-btn', { active: selectedCategory === cat.id }]"
          @click="selectedCategory = cat.id; loadActivities()"
        >
          {{ cat.icon }} {{ cat.name }}
        </button>
      </div>
    </div>

    <!-- Activitats filtrades -->
    <div class="activities-section">
      <h2>{{ getCategoryTitle }}</h2>
      
      <div v-if="filteredActivities.length > 0" class="activities-grid">
        <div 
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="activity-card"
        >
          <div class="activity-header">
            <h3>{{ activity.name }}</h3>
            <div class="activity-meta">
              <span class="rating"><svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ activity.rating }}/5</span>
              <span class="difficulty" :class="'diff-' + activity.difficulty">
                {{ getDifficultyLabel(activity.difficulty) }}
              </span>
            </div>
          </div>

          <p class="description">{{ activity.description }}</p>

          <div class="activity-details">
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiMapMarker" fill="currentColor" /></svg>
              <span>{{ activity.location }}</span>
            </div>
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiClockOutline" fill="currentColor" /></svg>
              <span>{{ activity.duration }}</span>
            </div>
            <div class="detail">
              <svg class="detail-icon" viewBox="0 0 24 24"><path :d="mdiCurrencyEur" fill="currentColor" /></svg>
              <span class="price" :class="{ free: activity.price === 0 }">
                {{ activity.price === 0 ? 'Gratis' : activity.price + '€' }}
              </span>
            </div>
          </div>

          <div class="tags">
            <span v-for="tag in activity.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>

          <button class="btn btn-primary">Veure detalls</button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>No hi ha activitats disponibles en aquesta categoria</p>
      </div>
    </div>

    <!-- Activitats accessibles -->
    <div class="accessible-section">
      <h2>♿ Activitats accessibles</h2>
      <p class="section-desc">Activitats de baixa dificultats i preu assequible per a tothom</p>
      
      <div v-if="accessibleActivities.length > 0" class="activities-carousel">
        <div 
          v-for="activity in accessibleActivities.slice(0, 4)"
          :key="activity.id"
          class="carousel-card"
        >
          <div class="card-header">
            <h4>{{ activity.name }}</h4>
            <span class="rating">⭐ {{ activity.rating }}</span>
          </div>
          <p class="location">{{ activity.location }}</p>
          <p class="price">{{ activity.price === 0 ? 'Gratis' : activity.price + '€' }}</p>
          <button class="btn btn-small">Apuntar-se</button>
        </div>
      </div>
    </div>

    <!-- Personalitzades -->
    <div class="personalized-section">
      <h2><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> Recomanades per a tu</h2>
      <p class="section-desc">Basades en els teus interessos</p>
      
      <div v-if="personalizedRecs.length > 0" class="personalized-grid">
        <div 
          v-for="(activity, index) in personalizedRecs"
          :key="activity.id"
          class="personalized-card"
          :style="{ '--delay': index * 0.1 + 's' }"
        >
          <div class="position-badge">{{ index + 1 }}</div>
          <h4>{{ activity.name }}</h4>
          <div class="card-info">
            <span class="info-item">
              <svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg>
              {{ activity.rating }}/5
            </span>
            <span class="info-item">
              <svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiCurrencyEur" fill="currentColor" /></svg>
              {{ activity.price === 0 ? 'Gratis' : activity.price + '€' }}
            </span>
          </div>
          <button class="btn btn-small btn-success">Interessat</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { aiRecommender } from '../services/aiRecommender';
import { mdiTheater, mdiLeaf, mdiAccountGroup, mdiStar, mdiMapMarker, mdiClockOutline, mdiCurrencyEur, mdiClipboardList } from '@mdi/js'

// State
const selectedCategory = ref('all');
const dailyRec = ref(null);
const filteredActivities = ref([]);
const accessibleActivities = ref([]);
const personalizedRecs = ref([]);

// Categories
const categories = [
  { id: 'all', name: 'Totes les activitats', icon: '🎪' },
  { id: 'cultura', name: 'Cultura', icon: '🎭' },
  { id: 'natura', name: 'Natura', icon: '🌿' },
  { id: 'social', name: 'Social', icon: '👥' }
];

// Computed
const getCategoryTitle = computed(() => {
  if (selectedCategory.value === 'all') return 'Totes les activitats';
  const cat = categories.find(c => c.id === selectedCategory.value);
  return cat?.name || 'Activitats';
});

// Methods
const getDifficultyLabel = (diff) => {
  const labels = {
    'baix': '🟢 Baixa',
    'mig': '🟡 Mitjana',
    'alt': '🔴 Alta'
  };
  return labels[diff] || diff;
};

const loadActivities = () => {
  if (selectedCategory.value === 'all') {
    filteredActivities.value = [
      ...aiRecommender.activities.cultura,
      ...aiRecommender.activities.natura,
      ...aiRecommender.activities.social
    ].sort((a, b) => b.rating - a.rating);
  } else {
    filteredActivities.value = aiRecommender.getSuggestions(selectedCategory.value);
  }
};

onMounted(() => {
  // Cargar recomanació del dia
  dailyRec.value = aiRecommender.getDailyRecommendation();
  
  // Caregar activitats
  loadActivities();
  
  // Activitats accessibles
  accessibleActivities.value = aiRecommender.getAccessibleActivities();
  
  // Recomanacions personalitzades (simulades)
  const userProfile = {
    interests: ['cultura', 'natura'],
    difficulty: 'baix'
  };
  personalizedRecs.value = aiRecommender.getPersonalizedRecommendations(userProfile);
});
</script>

<style scoped>
.domus-viva-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 40px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  color: #667eea;
  flex-shrink: 0;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

/* Recomanació del dia */
.daily-rec-section {
  margin-bottom: 40px;
}

.daily-rec-section h2,
.filters-section h2,
.activities-section h2,
.accessible-section h2,
.personalized-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
  flex-shrink: 0;
}

.daily-rec-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  animation: slideUp 0.5s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.daily-rec-content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.daily-rec-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.daily-rec-header h3 {
  margin: 0;
  font-size: 24px;
}

.rating {
  font-weight: 600;
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
}

.description {
  margin: 0;
  opacity: 0.95;
  line-height: 1.5;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.detail {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 14px;
}

.detail-icon {
  width: 18px;
  height: 18px;
  color: white;
  flex-shrink: 0;
}

.inline-icon {
  width: 16px;
  height: 16px;
  color: inherit;
  flex-shrink: 0;
}

.difficulty {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.diff-baix {
  background: #27ae60;
  color: white;
}

.diff-mig {
  background: #f39c12;
  color: white;
}

.diff-alt {
  background: #e74c3c;
  color: white;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(255,255,255,0.2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

/* Filtres */
.filters-section {
  margin-bottom: 30px;
}

.filter-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.filter-btn {
  padding: 12px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  color: #555;
}

.filter-btn:hover {
  border-color: #4ECDC4;
  background: #f0fffe;
}

.filter-btn.active {
  background: #4ECDC4;
  color: white;
  border-color: #4ECDC4;
}

/* Activitats */
.activities-section {
  margin-bottom: 40px;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.activity-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 12px;
}

.activity-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.description {
  margin: 0;
  color: #555;
  font-size: 14px;
  line-height: 1.4;
}

.activity-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.activity-details .detail {
  display: flex;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

.icon {
  font-size: 16px;
}

.price {
  font-weight: 600;
  color: #27ae60;
}

.price.free {
  color: #27ae60;
  font-weight: 700;
}

.btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  width: 100%;
  margin-top: auto;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
}

.btn-small {
  padding: 8px;
  font-size: 12px;
  width: auto;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
}

.btn-large {
  padding: 14px;
  font-size: 16px;
}

/* Accessible */
.accessible-section {
  margin-bottom: 40px;
}

.section-desc {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.activities-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 15px;
}

.carousel-card {
  background: white;
  border: 2px solid #e8f8f6;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  transition: all 0.3s ease;
}

.carousel-card:hover {
  border-color: #4ECDC4;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 8px;
  gap: 8px;
}

.card-header h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
  text-align: left;
}

.location {
  margin: 8px 0;
  color: #7f8c8d;
  font-size: 12px;
}

.price {
  margin: 8px 0;
  color: #27ae60;
  font-weight: 700;
  font-size: 14px;
}

/* Personalizades */
.personalized-section {
  margin-bottom: 40px;
}

.personalized-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.personalized-card {
  background: white;
  border-left: 4px solid #f39c12;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  animation: fadeIn 0.5s ease;
  animation-delay: var(--delay);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.position-badge {
  position: absolute;
  top: -10px;
  right: 15px;
  background: #f39c12;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
}

.personalized-card h4 {
  margin: 8px 0;
  color: #2c3e50;
  font-size: 15px;
}

.card-info {
  display: flex;
  gap: 12px;
  margin: 10px 0;
  font-size: 12px;
  color: #555;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #95a5a6;
}

@media (max-width: 768px) {
  .details-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }

  .personalized-grid {
    grid-template-columns: 1fr;
  }
}
</style>
