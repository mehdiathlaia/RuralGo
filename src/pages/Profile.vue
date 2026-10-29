<template>
  <div class="profile-container">
    <!-- Header -->
    <div class="header">
      <button @click="goBack" class="back-btn">← Enrere</button>
      <h1><svg class="header-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg> El Meu Perfil</h1>
    </div>

    <div class="content">
      <!-- Tabs -->
      <div class="tabs">
        <button 
          @click="activeTab = 'personal'" 
          class="tab-btn"
          :class="{ active: activeTab === 'personal' }"
        >
          <svg class="tab-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg> Dades Personals
        </button>
        <button 
          @click="activeTab = 'documents'" 
          class="tab-btn"
          :class="{ active: activeTab === 'documents' }"
        >
          <svg class="tab-icon" viewBox="0 0 24 24"><path :d="mdiFileCheck" fill="currentColor" /></svg> Documents
        </button>
        <button 
          @click="activeTab = 'payments'" 
          class="tab-btn"
          :class="{ active: activeTab === 'payments' }"
        >
          <svg class="tab-icon" viewBox="0 0 24 24"><path :d="mdiCurrencyEur" fill="currentColor" /></svg> Pagaments
        </button>
        <button 
          @click="activeTab = 'stats'" 
          class="tab-btn"
          :class="{ active: activeTab === 'stats' }"
        >
          <svg class="tab-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> Estadístiques
        </button>
      </div>

      <!-- Tab Content: Personal Info -->
      <div v-if="activeTab === 'personal'" class="tab-content">
        <h2>Informació Personal</h2>

        <div class="profile-section">
          <div class="avatar-upload">
            <div class="avatar" v-if="profileData.photo">
              <img :src="profileData.photo" alt="Avatar">
            </div>
            <div class="avatar placeholder" v-else>
              <svg class="placeholder-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
            </div>
            <button @click="changePhoto" class="change-photo-btn"><svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiDownload" fill="currentColor" /></svg> Canviar</button>
          </div>
        </div>

        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label>Nom Complet</label>
            <input v-model="profileData.fullName" type="text" placeholder="Joan Xifré">
          </div>

          <div class="form-group">
            <label>Email</label>
            <input v-model="profileData.email" type="email" placeholder="joan@example.com">
          </div>

          <div class="form-group">
            <label>Telèfon</label>
            <input v-model="profileData.phone" type="tel" placeholder="622 445 556">
          </div>

          <div class="form-group">
            <label>Data de Naixement</label>
            <input v-model="profileData.dateOfBirth" type="date">
          </div>

          <div class="form-group">
            <label>Adreça</label>
            <input v-model="profileData.address" type="text" placeholder="Carrer Principal, 123">
          </div>

          <div class="form-group">
            <label>Ciutat</label>
            <input v-model="profileData.city" type="text" placeholder="Barcelona">
          </div>

          <div class="form-group">
            <label>Codi Postal</label>
            <input v-model="profileData.zipCode" type="text" placeholder="08001">
          </div>

          <div class="form-group">
            <label>Preferències de Notificacions</label>
            <div class="checkbox-group">
              <label>
                <input v-model="profileData.emailNotifications" type="checkbox">
                Notificacions per Email
              </label>
              <label>
                <input v-model="profileData.smsNotifications" type="checkbox">
                Notificacions per SMS
              </label>
              <label>
                <input v-model="profileData.pushNotifications" type="checkbox">
                Notificacions Push
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary"><svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg> Guardar Canvis</button>
        </form>
      </div>

      <!-- Tab Content: Documents -->
      <div v-if="activeTab === 'documents'" class="tab-content">
        <h2>Documents Verificació</h2>

        <div class="documents-grid">
          <div 
            v-for="doc in requiredDocuments" 
            :key="doc.id" 
            class="document-card"
            :class="{ verified: doc.verified, expired: doc.expired }"
          >
            <div class="doc-header">
              <h3>{{ doc.name }}</h3>
              <span v-if="doc.verified" class="badge badge-success">
                <svg class="badge-icon" viewBox="0 0 24 24">
                  <path :d="mdiCheck" fill="currentColor" />
                </svg>
                Verificat
              </span>
              <span v-else-if="doc.expired" class="badge badge-danger">✕ Caducat</span>
              <span v-else class="badge badge-warning">⏳ Pendent</span>
            </div>

            <div class="doc-info">
              <p><strong>Tipus:</strong> {{ doc.type }}</p>
              <p v-if="doc.expiryDate"><strong>Caducitat:</strong> {{ formatDate(doc.expiryDate) }}</p>
              <p v-if="doc.uploadedDate"><strong>Pujat:</strong> {{ formatDate(doc.uploadedDate) }}</p>
            </div>

            <div class="doc-actions">
              <button @click="uploadDocument(doc.id)" class="btn btn-small"><svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiDownload" fill="currentColor" /></svg> Pujar</button>
              <button v-if="doc.verified" @click="viewDocument(doc.id)" class="btn btn-small btn-secondary"><svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiEyeOutline" fill="currentColor" /></svg> Veure</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content: Payments -->
      <div v-if="activeTab === 'payments'" class="tab-content">
        <h2>Mètodes de Pagament</h2>

        <div class="payment-methods">
          <div v-for="method in paymentMethods" :key="method.id" class="payment-card">
            <div class="payment-header">
              <h3>{{ method.type }}</h3>
              <span v-if="method.default" class="badge badge-info">Per Defecte</span>
            </div>
            <div class="payment-details">
              <p>{{ method.cardNumber }}</p>
              <p class="expiry">Caducitat: {{ method.expiryDate }}</p>
            </div>
            <div class="payment-actions">
              <button @click="setDefaultPayment(method.id)" class="btn btn-small" v-if="!method.default">
                Establir Per Defecte
              </button>
              <button @click="deletePaymentMethod(method.id)" class="btn btn-small btn-danger">
                <svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiTrashCan" fill="currentColor" /></svg> Eliminar
              </button>
            </div>
          </div>
        </div>

        <button @click="addPaymentMethod" class="btn btn-primary">+ Afegir Mètode de Pagament</button>
      </div>

      <!-- Tab Content: Statistics -->
      <div v-if="activeTab === 'stats'" class="tab-content">
        <h2>Les Meves Estadístiques</h2>

        <div class="stats-grid-profile">
          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24"><path :d="mdiCar" fill="currentColor" /></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Viatges Totals</p>
              <p class="stat-value">{{ statistics.totalTrips }}</p>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24">
                <path :d="mdiStar" fill="currentColor" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Rating Promedi</p>
              <p class="stat-value">{{ statistics.averageRating }}/5.0</p>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24"><path :d="mdiCurrencyEur" fill="currentColor" /></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Ingressos Totals</p>
              <p class="stat-value">€{{ statistics.totalEarnings.toFixed(2) }}</p>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24"><path :d="mdiClock" fill="currentColor" /></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Hores de Conducció</p>
              <p class="stat-value">{{ statistics.drivingHours }}h</p>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24"><path :d="mdiCar" fill="currentColor" /></svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Km Totals</p>
              <p class="stat-value">{{ statistics.totalKm }}</p>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon">
              <svg class="stat-svg" viewBox="0 0 24 24">
                <path :d="mdiCheck" fill="currentColor" />
              </svg>
            </div>
            <div class="stat-info">
              <p class="stat-label">Taxa Acceptació</p>
              <p class="stat-value">{{ statistics.acceptanceRate }}%</p>
            </div>
          </div>
        </div>

        <div class="monthly-chart">
          <h3>Viatges per Mes (Últims 6 Mesos)</h3>
          <div class="chart-bars">
            <div class="bar-item" v-for="(month, index) in statistics.monthlyTrips" :key="index">
              <div class="bar" :style="{ height: (month.trips * 5) + 'px' }"></div>
              <span class="label">{{ month.month }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiCheck, mdiStar, mdiCar, mdiCurrencyEur, mdiClock, mdiFileCheck, mdiEyeOutline, mdiTrashCan, mdiDownload } from '@mdi/js'

