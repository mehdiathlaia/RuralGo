<template>
  <div class="user-menu-container">
    <button 
      class="user-menu-trigger"
      @click="isOpen = !isOpen"
      @blur="isOpen = false"
    >
      <svg class="user-icon" viewBox="0 0 24 24">
        <path :d="mdiAccount" fill="currentColor" />
      </svg>
      <span class="user-name">{{ currentUser?.name || 'Usuari' }}</span>
      <svg class="chevron" :class="{ open: isOpen }" viewBox="0 0 24 24">
        <path :d="mdiChevronDown" fill="currentColor" />
      </svg>
    </button>

    <div v-if="isOpen" class="user-menu-dropdown">
      <div class="menu-header">
        <div class="user-info">
          <div class="avatar">{{ getInitials(currentUser?.name) }}</div>
          <div class="info">
            <div class="name">{{ currentUser?.name }}</div>
            <div class="role">{{ getRoleLabel(userRole) }}</div>
          </div>
        </div>
      </div>

      <div class="menu-divider"></div>

      <div class="menu-items">
        <button @click="navigateToProfile" class="menu-item">
          <svg class="menu-icon" viewBox="0 0 24 24">
            <path :d="mdiCog" fill="currentColor" />
          </svg>
          <span>Perfil</span>
        </button>

        <button @click="navigateToHelp" class="menu-item">
          <svg class="menu-icon" viewBox="0 0 24 24">
            <path :d="mdiHelpCircle" fill="currentColor" />
          </svg>
          <span>Ajuda</span>
        </button>
      </div>

      <div class="menu-divider"></div>

      <div class="menu-items">
        <button @click="handleLogout" class="menu-item logout">
          <svg class="menu-icon" viewBox="0 0 24 24">
            <path :d="mdiLogout" fill="currentColor" />
          </svg>
          <span>Tancar Sessió</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { mdiAccount, mdiChevronDown, mdiCog, mdiHelpCircle, mdiLogout } from '@mdi/js';

const router = useRouter();
const authStore = useAuthStore();

const isOpen = ref(false);
const currentUser = computed(() => authStore.getUser);
const userRole = computed(() => authStore.getUserRole);

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getRoleLabel = (role) => {
  const roles = {
    'client': 'Client',
    'driver': 'Conductor',
    'admin': 'Administrador'
  };
  return roles[role] || role;
};

const handleLogout = async () => {
  try {
    console.log('🚪 Iniciando logout desde UserMenu...');
    isOpen.value = false;
    
    // Ejecutar logout
    authStore.logout();
    console.log('✅ authStore.logout() ejecutado');
    
    // Redirigir
    console.log('🔄 Redirigiendo a home...');
    await router.push({ path: '/' });
    
    // Recargar para asegurar limpieza total
    setTimeout(() => {
      window.location.href = '/';
    }, 500);
  } catch (error) {
    console.error('❌ Error en logout:', error);
    window.location.href = '/';
  }
};

const navigateToProfile = async () => {
  try {
    isOpen.value = false;
    console.log('📋 Navegando a perfil...');
    console.log('Usuario actual:', authStore.getUser);
    await router.push('/profile');
    console.log('✅ Navegación a perfil completada');
  } catch (error) {
    console.error('❌ Error navegando a perfil:', error);
    alert('Error al abrir el perfil. Por favor intenta de nuevo.');
  }
};

const navigateToHelp = async () => {
  isOpen.value = false;
  console.log('❓ Navegando a ajuda...');
  // Por ahora redirige a home, puedes cambiar esto si quieres una página de ayuda
  alert('Sección de Ajuda - Contacta amb el suport: support@ruralgo.com');
};
</script>

<style scoped>
.user-menu-container {
  position: relative;
}

.user-menu-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.user-menu-trigger:hover {
  background: #f8f9fa;
  border-color: #2E7D6E;
  color: #2E7D6E;
}

.user-icon {
  width: 18px;
  height: 18px;
  color: #2E7D6E;
}

.user-name {
  display: none;
}

.chevron {
  width: 16px;
  height: 16px;
  transition: transform 0.3s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.user-menu-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-header {
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.info {
  flex: 1;
  min-width: 0;
}

.name {
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  word-break: break-word;
}

.role {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
  text-transform: capitalize;
}

.menu-divider {
  height: 1px;
  background: #e9ecef;
}

.menu-items {
  padding: 8px 0;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #2c3e50;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  font-family: inherit;
}

.menu-item:hover {
  background: #f8f9fa;
  color: #2E7D6E;
}

.menu-item.logout:hover {
  background: #fee;
  color: #c33;
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: inherit;
}

/* RESPONSIVE */
@media (min-width: 768px) {
  .user-name {
    display: inline;
  }
}

@media (max-width: 768px) {
  .user-menu-dropdown {
    min-width: 240px;
  }

  .user-menu-trigger {
    padding: 6px 10px;
  }

  .avatar {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
}
</style>
