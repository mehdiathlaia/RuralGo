import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import { useNotificationStore } from './store/notificationStore';
import { useAuthStore } from './store/authStore';
import './assets/style.css';
import './assets/responsive-global.css';

const app = createApp(App);
const pinia = createPinia();

// IMPORTANTE: Pinia DEBE ir primero antes que router
// porque el router guard intenta usar useAuthStore()
app.use(pinia);

// Restore the user session before the router performs its first navigation.
const authStore = useAuthStore();
await authStore.restoreSession();

app.use(router);

// Cargar datos guardados en localStorage cuando se inicializa la app
const notificationStore = useNotificationStore();
notificationStore.loadFromLocalStorage();

app.mount('#app');

