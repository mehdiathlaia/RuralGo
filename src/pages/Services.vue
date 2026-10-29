<template>
  <div class="services-page">
    <div class="header">
      <h1><svg class="title-icon" viewBox="0 0 24 24"><path :d="mdiTarget" fill="currentColor" /></svg> Serveis RURAL-GO VIVA</h1>
      <p>Descobreix tots els serveis disponibles a la plataforma</p>
    </div>

    <!-- Filtre -->
    <div class="filter-section">
      <button 
        v-for="category in categories"
        :key="category"
        @click="selectedCategory = category"
        :class="['filter-btn', { active: selectedCategory === category }]"
      >
        {{ category }}
      </button>
    </div>

    <!-- Serveis Grid -->
    <div class="services-grid">
      <div 
        v-for="service in filteredServices"
        :key="service.id"
        class="service-card"
        @click="selectedService = service"
      >
        <div class="service-header">
          <span class="icon">{{ service.icon }}</span>
          <h3>{{ service.name }}</h3>
        </div>
        <p class="service-description">{{ service.description }}</p>
        <div class="service-info">
          <span class="price">{{ service.baseFare }}€</span>
          <span class="rating"><svg class="star-svg" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> {{ service.rating }}/5</span>
        </div>
      </div>
    </div>

    <!-- Service Detail Modal -->
    <div v-if="selectedService" class="modal-overlay" @click.self="selectedService = null">
      <div class="modal-content">
        <div class="modal-header">
          <button class="close-btn" @click="selectedService = null">✕</button>
        </div>

        <div class="modal-body">
          <div class="service-detail-header">
            <span class="icon">{{ selectedService.icon }}</span>
            <h2>{{ selectedService.name }}</h2>
          </div>

          <div class="detail-section">
            <h3>Descripció</h3>
            <p>{{ selectedService.description }}</p>
          </div>

          <div class="detail-section">
            <h3>Casos d'Ús</h3>
            <ul class="use-cases">
              <li v-for="(useCase, idx) in selectedService.useCases" :key="idx">
                <svg class="check-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg> {{ useCase }}
              </li>
            </ul>
          </div>

          <div class="detail-section">
            <h3>Informació de Preus</h3>
            <div class="pricing-info">
              <div class="price-item">
                <span class="label">Tarifa Base:</span>
                <span class="value">€{{ selectedService.baseFare }}</span>
              </div>
              <div class="price-item">
                <span class="label">Per km:</span>
                <span class="value">€{{ selectedService.pricePerKm }}</span>
              </div>
              <div class="price-item">
                <span class="label">Durada Mínima:</span>
                <span class="value">{{ selectedService.minDuration }} min</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Característiques</h3>
            <div class="features">
              <div v-for="feature in selectedService.features" :key="feature" class="feature-tag">
                {{ feature }}
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Disponibilitat</h3>
            <div class="availability">
              <div class="avail-item">
                <span class="label">Horari:</span>
                <span class="value">{{ selectedService.availability.hours }}</span>
              </div>
              <div class="avail-item">
                <span class="label">Zones:</span>
                <span class="value">{{ selectedService.availability.zones }}</span>
              </div>
              <div class="avail-item">
                <span class="label">Temps Resposta:</span>
                <span class="value">{{ selectedService.availability.responseTime }}</span>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <h3>Valoració de Clients</h3>
            <div class="rating-display">
              <div class="stars">
                <svg v-for="i in 5" :key="i" class="star" :class="{ filled: i <= Math.round(selectedService.rating) }" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg>
              </div>
              <span class="rating-text">{{ selectedService.rating }}/5 ({{ selectedService.reviews }} valoracions)</span>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="selectedService = null" class="btn btn-secondary">
              Tancar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTripStore } from '../store/tripStore'
import { mdiStar, mdiCheck, mdiPhone, mdiTarget } from '@mdi/js'

const router = useRouter()
const tripStore = useTripStore()

const selectedService = ref(null)
const selectedCategory = ref('Tots')

const categories = ['Tots', 'Cultura', 'Família', 'Salut', 'Serveis Comunitaris', 'Natura', 'Urgència']

