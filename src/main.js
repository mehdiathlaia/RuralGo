import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useNotificationStore } from './store/notificationStore';
import { useAuthStore } from './store/authStore';
import './assets/style.css';
import './assets/responsive-global.css';

async function bootstrap() {
  const app = createApp(App);
  const pinia = createPinia();

  // Pinia must be installed before the router because route guards use the auth store.
  app.use(pinia);

  // Restore the session before installing the router and triggering its first navigation.
  const authStore = useAuthStore();
  await authStore.restoreSession();

  app.use(router);

  // Load persisted notifications after Pinia is ready.
  const notificationStore = useNotificationStore();
  notificationStore.loadFromLocalStorage();

  app.mount('#app');
}

bootstrap().catch((error) => {
  console.error('Failed to initialize RuralGo:', error);
});
