<template>
  <div class="demo-page">
    <div class="demo-container">
      <h1>🎬 RURAL-GO VIVA - Demo Panel</h1>
      <p class="subtitle">Testa la funcionalitat de l'aplicació</p>

      <div class="demo-grid">
        <!-- Simular Client creant viatge -->
        <div class="demo-card">
          <h3>👤 Client</h3>
          <p>Simula un client creat un viatge</p>
          <div class="action-buttons">
            <button @click="createDemoTripAction" class="btn btn-primary">
              ✓ Crear viatge de prova
            </button>
            <button @click="navigateTo('/planification')" class="btn btn-secondary">
              → Ir a Planificació
            </button>
          </div>
        </div>

        <!-- Simular Driver acceptant viatge -->
        <div class="demo-card">
          <h3>🚗 Conductor</h3>
          <p>Simula un conductor acceptant un viatge</p>
          <div class="action-buttons">
            <button @click="setDriverOnline" class="btn btn-primary">
              🟢 Posar en línia
            </button>
            <button @click="navigateTo('/driver-dashboard')" class="btn btn-secondary">
              → Ir a Dashboard
            </button>
          </div>
        </div>

        <!-- Veure notificacions -->
        <div class="demo-card">
          <h3>🔔 Notificacions</h3>
          <p>Veure i gestionar notificacions</p>
          <div class="stats">
            <div class="stat">
              <span class="label">Viatges pendents:</span>
              <span class="value">{{ pendingTrips }}</span>
            </div>
            <div class="stat">
              <span class="label">Notificacions:</span>
              <span class="value">{{ notificationCount }}</span>
            </div>
          </div>
          <div class="action-buttons">
            <button @click="showNotifications" class="btn btn-primary">
              📬 Veure notificacions
            </button>
          </div>
        </div>

        <!-- Control de dades -->
        <div class="demo-card">
          <h3>Control</h3>
          <p>Gestionar dades de demo</p>
          <div class="action-buttons">
            <button @click="clearAllData" class="btn btn-danger">
              Netejar tot
            </button>
            <button @click="exportData" class="btn btn-secondary">
              Exportar dades
            </button>
          </div>
        </div>

        <!-- Accés ràpid als usuarios -->
        <div class="demo-card">
          <h3>👥 Usuaris de Prova</h3>
          <p>Accedir amb comptes de prova</p>
          <div class="quick-links">
            <button @click="loginAsClient" class="quick-link">Maria García (Client)</button>
            <button @click="loginAsDriver" class="quick-link">Joan Riera (Conductor)</button>
            <button @click="loginAsDriver2" class="quick-link">Maria Garcia (Conductor)</button>
          </div>
        </div>

        <!-- Flux de demo -->
        <div class="demo-card">
          <h3>🎥 Flux Automàtic</h3>
          <p>Demostrar el flux complet</p>
          <div class="action-buttons">
            <button @click="runDemoFlow" class="btn btn-success">
              Iniciar demo automàtic
            </button>
          </div>
          <div v-if="demoRunning" class="demo-status">
            <p>{{ demoStatus }}</p>
            <div class="progress-bar">
              <div class="progress" :style="{ width: demoProgress + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Info del sistema -->
      <div class="system-info">
        <h3>Informació del Sistema</h3>
        <div class="info-grid">
          <div class="info-item">
            <span>API Google Maps:</span>
            <span :class="{ active: hasGoogleMaps }">{{ hasGoogleMaps ? '✓ Disponible' : '✗ No disponible' }}</span>
          </div>
          <div class="info-item">
            <span>LocalStorage:</span>
            <span :class="{ active: hasLocalStorage }">{{ hasLocalStorage ? '✓ Disponible' : '✗ No disponible' }}</span>
          </div>
          <div class="info-item">
            <span>Pinia Store:</span>
            <span class="active">✓ Disponible</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNotificationStore } from '../store/notificationStore';
import { useAuthStore } from '../store/authStore';
import { createDemoTrip, clearDemoData } from '../utils/demoSetup';

const router = useRouter();
const notificationStore = useNotificationStore();
const authStore = useAuthStore();

const demoRunning = ref(false);
const demoStatus = ref('');
const demoProgress = ref(0);
const hasGoogleMaps = ref(false);
const hasLocalStorage = ref(typeof localStorage !== 'undefined');

const pendingTrips = computed(() => notificationStore.pendingTrips.length);
const notificationCount = computed(() => notificationStore.notifications.length);

onMounted(() => {
  hasGoogleMaps.value = !!window.google?.maps;
  notificationStore.loadFromLocalStorage();
});

const navigateTo = (path) => {
  router.push(path);
};

