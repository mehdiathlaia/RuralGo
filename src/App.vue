<template>
  <div class="layout">
    <!-- Terms Modal - must be accepted before viewing anything -->
    <TermsAndConditionsModal 
      v-if="showTermsModal" 
      :show-terms="showTermsModal"
      @accept="handleAcceptTerms"
      @reject="handleRejectTerms"
    />

    <!-- Main App Content - only visible if terms are accepted -->
    <template v-if="!showTermsModal">
      <header class="app-header">
        <!-- Logo (Left) -->
        <div class="header-left">
          <router-link to="/" class="logo">
            <svg class="logo-icon" viewBox="0 0 24 24">
              <path :d="mdiEarth" fill="currentColor" />
            </svg>
            RURAL-GO VIVA
          </router-link>
        </div>

        <!-- Right Side (Auth/User + Hamburger) -->
        <div class="header-right">
          <div v-if="isAuthenticated" class="user-menu">
            <router-link to="/profile" class="btn btn-small btn-primary">
              <svg class="btn-icon" viewBox="0 0 24 24">
                <path :d="mdiAccount" fill="currentColor" />
              </svg>
              Perfil
            </router-link>
          </div>
          <div v-else class="auth-links">
            <router-link to="/login" class="btn btn-primary btn-access">
              Accés
            </router-link>
          </div>

          <!-- Hamburger Menu -->
          <HamburgerMenu />
        </div>
      </header>

      <main class="main-content">
        <router-view />
      </main>

      <!-- Footer Component -->
      <Footer />

      <!-- Notification Center Component -->
      <NotificationCenter v-if="isAuthenticated" />
    </template>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './store/authStore';
import TermsAndConditionsModal from './components/TermsAndConditionsModal.vue';
import NotificationCenter from './components/NotificationCenter.vue';
import Footer from './components/Footer.vue';
import HamburgerMenu from './components/HamburgerMenu.vue';
import {
  mdiTarget,
  mdiPhone,
  mdiListBox,
  mdiCar,
  mdiAlert,
  mdiClockOutline,
  mdiStar,
  mdiTheater,
  mdiCog,
  mdiLogout,
  mdiLock,
  mdiEarth,
  mdiAccount
} from '@mdi/js';

const router = useRouter();
const authStore = useAuthStore();

// Control de términos y condiciones
const showTermsModal = ref(localStorage.getItem('termsAndConditionsAccepted') !== 'true');

const handleAcceptTerms = () => {
  showTermsModal.value = false;
};

const handleRejectTerms = () => {
  // Si rechaza, mantener el modal visible y redirigir
  showTermsModal.value = true;
  // Opcional: redirigir a una página externa
  // window.location.href = 'https://www.example.com';
};

const isAuthenticated = computed(() => authStore.isLoggedIn);
const currentUser = computed(() => authStore.getUser);
const userRole = computed(() => authStore.getUserRole);

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: white;
}

/* HEADER STYLES */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  border-bottom: 1px solid #e9ecef;
  padding: clamp(12px, 3vw, 16px) clamp(15px, 5vw, 40px);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(15px, 3vw, 30px);
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}

.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.logo {
  font-size: clamp(16px, 4vw, 22px);
  font-weight: 800;
  color: #2E7D6E;
  text-decoration: none;
  transition: var(--transition);
  padding: clamp(4px, 1vw, 8px) 0;
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.5vw, 10px);
  letter-spacing: -0.5px;
  white-space: nowrap;
}

.logo-icon {
  width: clamp(20px, 5vw, 28px);
  height: clamp(20px, 5vw, 28px);
  color: #2E7D6E;
  flex-shrink: 0;
}

.logo:hover {
  color: #1a4a42;
  opacity: 0.9;
}

/* Center Navigation - Home Button */
.header-center {
  display: none;
}

.home-btn {
  display: none;
}

/* Right Side */
.header-right {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2.5vw, 20px);
  flex-shrink: 0;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: clamp(8px, 1.5vw, 12px);
}

.user-name {
  font-size: clamp(11px, 2vw, 14px);
  color: #1a1a1a;
  white-space: nowrap;
  font-weight: 500;
  min-width: auto;
}

.auth-links {
  display: flex;
  gap: clamp(8px, 1.5vw, 10px);
  align-items: center;
}

.btn-small {
  padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px);
  font-size: clamp(11px, 2vw, 13px);
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(4px, 1vw, 6px);
}

.btn-access {
  padding: clamp(10px, 2vw, 14px) clamp(18px, 3.5vw, 28px);
  font-size: clamp(13px, 2.3vw, 16px);
  font-weight: 600;
  min-height: 48px;
  white-space: nowrap;
}

.btn-icon {
  width: clamp(12px, 2.5vw, 16px);
  height: clamp(12px, 2.5vw, 16px);
  flex-shrink: 0;
}

.nav-icon {
  width: clamp(14px, 3vw, 18px);
  height: clamp(14px, 3vw, 18px);
  margin-right: clamp(2px, 0.5vw, 4px);
  flex-shrink: 0;
}

.icon {
  font-size: clamp(12px, 3vw, 16px);
  flex-shrink: 0;
  margin-right: 4px;
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  background: white;
  width: 100%;
}

/* RESPONSIVE */
@media (max-width: 1400px) {
  .app-header {
    padding: clamp(12px, 2vw, 16px) clamp(15px, 4vw, 40px);
  }

  .home-btn {
    padding: clamp(8px, 1.8vw, 10px) clamp(14px, 2.5vw, 20px);
    font-size: clamp(13px, 2vw, 15px);
  }

  .btn-access {
    padding: clamp(8px, 1.8vw, 10px) clamp(14px, 2.5vw, 20px);
    font-size: clamp(12px, 2vw, 13px);
  }
}

