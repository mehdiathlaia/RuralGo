<template>
  <div class="ratings-container">
    <div class="page-header">
      <h1>Valoracions i ressenyes</h1>
      <p>Veu les valoracions rebudes dels teus viatges</p>
    </div>

    <!-- Estadístiques globals -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ stats.averageRating }}</div>
        <div class="stat-label">Valoració mitjana</div>
        <div class="stars">
          <span v-for="i in 5" :key="i" :class="['star-icon', { filled: i <= Math.round(stats.averageRating) }]">
            <svg class="star-svg" viewBox="0 0 24 24">
              <path :d="mdiStar" fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.totalReviews }}</div>
        <div class="stat-label">Ressenyes totals</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ stats.ratingDistribution[5] }}</div>
        <div class="stat-label">Valoracions de 5 ⭐</div>
      </div>

      <div class="stat-card">
        <div class="stat-value">{{ getMostUsedTag }}</div>
        <div class="stat-label">Aspecte més valorat</div>
      </div>
    </div>

    <!-- Gràfic de distribució -->
    <div class="distribution-card">
      <h2>Distribució de valoracions</h2>
      <div class="distribution-bars">
        <div 
          v-for="stars in [5, 4, 3, 2, 1]" 
          :key="stars"
          class="bar-row"
        >
          <span class="stars-label">{{ stars }} ⭐</span>
          <div class="bar-container">
            <div 
              class="bar" 
              :style="{ width: getBarWidth(stats.ratingDistribution[stars]) + '%' }"
            ></div>
          </div>
          <span class="count">{{ stats.ratingDistribution[stars] }}</span>
        </div>
      </div>
    </div>

    <!-- Tags més comuns -->
    <div class="tags-card">
      <h2>Punts forts segons els clients</h2>
      <div class="tags-list">
        <div 
          v-for="item in stats.mostCommonTags" 
          :key="item.tag"
          class="tag-item"
        >
          <span class="tag-icon">{{ getTagIcon(item.tag) }}</span>
          <span class="tag-name">{{ getTagLabel(item.tag) }}</span>
          <span class="tag-count">{{ item.count }}</span>
        </div>
        <p v-if="stats.mostCommonTags.length === 0" class="empty-state">
          Encara no hi ha valoracions
        </p>
      </div>
    </div>

    <!-- Ressenyes recents -->
    <div class="reviews-card">
      <h2>Ressenyes recents</h2>
      
      <div v-if="stats.recentReviews.length > 0" class="reviews-list">
        <div 
          v-for="review in stats.recentReviews" 
          :key="review.id"
          class="review-item"
        >
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">{{ review.clientName.charAt(0) }}</div>
              <div class="reviewer-details">
                <h4>{{ review.clientName }}</h4>
                <p class="review-date">{{ formatDate(review.date) }}</p>
              </div>
            </div>
            <div class="review-rating">
              <span 
                v-for="i in 5" 
                :key="i"
                :class="['star', { filled: i <= review.rating }]"
              >
                <svg class="star-svg" viewBox="0 0 24 24">
                  <path :d="mdiStar" fill="currentColor" />
                </svg>
              </span>
            </div>
          </div>

          <div class="review-body">
            <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
            <div v-if="review.tags.length > 0" class="review-tags">
              <span 
                v-for="tag in review.tags"
                :key="tag"
                class="review-tag"
              >
                {{ getTagIcon(tag) }} {{ getTagLabel(tag) }}
              </span>
            </div>
          </div>

          <!-- Driver counter-review (si existeix) -->
          <div v-if="review.driverRating" class="driver-counter-review">
            <h5>Resposta del conductor</h5>
            <p v-if="review.driverComment" class="driver-comment">
              {{ review.driverComment }}
            </p>
            <div class="driver-rating">
              <span 
                v-for="i in 5" 
                :key="i"
                :class="['star', { filled: i <= review.driverRating }]"
              >
                <svg class="star-svg" viewBox="0 0 24 24">
                  <path :d="mdiStar" fill="currentColor" />
                </svg>
              </span>
              <span class="driver-label">El conductor et va valorar amb {{ review.driverRating }} ⭐</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Encara no hi ha ressenyes</p>
      </div>
    </div>

    <!-- Pendents de valorar -->
    <div v-if="pendingRatings.length > 0" class="pending-card">
      <h2>⏳ Viatges per valorar</h2>
      <div class="pending-list">
        <div 
          v-for="pending in pendingRatings"
          :key="pending.tripId"
          class="pending-item"
        >
          <div class="pending-info">
            <p class="pending-driver">{{ pending.driverName }}</p>
            <p class="pending-route">📍 {{ pending.pickupAddress }} → {{ pending.destinationAddress }}</p>
            <p class="pending-date">{{ formatDate(pending.tripDate) }}</p>
          </div>
          <button @click="openRating(pending)" class="btn btn-primary">
            Valorar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRatingStore } from '../store/ratingStore';
import { mdiStar, mdiChartBar } from '@mdi/js';

const ratingStore = useRatingStore();