const createDemoTripAction = () => {
  const trip = createDemoTrip();
  if (trip) {
    notificationStore.showToast('✓ Viatge de prova creat! Els conductors estan rebent la sol·licitud...', 'success');
    // Notificar conductors online
    setTimeout(() => {
      notificationStore.pendingTrips.forEach(t => {
        if (t.id === trip.id) {
          notificationStore.addNotification({
            recipientId: 2,
            title: '🚗 Nou viatge disponible!',
            message: `${t.service} de ${t.clientName}: ${t.pickup} → ${t.destination}`,
            type: 'info',
            channel: 'trip'
          });
        }
      });
    }, 500);
  } else {
    notificationStore.showToast('❌ Error creant el viatge', 'error');
  }
};

const setDriverOnline = () => {
  notificationStore.setDriverOnline(2);
  notificationStore.showToast('✓ Conductor online! Ara rebrà sol·licituds de viatge', 'success');
};

const showNotifications = () => {
  // Aquesta acció es controlaria via el botó de notificacions
  notificationStore.showToast('Veure el botó de notificacions (🔔) a la part superior', 'info');
};

const clearAllData = () => {
  if (confirm('Estàs segur? Això netejarà totes les dades de demo')) {
    clearDemoData();
    notificationStore.notifications = [];
    notificationStore.pendingTrips = [];
    notificationStore.activeTrips = {};
    notificationStore.showToast('✓ Dades netes', 'success');
  }
};

const exportData = () => {
  const data = {
    pendingTrips: notificationStore.pendingTrips,
    activeTrips: notificationStore.activeTrips,
    notifications: notificationStore.notifications,
  };
  console.log('📊 Dades exportades:', data);
  notificationStore.showToast('✓ Dades exportades a la consola', 'success');
};

const loginAsClient = () => {
  authStore.login('maria@example.com', 'pass123');
  notificationStore.showToast('✓ Connectat com Client', 'success');
  router.push('/planification');
};

const loginAsDriver = () => {
  authStore.login('joan@example.com', 'pass123');
  notificationStore.showToast('✓ Connectat com Conductor', 'success');
  notificationStore.setDriverOnline(2);
  router.push('/driver-dashboard');
};

const loginAsDriver2 = () => {
  authStore.login('maria.conductor@example.com', 'pass123');
  notificationStore.showToast('✓ Connectat com Conductor', 'success');
  notificationStore.setDriverOnline(3);
  router.push('/driver-dashboard');
};

const runDemoFlow = async () => {
  demoRunning.value = true;
  demoProgress.value = 0;

  const steps = [
    { text: 'Iniciant demo...' , delay: 1000, progress: 10 },
    { text: 'Conectant client...', delay: 1000, progress: 30 },
    { text: 'Creant viatge...', delay: 2000, progress: 50 },
    { text: 'Notificant conductors...', delay: 1000, progress: 70 },
    { text: 'Conductor accepta viatge...', delay: 2000, progress: 90 },
    { text: 'Demo completada! ✓', delay: 1000, progress: 100 },
  ];

  for (const step of steps) {
    demoStatus.value = step.text;
    await new Promise(resolve => setTimeout(resolve, step.delay));
    demoProgress.value = step.progress;
  }

  demoRunning.value = false;
  router.push('/planification');
};
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 10px;
  color: #333;
}

.subtitle {
  color: #666;
  margin: 0 0 30px;
  font-size: 16px;
}

.demo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.demo-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #667eea;
}

.demo-card h3 {
  margin: 0 0 10px;
  font-size: 18px;
  color: #333;
}

.demo-card p {
  margin: 0 0 15px;
  color: #666;
  font-size: 14px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
  transform: translateY(-2px);
}

.btn-secondary {
  background: #e8e8e8;
  color: #333;
}

.btn-secondary:hover {
  background: #d8d8d8;
}

.btn-success {
  background: #27ae60;
  color: white;
  width: 100%;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.quick-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-link {
  padding: 8px 12px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-size: 13px;
}

.quick-link:hover {
  background: #f0f0f0;
  border-color: #667eea;
}

.stats {
  background: white;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.stat:last-child {
  border-bottom: none;
}

.label {
  font-size: 13px;
  color: #666;
}

.value {
  font-weight: 600;
  color: #667eea;
}

.system-info {
  background: #f0f0f0;
  border-radius: 12px;
  padding: 20px;
  margin-top: 30px;
}

.system-info h3 {
  margin: 0 0 15px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

.info-item span {
  font-size: 14px;
}

.info-item span.active {
  color: #27ae60;
  font-weight: 600;
}

.demo-status {
  margin-top: 15px;
  text-align: center;
}

.demo-status p {
  color: #667eea;
  font-weight: 600;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  transition: width 0.3s ease;
}
</style>
