<template>
  <div class="hamburger-menu">
    <!-- Hamburger Button -->
    <button 
      class="hamburger-btn"
      :class="{ active: isOpen }"
      @click="toggleMenu"
      aria-label="Menú"
      title="Menú de navegació"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- Menu Drawer -->
    <transition name="slide">
      <div v-if="isOpen" class="menu-overlay" @click="closeMenu"></div>
    </transition>
    
    <transition name="slide">
      <nav v-if="isOpen" class="menu-drawer">
        <div class="menu-header">
          <h2>Menú</h2>
          <button class="close-btn" @click="closeMenu" aria-label="Tancar menú">
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>
        </div>

        <div class="menu-content">
          <!-- Navigation Links -->
          <router-link 
            to="/" 
            class="menu-item"
            @click="closeMenu"
          >
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
            Inici
          </router-link>

          <router-link 
            to="/services" 
            class="menu-item"
            @click="closeMenu"
          >
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
            </svg>
            Serveis
          </router-link>

          <template v-if="userRole === 'client'">
            <router-link 
              to="/planification" 
              class="menu-item"
              @click="closeMenu"
            >
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
              Panel Client
            </router-link>

            <router-link 
              to="/my-trips" 
              class="menu-item"
              @click="closeMenu"
            >
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7 10l5 5 5-5z" />
              </svg>
              Els meus viatges
            </router-link>
          </template>

          <template v-if="userRole === 'driver'">
            <router-link 
              to="/driver-dashboard" 
              class="menu-item"
              @click="closeMenu"
            >
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm11 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM5 11l1.5-4.5h11L19 11H5z" />
              </svg>
              Panel Conductor
            </router-link>

            <router-link 
              to="/history" 
              class="menu-item"
              @click="closeMenu"
            >
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z" />
              </svg>
              Historial
            </router-link>
          </template>

          <template v-if="userRole === 'admin'">
            <router-link 
              to="/admin/registrations" 
              class="menu-item"
              @click="closeMenu"
            >
              <svg class="menu-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-9c1.38 0 2.5-1.12 2.5-2.5S7.88 5.5 6.5 5.5 4 6.62 4 8s1.12 2.5 2.5 2.5zm0 6c2.33 0 4.31-1.46 5.11-3.5H1.89c.8 2.04 2.78 3.5 5.11 3.5zm5.5-6c1.38 0 2.5-1.12 2.5-2.5S13.38 5.5 12 5.5s-2.5 1.12-2.5 2.5 1.12 2.5 2.5 2.5zm0 6c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5zm5.5-6c1.38 0 2.5-1.12 2.5-2.5S18.88 5.5 17.5 5.5 15 6.62 15 8s1.12 2.5 2.5 2.5z" />
              </svg>
              Gestionar Registres
            </router-link>
          </template>

          <router-link 
            to="/ratings" 
            class="menu-item"
            @click="closeMenu"
          >
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2l-2.81 6.63L2 9.24l5.46 4.73L5.82 21 12 17.27z" />
            </svg>
            Valoracions
          </router-link>

          <router-link 
            to="/domus-viva" 
            class="menu-item"
            @click="closeMenu"
          >
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M5 20h14v-2H5v2zm14-10H5v2h14v-2zM5 4v2h14V4H5z" />
            </svg>
            Domus Viva
          </router-link>

          <router-link 
            to="/emergency" 
            class="menu-item alert-item"
            @click="closeMenu"
          >
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m1 15h-2v-2h2v2m0-4h-2V7h2v6z" />
            </svg>
            Emergències
          </router-link>
        </div>

        <div v-if="isAuthenticated" class="menu-footer">
          <hr>
          <button @click="handleLogout" class="logout-item">
            <svg class="menu-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'vue-router';
import { App } from '@capacitor/app';

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);

const isAuthenticated = computed(() => authStore.isAuthenticated);
const userRole = computed(() => authStore.userRole);

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const closeMenu = () => {
  isOpen.value = false;
};

const handleLogout = () => {
  authStore.logout();
  closeMenu();
  router.push('/');
};

// Handle Android back button
const handleBackButton = () => {
  if (isOpen.value) {
    closeMenu();
  }
};

// Add back button listener when component mounts
onMounted(() => {
  try {
    App.addListener('backButton', handleBackButton);
  } catch (error) {
    console.log('Capacitor App not available in dev mode');
  }
});

// Clean up listener when component unmounts
onUnmounted(() => {
  try {
    App.removeAllListeners();
  } catch (error) {
    console.log('Error removing listeners');
  }
});
</script>

<style scoped>
.hamburger-menu {
  position: relative;
  z-index: 1000;
}