const stats = ref({
  averageRating: 0,
  totalReviews: 0,
  ratingDistribution: {},
  mostCommonTags: [],
  recentReviews: []
});

const pendingRatings = ref([]);

onMounted(() => {
  stats.value = ratingStore.getDetailedStats();
  pendingRatings.value = ratingStore.pendingRatings;
});

const getMostUsedTag = computed(() => {
  if (stats.value.mostCommonTags.length === 0) return '---';
  return getTagLabel(stats.value.mostCommonTags[0].tag);
});

const getBarWidth = (count) => {
  const maxCount = Math.max(...Object.values(stats.value.ratingDistribution));
  return maxCount === 0 ? 0 : (count / maxCount) * 100;
};

const getTagIcon = (tag) => {
  const icons = {
    puntualidad: '⏰',
    seguridad: '🛡️',
    amabilidad: '😊',
    limpieza: '🧹',
    comodidad: '🪑'
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

const formatDate = (date) => {
  if (!date) return '---';
  const d = new Date(date);
  return d.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' });
};

const openRating = (pending) => {
  console.log('Obrir formulari de valoració per:', pending.tripId);
  // Aquí s'obriria el component RatingForm
};
</script>

<style scoped>
.ratings-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 28px;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

/* Estadístiques */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #4ECDC4;
  margin-bottom: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  justify-content: center;
  gap: 2px;
}

.star-icon {
  opacity: 0.3;
  display: inline-flex;
  align-items: center;
}

.star-svg {
  width: 16px;
  height: 16px;
  color: #f39c12;
}

.star-icon.filled {
  opacity: 1;
  animation: popIn 0.3s ease;
}

.star {
  opacity: 0.3;
  display: inline-flex;
  align-items: center;
  margin: 0 2px;
}

.star-svg {
  width: 16px;
  height: 16px;
  color: #f39c12;
}

.star.filled {
  opacity: 1;
  animation: popIn 0.3s ease;
}

@keyframes popIn {
  0% { transform: scale(0.8); }
  100% { transform: scale(1); }
}

/* Distribució */
.distribution-card,
.tags-card,
.reviews-card,
.pending-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.distribution-card h2,
.tags-card h2,
.reviews-card h2,
.pending-card h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
}

.distribution-bars {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stars-label {
  width: 50px;
  font-weight: 600;
  color: #2c3e50;
}

.bar-container {
  flex: 1;
  height: 25px;
  background: #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  transition: width 0.5s ease;
}

.count {
  width: 40px;
  text-align: right;
  font-weight: 600;
  color: #555;
}

/* Tags */
.tags-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
}

.tag-item {
  background: linear-gradient(135deg, #f8f9fa, #f0f0f0);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  border-left: 4px solid #4ECDC4;
}

.tag-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.tag-name {
  display: block;
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 5px;
}

.tag-count {
  display: inline-block;
  background: #4ECDC4;
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

/* Ressenyes */
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #f9f9f9;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 15px;
  gap: 15px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: start;
}

.reviewer-avatar {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #4ECDC4, #44A08D);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.reviewer-details h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
}

.review-date {
  margin: 4px 0 0 0;
  color: #95a5a6;
  font-size: 12px;
}

.review-rating {
  display: flex;
  gap: 2px;
}

.review-rating .star {
  opacity: 0.3;
  font-size: 16px;
}

.review-rating .star.filled {
  opacity: 1;
  color: #f39c12;
}

.review-body {
  margin-bottom: 15px;
}

.review-comment {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.5;
  font-size: 14px;
}

.review-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.review-tag {
  background: #e8f8f6;
  color: #4ECDC4;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.driver-counter-review {
  background: #fffef0;
  border-left: 4px solid #f39c12;
  padding: 12px;
  border-radius: 6px;
  margin-top: 15px;
}

.driver-counter-review h5 {
  margin: 0 0 8px 0;
  color: #e67e22;
  font-size: 12px;
  font-weight: 700;
}

.driver-comment {
  margin: 0 0 10px 0;
  color: #555;
  font-size: 13px;
}

.driver-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.driver-rating .star {
  opacity: 0.3;
  font-size: 14px;
}

.driver-rating .star.filled {
  opacity: 1;
  color: #f39c12;
}

.driver-label {
  font-size: 12px;
  color: #555;
  font-weight: 600;
}

/* Pendent */
.pending-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pending-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f0fffe;
  border-left: 4px solid #f39c12;
  border-radius: 6px;
}

.pending-info {
  flex: 1;
}

.pending-driver {
  margin: 0 0 4px 0;
  color: #2c3e50;
  font-weight: 600;
}

.pending-route {
  margin: 0 0 4px 0;
  color: #7f8c8d;
  font-size: 13px;
}

.pending-date {
  margin: 0;
  color: #95a5a6;
  font-size: 12px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-primary {
  background: #f39c12;
  color: white;
}

.btn-primary:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.empty-state {
  text-align: center;
  color: #95a5a6;
  padding: 30px;
  font-style: italic;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }

  .tags-list {
    grid-template-columns: 1fr;
  }

  .pending-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .review-header {
    flex-direction: column;
  }
}
</style>