@media (max-width: 1024px) {
  .app-header {
    padding: clamp(12px, 2.5vw, 14px) clamp(15px, 4vw, 30px);
    gap: clamp(10px, 2vw, 20px);
  }

  .logo {
    font-size: clamp(14px, 3.5vw, 20px);
  }

  .home-btn {
    padding: clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px);
    font-size: clamp(12px, 1.8vw, 14px);
    min-height: 40px;
  }

  .header-right {
    gap: clamp(10px, 2vw, 15px);
  }

  .btn-small {
    padding: clamp(6px, 1.5vw, 8px) clamp(10px, 1.5vw, 12px);
    font-size: clamp(10px, 1.6vw, 12px);
    min-height: 40px;
  }

  .btn-access {
    padding: clamp(6px, 1.5vw, 8px) clamp(12px, 2vw, 16px);
    font-size: clamp(11px, 1.8vw, 12px);
    min-height: 40px;
  }
}

@media (max-width: 768px) {
  .app-header {
    grid-template-columns: auto auto 1fr auto;
    gap: clamp(8px, 2vw, 12px);
    padding: clamp(10px, 2vw, 12px) clamp(10px, 3vw, 16px);
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 3;
    flex: 0 1 auto;
    margin-left: auto;
  }

  .home-btn {
    padding: clamp(6px, 1.2vw, 8px) clamp(10px, 1.5vw, 12px);
    font-size: clamp(11px, 1.5vw, 12px);
    min-height: 40px;
  }

  .header-right {
    order: 2;
    gap: clamp(6px, 1.5vw, 10px);
    margin-left: auto;
  }

  .user-menu {
    gap: clamp(6px, 1.5vw, 10px);
  }

  .user-name {
    font-size: clamp(10px, 1.5vw, 11px);
    display: none;
  }

  .btn-small {
    padding: clamp(6px, 1.5vw, 8px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(10px, 1.5vw, 11px);
    min-height: 40px;
  }

  .btn-access {
    padding: clamp(6px, 1.5vw, 8px) clamp(10px, 1.5vw, 12px);
    font-size: clamp(10px, 1.5vw, 11px);
    min-height: 40px;
  }
}

@media (max-width: 640px) {
  .app-header {
    grid-template-columns: auto 1fr auto;
    gap: clamp(6px, 1.5vw, 10px);
    padding: clamp(8px, 1.5vw, 10px) clamp(8px, 2.5vw, 12px);
  }

  .header-left {
    order: 1;
  }

  .header-center {
    order: 2;
    flex: 1;
  }

  .logo {
    font-size: clamp(14px, 4vw, 18px);
    gap: clamp(4px, 1vw, 6px);
  }

  .logo-icon {
    width: clamp(16px, 4vw, 20px);
    height: clamp(16px, 4vw, 20px);
  }

  .home-btn {
    padding: clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(10px, 1.5vw, 11px);
    min-height: 40px;
  }

  .header-right {
    order: 3;
    gap: clamp(4px, 1vw, 6px);
  }

  .user-menu {
    gap: clamp(4px, 1vw, 6px);
  }

  .btn-small {
    padding: clamp(6px, 1.2vw, 8px) clamp(6px, 1.2vw, 10px);
    font-size: clamp(9px, 1.3vw, 10px);
    min-height: 40px;
    min-width: 40px;
  }

  .btn-small .btn-icon {
    width: clamp(10px, 2.2vw, 12px);
    height: clamp(10px, 2.2vw, 12px);
  }

  .btn-access {
    padding: clamp(6px, 1.2vw, 8px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(9px, 1.3vw, 10px);
    min-height: 40px;
  }
}

@media (max-width: 480px) {
  .app-header {
    grid-template-columns: 1fr auto;
    padding: clamp(44px, 7vw, 56px) clamp(8px, 2vw, 10px) clamp(10px, 2vw, 12px) clamp(8px, 2vw, 10px);
    gap: clamp(8px, 2vw, 12px);
  }

  .logo {
    font-size: clamp(16px, 4.5vw, 20px);
    gap: clamp(4px, 1vw, 6px);
  }

  .logo-icon {
    width: clamp(18px, 4.5vw, 24px);
    height: clamp(18px, 4.5vw, 24px);
  }

  .header-right {
    gap: clamp(6px, 1.5vw, 8px);
    display: flex;
    align-items: center;
  }

  .user-menu {
    gap: clamp(3px, 0.8vw, 4px);
  }

  .user-name {
    display: none;
  }

  .btn-small {
    padding: clamp(6px, 1.5vw, 8px) clamp(10px, 1.5vw, 12px);
    font-size: clamp(8px, 1.2vw, 9px);
    min-height: 40px;
    min-width: 40px;
  }

  .btn-small .btn-icon {
    width: 14px;
    height: 14px;
  }

  .btn-access {
    padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 16px);
    font-size: clamp(11px, 1.8vw, 13px);
    min-height: 44px;
  }
}

/* Landscape mode */
@media (max-height: 500px) and (orientation: landscape) {
  .app-header {
    padding: clamp(6px, 1.5vh, 10px) clamp(12px, 4vw, 20px);
    gap: clamp(6px, 1.5vh, 10px);
  }

  .home-btn {
    padding: clamp(4px, 1vh, 6px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(9px, 1.8vw, 11px);
    min-height: 36px;
  }

  .btn-small {
    padding: clamp(4px, 1vh, 6px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(9px, 1.8vw, 11px);
    min-height: 36px;
  }

  .btn-access {
    padding: clamp(4px, 1vh, 6px) clamp(8px, 1.5vw, 12px);
    font-size: clamp(9px, 1.8vw, 11px);
    min-height: 36px;
  }
}
</style>

