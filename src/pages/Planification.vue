<template>
  <div class="planification-page">
    <div class="header">
      <h1><svg class="header-icon" viewBox="0 0 24 24"><path :d="mdiRocketLaunch" fill="currentColor" /></svg> RURAL-GO VIVA</h1>
      <p>Mobilitat Rural Inteligent</p>
    </div>

    <!-- Directament mostrar el formulari de sol·licitud -->
    <TripRequestForm />

    <!-- Enllaç per veure viatges anteriors -->
    <div class="bottom-links">
      <router-link to="/" class="link">← Tornar al menú principal</router-link>
    </div>
  </div>
</template>

<script setup>
import TripRequestForm from '../components/TripRequestForm.vue';
import { useRouter } from 'vue-router';
import { mdiRocketLaunch } from '@mdi/js'

const router = useRouter();
</script>

<style scoped>
.planification-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding-top: 20px;
}

.header h1 {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.header-icon {
  width: 36px;
  height: 36px;
  color: white;
  flex-shrink: 0;
}

.header p {
  margin: 10px 0 0 0;
  font-size: 16px;
  opacity: 0.9;
}

.bottom-links {
  max-width: 600px;
  margin: 30px auto 0;
  text-align: center;
}

.link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 10px;
  display: inline-block;
  transition: all 0.3s ease;
}

.link:hover {
  opacity: 0.8;
  transform: translateX(-2px);
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 24px;
  }

  .header p {
    font-size: 14px;
  }
}
</style>