const router = useRouter();
const activeTab = ref('personal');

const profileData = ref({
  fullName: 'Joan Xifré García',
  email: 'joan@example.com',
  phone: '622 445 556',
  dateOfBirth: '1985-03-15',
  address: 'Carrer Principal, 123',
  city: 'Barcelona',
  zipCode: '08001',
  photo: null,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
});

const requiredDocuments = ref([
  {
    id: 1,
    name: 'Carnet de Conducció',
    type: 'Permís de Conducció',
    verified: true,
    expired: false,
    expiryDate: '2026-05-20',
    uploadedDate: '2023-05-20'
  },
  {
    id: 2,
    name: 'DNI / Pasaport',
    type: 'Document d\'Identitat',
    verified: true,
    expired: false,
    expiryDate: '2028-08-15',
    uploadedDate: '2023-06-10'
  },
  {
    id: 3,
    name: 'Inspecció Tècnica Vehicle',
    type: 'Vehicle Check',
    verified: true,
    expired: false,
    expiryDate: '2024-12-31',
    uploadedDate: '2023-12-01'
  },
  {
    id: 4,
    name: 'Assegurança Vehicle',
    type: 'Pòlissa d\'Assegurança',
    verified: true,
    expired: false,
    expiryDate: '2024-11-15',
    uploadedDate: '2023-11-01'
  },
  {
    id: 5,
    name: 'Antecedents Penals',
    type: 'Certificat Criminal Record',
    verified: true,
    expired: false,
    expiryDate: null,
    uploadedDate: '2023-04-05'
  }
]);

