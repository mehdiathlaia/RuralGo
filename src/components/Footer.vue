<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-grid">
        <!-- Company Info -->
        <div class="footer-section">
          <div class="footer-logo">
            <svg class="logo-icon" viewBox="0 0 24 24">
              <path :d="mdiCar" fill="currentColor" />
            </svg>
            <h3>RURAL-GO VIVA</h3>
          </div>
          <p class="footer-description">
            Mobilitat sostenible per a comunitats rurals. Connectem persones amb transport accessible i de confiança.
          </p>
          <div class="social-links">
            <a href="#" title="Facebook" class="social-link">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.39v-1.2h-2.91v8.5h3.01v-4.42c0-.77.62-1.44 1.24-1.44.4 0 .74.2.88.61.1.3.1.75.1 1.1v4.15h3.01M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69-.93 0-1.69.76-1.69 1.69 0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.5H5.5v8.5h2.77z"/>
              </svg>
            </a>
            <a href="#" title="Twitter" class="social-link">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.56 2.12-2.7-.93.55-1.96.95-3.06 1.17-.88-.93-2.13-1.52-3.51-1.52-2.66 0-4.81 2.15-4.81 4.81 0 .38.04.75.15 1.11-4-.2-7.64-2.14-10.04-5.08-.42.73-.66 1.57-.66 2.46 0 1.67.85 3.14 2.14 4.01-.79-.03-1.54-.24-2.19-.6v.06c0 2.33 1.66 4.28 3.86 4.72-.4.11-.83.17-1.27.17-.31 0-.62-.03-.92-.08.62 1.91 2.4 3.3 4.5 3.34-1.65 1.29-3.73 2.06-5.99 2.06-.39 0-.77-.02-1.15-.07 2.14 1.37 4.68 2.17 7.39 2.17 8.87 0 13.7-7.35 13.7-13.7 0-.21 0-.42-.01-.63.94-.68 1.76-1.53 2.41-2.5z"/>
              </svg>
            </a>
            <a href="#" title="Instagram" class="social-link">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.5 2c-2 0-3.3 1.3-3.3 3.3v8.4c0 2 1.3 3.3 3.3 3.3h8.4c2 0 3.3-1.3 3.3-3.3V7.3c0-2-1.3-3.3-3.3-3.3H7.3m11.7 1.5c.4 0 .8.4.8.8s-.4.8-.8.8-.8-.4-.8-.8.4-.8.8-.8M12 7c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5m0 2c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div class="footer-section">
          <h4>Serveis</h4>
          <ul class="footer-links">
            <li><a href="#services">Transport accessible</a></li>
            <li><a href="#services">Conductors verificats</a></li>
            <li><a href="#services">Disponible 24/7</a></li>
            <li><a href="#services">Preus justos</a></li>
            <li><a href="#services">Comunitat local</a></li>
          </ul>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4>Ràpids</h4>
          <ul class="footer-links">
            <li><router-link to="/">Inici</router-link></li>
            <li><router-link to="/login">Accedir</router-link></li>
            <li><a href="#privacy">Privacitat</a></li>
            <li><a href="#terms">Termes i Condicions</a></li>
            <li><a href="#contact">Contacte</a></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section">
          <h4>Contacte</h4>
          <div class="contact-info">
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              <span>+34 93 XXX XXXX</span>
            </div>
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              <span>info@ruralgoviva.cat</span>
            </div>
            <div class="contact-item">
              <svg class="contact-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
              <span>Sants-Montjuïc, Barcelona</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="newsletter-section">
        <h4>Subscriu-te al nostre butlletí</h4>
        <p>Rebeix les últimes notícies i ofertes especials</p>
        <form @submit.prevent="handleNewsletterSubscribe" class="newsletter-form">
          <input 
            v-model="newsletterEmail" 
            type="email" 
            placeholder="El teu correu electrònic"
            required
          >
          <button type="submit" class="btn btn-primary btn-small">
            Subscriure
          </button>
        </form>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p>&copy; 2024 RURAL-GO VIVA. Tots els drets reservats.</p>
      <div class="footer-badges">
        <span class="badge">🌱 Mobilitat Sostenible</span>
        <span class="badge">♿ Accessible</span>
        <span class="badge">🔒 Segur</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from 'vue';
import { mdiCar } from '@mdi/js';

const newsletterEmail = ref('');