.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: clamp(44px, 12vw, 56px);
  height: clamp(44px, 12vw, 56px);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  gap: clamp(5px, 1.5vw, 8px);
  transition: all 0.3s ease;
}

.hamburger-btn span {
  display: block;
  width: clamp(24px, 6vw, 32px);
  height: clamp(2.5px, 0.6vw, 4px);
  background: #1a1a1a;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger-btn:hover {
  background: rgba(46, 125, 110, 0.1);
  border-radius: 6px;
}

.hamburger-btn.active span:nth-child(1) {
  transform: rotate(45deg) translateY(clamp(10px, 2.5vw, 14px));
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translateY(clamp(-10px, -2.5vw, -14px));
}

/* Menu Overlay */
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

/* Menu Drawer */
.menu-drawer {
  position: fixed;
  top: 0;
  left: 0;
  width: clamp(220px, 40vw, 280px);
  height: 100vh;
  background: white;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(40px, 8vw, 52px) clamp(12px, 3vw, 16px) clamp(12px, 3vw, 16px) clamp(12px, 3vw, 16px);
  border-bottom: 1px solid #e9ecef;
}

.menu-header h2 {
  margin: 0;
  font-size: clamp(16px, 3vw, 20px);
  color: #2E7D6E;
  font-weight: 700;
}

.close-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  width: clamp(30px, 7vw, 40px);
  height: clamp(30px, 7vw, 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.3s ease;
  padding: 0;
}

.close-btn:hover {
  background: rgba(46, 125, 110, 0.1);
}

.close-btn svg {
  width: clamp(20px, 5vw, 24px);
  height: clamp(20px, 5vw, 24px);
}

.menu-content {
  flex: 1;
  padding: clamp(12px, 3vw, 16px) 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4px, 1vw, 8px);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: clamp(14px, 3vw, 18px);
  padding: clamp(14px, 2.5vw, 18px) clamp(16px, 3.5vw, 22px);
  color: #1a1a1a;
  text-decoration: none;
  font-size: clamp(15px, 2.8vw, 18px);
  font-weight: 500;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  min-height: clamp(48px, 10vw, 56px);
  justify-content: flex-start;
}

.menu-item:hover {
  background: rgba(46, 125, 110, 0.1);
  color: #2E7D6E;
  border-left-color: #2E7D6E;
}

.menu-item.router-link-active {
  background: rgba(46, 125, 110, 0.15);
  color: #2E7D6E;
  border-left-color: #2E7D6E;
}

.menu-item.alert-item {
  color: #e74c3c;
}

.menu-item.alert-item:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #c0392b;
  border-left-color: #e74c3c;
}

.menu-icon {
  width: clamp(22px, 5vw, 28px);
  height: clamp(22px, 5vw, 28px);
  flex-shrink: 0;
}

.menu-footer {
  padding: clamp(14px, 2.5vw, 18px);
  border-top: 1px solid #e9ecef;
}

.menu-footer hr {
  margin: 0 0 clamp(10px, 2vw, 14px) 0;
  border: none;
  border-top: 1px solid #e9ecef;
}

.logout-item {
  display: flex;
  align-items: center;
  gap: clamp(12px, 2.5vw, 16px);
  width: 100%;
  padding: clamp(12px, 2.5vw, 14px) clamp(14px, 2.5vw, 18px);
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  color: #e74c3c;
  font-size: clamp(14px, 2.8vw, 16px);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 48px;
  justify-content: flex-start;
}

.logout-item:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  color: #c0392b;
}

/* Animations */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(-100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}

/* Show hamburger on tablet and below */
@media (max-width: 1024px) {
  .hamburger-btn {
    display: flex;
  }
}

@media (max-width: 768px) {
  .menu-drawer {
    width: clamp(200px, 75vw, 300px);
  }
}

@media (max-width: 480px) {
  .menu-drawer {
    width: 100vw;
    max-width: 100vw;
  }

  .menu-header {
    padding: clamp(10px, 2.5vw, 12px) clamp(12px, 3vw, 16px);
  }

  .menu-item {
    padding: clamp(10px, 2vw, 12px) clamp(12px, 3vw, 16px);
    font-size: clamp(13px, 2.2vw, 14px);
    gap: clamp(10px, 2vw, 12px);
  }
}

/* Scrollbar styling */
.menu-drawer::-webkit-scrollbar {
  width: 6px;
}

.menu-drawer::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.menu-drawer::-webkit-scrollbar-thumb {
  background: #2E7D6E;
  border-radius: 3px;
}

.menu-drawer::-webkit-scrollbar-thumb:hover {
  background: #1a4a42;
}
</style>