const paymentMethods = ref([
  {
    id: 1,
    type: 'Targeta de Crèdit',
    cardNumber: '**** **** **** 1234',
    expiryDate: '05/26',
    default: true
  },
  {
    id: 2,
    type: 'Targeta de Dèbit',
    cardNumber: '**** **** **** 5678',
    expiryDate: '08/25',
    default: false
  }
]);

const statistics = ref({
  totalTrips: 287,
  averageRating: 4.8,
  totalEarnings: 4250.75,
  drivingHours: 342,
  totalKm: 8450,
  acceptanceRate: 92,
  monthlyTrips: [
    { month: 'Juny', trips: 35 },
    { month: 'Juliol', trips: 42 },
    { month: 'Agost', trips: 38 },
    { month: 'Setembre', trips: 48 },
    { month: 'Octubre', trips: 45 },
    { month: 'Novembre', trips: 38 }
  ]
});

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
};

const goBack = () => {
  router.back();
};

const changePhoto = () => {
  alert('Selecciona una foto nova');
};

const saveProfile = () => {
  alert('Perfil actualitzat correctament ✓');
};

const uploadDocument = (docId) => {
  alert('Selecciona el document per pujar');
};

const viewDocument = (docId) => {
  alert('Mostrant document');
};

const setDefaultPayment = (methodId) => {
  paymentMethods.value = paymentMethods.value.map(m => ({
    ...m,
    default: m.id === methodId
  }));
  alert('Mètode de pagament per defecte actualitzat');
};

const deletePaymentMethod = (methodId) => {
  paymentMethods.value = paymentMethods.value.filter(m => m.id !== methodId);
  alert('Mètode de pagament eliminat');
};

const addPaymentMethod = () => {
  alert('Afegir nou mètode de pagament');
};
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  padding: 10px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e0e0e0;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  color: #4ECDC4;
}

.content {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
  overflow-x: auto;
}

.tab-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: transparent;
  color: #555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  border-bottom: 3px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  color: #4ECDC4;
  border-bottom-color: #4ECDC4;
}

.tab-content {
  padding: 30px;
}

.tab-content h2 {
  color: #2c3e50;
  margin-top: 0;
  border-bottom: 2px solid #4ECDC4;
  padding-bottom: 10px;
}

.profile-section {
  margin-bottom: 30px;
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 8px;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: #e9ecef;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar.placeholder {
  background: #4ECDC4;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 32px;
  height: 32px;
  color: white;
}

.change-photo-btn {
  padding: 10px 20px;
  background: #4ECDC4;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.change-photo-btn:hover {
  background: #44A08D;
}

.profile-form {
  display: grid;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-group input {
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: normal;
  color: #555;
  margin-bottom: 0;
  cursor: pointer;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.documents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.document-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s ease;
}

.document-card:hover {
  border-color: #4ECDC4;
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.2);
}

.document-card.verified {
  background: #f0fdf4;
  border-color: #27ae60;
}

.document-card.expired {
  background: #fef2f2;
  border-color: #e74c3c;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 15px;
}

.doc-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.badge-success {
  background: #27ae60;
  color: white;
}

.badge-danger {
  background: #e74c3c;
  color: white;
}

.badge-warning {
  background: #f39c12;
  color: white;
}

.badge-info {
  background: #3498db;
  color: white;
}

.doc-info {
  font-size: 13px;
  color: #555;
  margin-bottom: 15px;
}

.doc-info p {
  margin: 5px 0;
}

.doc-actions {
  display: flex;
  gap: 10px;
}

.payment-methods {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.payment-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.payment-header h3 {
  margin: 0;
  font-size: 16px;
}

.payment-details {
  margin-bottom: 20px;
  border-top: 1px solid rgba(255,255,255,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.3);
  padding: 15px 0;
}

.payment-details p {
  margin: 5px 0;
  font-size: 14px;
  font-family: monospace;
}

.expiry {
  font-size: 12px;
  opacity: 0.9;
}

.payment-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.btn-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
  transform: translateY(-2px);
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
  flex: 1;
  background: #4ECDC4;
  color: white;
}

.btn-small:hover {
  background: #44A08D;
}

.btn-secondary {
  background: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background: #7f8c8d;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
}

.stats-grid-profile {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-box {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  gap: 15px;
  align-items: center;
}

.stat-icon {
  font-size: 32px;
}

.stat-svg {
  width: 32px;
  height: 32px;
  color: white;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: 12px;
  opacity: 0.9;
  text-transform: uppercase;
}

.stat-value {
  margin: 5px 0 0 0;
  font-size: 24px;
  font-weight: 700;
}

.monthly-chart {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.monthly-chart h3 {
  margin-top: 0;
  color: #2c3e50;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  gap: 10px;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar {
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
}

.bar:hover {
  opacity: 0.8;
}

.bar-item .label {
  margin-top: 10px;
  font-size: 12px;
  color: #555;
}

@media (max-width: 768px) {
  .tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 0 1 calc(50% - 10px);
    font-size: 12px;
    padding: 12px 10px;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid-profile {
    grid-template-columns: 1fr;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }
}
</style>
