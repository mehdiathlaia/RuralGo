import { createRouter, createWebHistory } from 'vue-router';

import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import RegisterRequest from '../pages/RegisterRequest.vue';
import AdminPanel from '../pages/AdminPanel.vue';
import Profile from '../pages/Profile.vue';
import ClientDashboard from '../pages/ClientDashboard.vue';
import DriverDashboard from '../pages/DriverDashboard.vue';
import Planification from '../pages/Planification.vue';
import MyTrips from '../pages/MyTrips.vue';
import Emergency from '../pages/Emergency.vue';
import Checkout from '../pages/Checkout.vue';
import Rating from '../pages/Rating.vue';
import Ratings from '../pages/Ratings.vue';
import DomusViva from '../pages/DomusViva.vue';
import AdvancedAnalytics from '../pages/AdvancedAnalytics.vue';
import History from '../pages/History.vue';
import Services from '../pages/Services.vue';
import Demo from '../pages/Demo.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    // Helpful aliases to avoid blank pages on unknown paths used by buttons
    { path: '/home', redirect: '/' },
    { path: '/admin', redirect: '/admin/registrations' },
    { path: '/login', component: Login },
    { path: '/register-request', component: RegisterRequest },
    { path: '/admin/registrations', component: AdminPanel, meta: { requiresAuth: true, requiredRole: 'admin' } },
    { path: '/demo', component: Demo }, // Demo panel accessible
    { path: '/profile', component: Profile, meta: { requiresAuth: true } },
    { path: '/services', component: Services, meta: { requiresAuth: false } },
    
    // Client only routes
    { path: '/planification', component: Planification, meta: { requiresAuth: true, requiredRole: 'client' } },
    { path: '/my-trips', component: MyTrips, meta: { requiresAuth: true, requiredRole: 'client' } },
    { path: '/client-dashboard', component: ClientDashboard, meta: { requiresAuth: true, requiredRole: 'client' } },
    { path: '/rating', component: Rating, meta: { requiresAuth: true, requiredRole: 'client' } },
    
    // Driver only routes
    { path: '/driver-dashboard', component: DriverDashboard, meta: { requiresAuth: true, requiredRole: 'driver' } },
    { path: '/history', component: History, meta: { requiresAuth: true, requiredRole: 'driver' } },
    
    // All authenticated users
    { path: '/emergency', component: Emergency, meta: { requiresAuth: true } },
    { path: '/checkout', component: Checkout, meta: { requiresAuth: true } },
    { path: '/ratings', component: Ratings, meta: { requiresAuth: true } },
    { path: '/domus-viva', component: DomusViva, meta: { requiresAuth: true } },
    { path: '/analytics', component: AdvancedAnalytics, meta: { requiresAuth: true } },
    // Catch-all: redirect any unknown route to home to avoid blank page
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
});

// Route guards - TEMPORALMENTE DESACTIVADO PARA DEBUGGING
/*
router.beforeEach(async (to, from, next) => {
  // Import dinàmic per evitar dependències circulars
  const { useAuthStore } = await import('../store/authStore');
  const authStore = useAuthStore();
  
  // Verificar autenticación
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login');
    return;
  }
  
  // Verificar rol requerido
  if (to.meta.requiredRole && authStore.userRole !== to.meta.requiredRole) {
    // Si no tiene el rol correcto, redirigir a home
    next('/');
    return;
  }
  
  next();
});
*/

export default router;