const handleNewsletterSubscribe = () => {
  if (newsletterEmail.value) {
    console.log('Newsletter subscription:', newsletterEmail.value);
    alert('Gràcies per subscriure-te!');
    newsletterEmail.value = '';
  }
};
</script>

<style scoped>
.app-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #1a1a1a 100%);
  color: white;
  margin-top: clamp(40px, 6vw, 80px);
  padding: clamp(30px, 6vw, 60px) clamp(15px, 4vw, 20px) clamp(12px, 2vw, 20px);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(clamp(200px, 100%, 250px), 1fr));
  gap: clamp(20px, 4vw, 40px);
  margin-bottom: clamp(30px, 6vw, 60px);
}

.footer-section {
  flex: 1;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: clamp(8px, 2vw, 10px);
  margin-bottom: clamp(12px, 2vw, 20px);
}

.logo-icon {
  width: clamp(24px, 5vw, 32px);
  height: clamp(24px, 5vw, 32px);
  color: var(--primary-light);
  flex-shrink: 0;
}

.footer-logo h3 {
  font-size: clamp(1.1rem, 3vw, 1.3rem);
  margin: 0;
  color: var(--primary-light);
}

.footer-description {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: clamp(12px, 2vw, 20px);
  line-height: 1.6;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.social-links {
  display: flex;
  gap: clamp(10px, 2vw, 15px);
  flex-wrap: wrap;
}

.social-link {
  width: clamp(36px, 8vw, 40px);
  height: clamp(36px, 8vw, 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  color: white;
  flex-shrink: 0;
}

.social-link:hover {
  background: var(--primary-light);
  color: white;
  transform: translateY(-3px);
}

.social-link svg {
  width: clamp(16px, 3vw, 20px);
  height: clamp(16px, 3vw, 20px);
  flex-shrink: 0;
}

.footer-section h4 {
  font-size: clamp(1rem, 2.5vw, 1.1rem);
  margin-bottom: clamp(12px, 2vw, 20px);
  color: white;
  font-weight: 600;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: clamp(8px, 1.5vw, 12px);
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.footer-links a:hover {
  color: var(--primary-light);
  padding-left: 5px;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vw, 15px);
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: clamp(8px, 1.5vw, 12px);
  color: rgba(255, 255, 255, 0.7);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.contact-icon {
  width: clamp(16px, 3vw, 20px);
  height: clamp(16px, 3vw, 20px);
  color: var(--primary-light);
  flex-shrink: 0;
  margin-top: 2px;
}

.newsletter-section {
  background: rgba(78, 205, 196, 0.1);
  padding: clamp(20px, 4vw, 30px);
  border-radius: 12px;
  margin-bottom: clamp(20px, 3vw, 30px);
  text-align: center;
}

.newsletter-section h4 {
  margin-bottom: clamp(8px, 1.5vw, 10px);
  color: white;
}

.newsletter-section p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: clamp(12px, 2vw, 20px);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
}

.newsletter-form {
  display: flex;
  gap: clamp(8px, 2vw, 10px);
  max-width: 400px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.newsletter-form input {
  flex: 1;
  min-width: clamp(150px, 70%, 200px);
  padding: clamp(8px, 2vw, 12px) clamp(10px, 2vw, 15px);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  box-sizing: border-box;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--primary-light);
  background: rgba(78, 205, 196, 0.1);
}

.btn {
  padding: clamp(8px, 2vw, 12px) clamp(12px, 3vw, 20px);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  white-space: nowrap;
}

.btn-primary {
  background: var(--primary-light);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-color);
  transform: translateY(-2px);
}

.btn-small {
  padding: clamp(8px, 1.5vw, 10px) clamp(12px, 2vw, 20px);
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: clamp(15px, 3vw, 30px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: clamp(10px, 2vw, 20px);
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
  font-size: clamp(0.8rem, 1.8vw, 0.9rem);
}

.footer-badges {
  display: flex;
  gap: clamp(8px, 1.5vw, 10px);
  flex-wrap: wrap;
  justify-content: flex-end;
}

.badge {
  background: rgba(78, 205, 196, 0.2);
  color: var(--primary-light);
  padding: clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px);
  border-radius: 20px;
  font-size: clamp(0.75rem, 1.5vw, 0.85rem);
  font-weight: 500;
  white-space: nowrap;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }

  .footer-badges {
    justify-content: center;
  }

  .newsletter-form {
    flex-direction: column;
    width: 100%;
  }

  .newsletter-form input,
  .newsletter-form button {
    width: 100%;
  }
}
</style>