const services = [
  {
    id: 'cultura',
    name: 'RURAL-GO Cultura',
    icon: '🎭',
    category: 'Cultura',
    description: 'Transport a teatres, cines, museus, concerts i events culturals amb recomanacions de IA.',
    baseFare: 3.50,
    pricePerKm: 0.85,
    minDuration: 15,
    rating: 4.8,
    reviews: 342,
    useCases: [
      'Viatges a teatres i concerts',
      'Accés a museus i exposicions',
      'Cines i events culturals',
      'Tours turístics guiats'
    ],
    features: ['Recomanacions IA', 'Descomptes d\'entrada', 'Tours guiats', 'Itineraris culturals'],
    availability: {
      hours: '8:00 - 23:00',
      zones: 'Totes les zones',
      responseTime: '5-10 minuts'
    }
  },
  {
    id: 'familia',
    name: 'RURAL-GO Família',
    icon: '👨‍👩‍👧',
    category: 'Família',
    description: 'Viatges per celebracions familiars, visites a familiars i dinars grups.',
    baseFare: 3.50,
    pricePerKm: 0.85,
    minDuration: 15,
    rating: 4.9,
    reviews: 425,
    useCases: [
      'Visites a familiars',
      'Celebracions i dinars',
      'Recollida d\'abuels',
      'Dinars grups organitzats'
    ],
    features: ['Grup fins 8 pers', 'Acceso facil', 'Fotos gratis', 'Recuerdos'],
    availability: {
      hours: '7:00 - 22:00',
      zones: 'Totes les zones',
      responseTime: '10-15 minuts'
    }
  },
  {
    id: 'salut',
    name: 'RURAL-GO Salut',
    icon: '🏥',
    category: 'Salut',
    description: 'Transport a centres sanitaris, farmàcies, óptica i cites mèdiques.',
    baseFare: 2.50,
    pricePerKm: 0.75,
    minDuration: 20,
    rating: 4.9,
    reviews: 512,
    useCases: [
      'Cites mèdiques',
      'Viatges a hospitals',
      'Farmàcia i óptica',
      'Análisis clínics'
    ],
    features: ['Prioritat', 'Acompanyant gratis', 'Recollida a domicili', 'Suport 24/7'],
    availability: {
      hours: '6:00 - 20:00',
      zones: 'Totes les zones',
      responseTime: '5 minuts'
    }
  },
  {
    id: 'compres',
    name: 'RURAL-GO Serveis Comunitaris',
    icon: '🛒',
    category: 'Serveis Comunitaris',
    description: 'Anar de compres, activitats comunitàries, voluntariat i serveis locals.',
    baseFare: 2.00,
    pricePerKm: 0.50,
    minDuration: 30,
    rating: 4.7,
    reviews: 198,
    useCases: [
      'Anar de compres al centre comercial',
      'Compres a supermercats i botigues',
      'Activitats comunitàries locals',
      'Ajuda amb bosses i carrega'
    ],
    features: ['Ajuda carrega', 'Flex horari', 'Suport compres', 'Flexible'],
    availability: {
      hours: '8:00 - 19:00',
      zones: 'Totes les zones',
      responseTime: '10 minuts'
    }
  },
  {
    id: 'natura',
    name: 'RURAL-GO Natura',
    icon: '🌲',
    category: 'Natura',
    description: 'Passejos naturals, senderisme i activitats de benestar amb experts.',
    baseFare: 3.50,
    pricePerKm: 0.85,
    minDuration: 45,
    rating: 4.6,
    reviews: 287,
    useCases: [
      'Passejos per parcs',
      'Senderisme guiat',
      'Activitats benestar',
      'Yoga i meditació'
    ],
    features: ['Guia expert', 'Equip inclòs', 'Fotos natura', 'Snacks'],
    availability: {
      hours: '8:00 - 18:00',
      zones: 'Zones amb natura',
      responseTime: '15 minuts'
    }
  },
  {
    id: 'urgencia',
    name: 'RURAL-GO Urgència',
    icon: '🚨',
    category: 'Urgència',
    description: 'Mode emergència amb prioritat màxima i vehicle més proper.',
    baseFare: 5.00,
    pricePerKm: 1.20,
    minDuration: 10,
    rating: 4.95,
    reviews: 89,
    useCases: [
      'Emergències sanitàries',
      'Urgències socials',
      'Transport prioritari',
      'Situacions greus'
    ],
    features: ['Prioritat', 'Vehicle més proper', 'SOS 24/7', 'Suport continu'],
    availability: {
      hours: '24/7',
      zones: 'Totes les zones',
      responseTime: '3 minuts'
    }
  }
]

const filteredServices = computed(() => {
  if (selectedCategory.value === 'Tots') {
    return services
  }
  return services.filter(s => s.category === selectedCategory.value)
})

const requestService = () => {
  tripStore.createTrip({
    service: selectedService.value.id,
    clientName: 'Client',
    pickup: 'Ubicació actual',
    pickupNumber: '---',
    vehicleType: 'normal'
  })
  router.push('/checkout')
  selectedService.value = null
}
</script>

<style scoped>
.services-page {
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
  color: #ffffff;
  font-weight: 700;
}

.title-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: white;
}

.header p {
  font-size: 16px;
  opacity: 1;
  color: #ffffff;
  font-weight: 500;
}

/* Filter Section */
.filter-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.filter-btn {
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: white;
}

.filter-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
}

/* Services Grid */
.services-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.15);
}

.service-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.service-header .icon {
  font-size: 40px;
}

.service-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 18px;
}

.service-description {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.service-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
}

.price {
  color: #4ECDC4;
  font-weight: 700;
  font-size: 18px;
}

.rating {
  color: #f39c12;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}

.star-svg {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
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
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #7f8c8d;
}

.modal-body {
  padding: 30px;
}

.service-detail-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.service-detail-header .icon {
  font-size: 48px;
}

.service-detail-header h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h3 {
  color: #2c3e50;
  font-size: 16px;
  margin-bottom: 12px;
}

.use-cases {
  list-style: none;
  padding: 0;
  margin: 0;
}

.use-cases li {
  padding: 8px 0;
  color: #2c3e50;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.use-cases li:last-child {
  border-bottom: none;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.pricing-info,
.availability {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  display: grid;
  gap: 12px;
}

.price-item,
.avail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #7f8c8d;
  font-weight: 600;
}

.value {
  color: #2c3e50;
  font-weight: 500;
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.feature-tag {
  background: #e8f4f8;
  color: #2c3e50;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
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
  font-size: 14px;
}

.modal-footer {
  padding: 20px 30px;
  border-top: 1px solid #ecf0f1;
  display: flex;
  gap: 10px;
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
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.btn-primary:hover,
.btn-primary.btn-large:hover {
  background: #3fa99f;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #bdc3c7;
}

.btn-large {
  padding: 14px 28px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 24px;
  }

  .services-grid {
    grid-template-columns: 1fr;
  }

  .filter-section {
    flex-direction: column;
  }

  .filter-btn {
    width: 100%;
  }

  .service-detail-header {
    flex-direction: column;
    text-align: center;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-primary {
    flex: auto;
  }
}
</style>
