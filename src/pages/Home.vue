<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">RURAL-GO VIVA</h1>
          <p class="hero-subtitle">Mobilitat sostenible per a zones rurals</p>
          <p class="hero-description">
            Connectem les comunitats rurals amb transport accessible, segur i de confiança
          </p>
          <div class="hero-buttons">
            <button @click="router.push('/login')" class="btn btn-primary btn-lg">
              Començar
            </button>
            <button @click="scrollToSection('services')" class="btn btn-secondary btn-lg">
              Més informació
            </button>
          </div>
        </div>
        <div class="hero-image">
          <svg viewBox="0 0 400 400" class="hero-svg">
            <circle cx="200" cy="200" r="180" fill="#E8F4F8" opacity="0.3"/>
            <circle cx="200" cy="200" r="140" fill="#4ECDC4" opacity="0.1"/>
            <rect x="150" y="150" width="100" height="80" fill="#2E7D6E" rx="10"/>
            <circle cx="200" cy="140" r="30" fill="#4ECDC4"/>
            <path d="M 160 220 L 140 260 L 180 260 Z" fill="#E74C3C"/>
            <path d="M 240 220 L 220 260 L 260 260 Z" fill="#E74C3C"/>
            <circle cx="170" cy="215" r="8" fill="#1a1a1a"/>
            <circle cx="230" cy="215" r="8" fill="#1a1a1a"/>
          </svg>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="services">
      <div class="container">
        <h2 class="section-title">Garantim</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background: #FF6B6B;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <h3>Transport accessible</h3>
            <p>Vehicles adaptats per a persones amb mobilitat reduïda</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background: #4ECDC4;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h3>Conductors verificats</h3>
            <p>Professionals capacitats i amb seguretat certificada</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background: #FFD93D;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            </div>
            <h3>Disponible 24/7</h3>
            <p>Suport constant per a les teves necessitats de mobilitat</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background: #6BCB77;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 1C5.9 1 1 5.9 1 12s4.9 11 11 11 11-4.9 11-11S18.1 1 12 1m0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9m3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
              </svg>
            </div>
            <h3>Preus justos</h3>
            <p>Tarifes transparents i sense sorpreses</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background: #A8E6CF;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2L2 7V12C2 16.5 3.71 20.8 6.39 24L12 23L17.61 24C20.29 20.8 22 16.5 22 12V7L12 2M10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z"/>
              </svg>
            </div>
            <h3>Seguretat</h3>
            <p>Serveis assegurats i protocols de seguretat</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background: #FF8B94;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m1-13h-2v6h6v-2h-4z"/>
              </svg>
            </div>
            <h3>Comunitat local</h3>
            <p>Suport directe a les zones rurals de Catalunya</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">Com funciona</h2>
        <div class="steps-grid">
          <div class="step">
            <div class="step-number">1</div>
            <h4>Sol·licita el viatge</h4>
            <p>Selecciona origen, destí i data preferida</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <h4>Confirma els detalls</h4>
            <p>Revisa la informació i tria el vehicle</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <h4>Espera el conductor</h4>
            <p>Reben la notificació els conductors propers</p>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <h4>Gaudeix el viatge</h4>
            <p>Transport segur i còmode fins al destí</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container cta-content">
        <h2>Comença ara mateix</h2>
        <p>Uneix-te a milers de persones que confien en RURAL-GO VIVA</p>
        <button @click="router.push('/login')" class="btn btn-primary btn-lg">
          Accedir a l'aplicació
        </button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #ffffff;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: linear-gradient(135deg, #2E7D6E 0%, #1a4a42 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  top: -100px;
  right: -100px;
}

.hero::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 50%;
  bottom: -50px;
  left: -50px;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(30px, 5vw, 60px);
  align-items: center;
  max-width: 1200px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.hero-text {
  animation: slideInLeft 0.8s ease-out;
}

.hero-image {
  animation: slideInRight 0.8s ease-out;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.hero-title {
  font-size: clamp(28px, 8vw, 4rem);
  font-weight: 900;
  margin-bottom: clamp(12px, 2vw, 20px);
  letter-spacing: -2px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #ffffff;
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 40px;
  color: #f0f0f0;
  line-height: 1.8;
}

.hero-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.hero-svg {
  width: 100%;
  max-width: 400px;
  height: auto;
  filter: drop-shadow(0 20px 25px rgba(0, 0, 0, 0.1));
}

/* Features Section */
.features {
  padding: 100px 20px;
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 60px;
  color: #2E7D6E;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.feature-card {
  padding: 40px;
  border-radius: 12px;
  background: white;
  border: 2px solid #e9ecef;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #2E7D6E;
}

.feature-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  color: white;
  font-size: 32px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.feature-icon svg {
  width: 40px;
  height: 40px;
}

.feature-card h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #1a1a1a;
  font-weight: 700;
}

.feature-card p {
  color: #4a5568;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* How it works */
.how-it-works {
  padding: 100px 20px;
  background: #f8f9fa;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.step {
  position: relative;
  padding: 30px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e9ecef;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  border-color: #2E7D6E;
}

.step-number {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #2E7D6E;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(46, 125, 110, 0.3);
}

.step h4 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #1a1a1a;
  font-weight: 700;
}

.step p {
  color: #4a5568;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* CTA Section */
.cta {
  padding: 100px 20px;
  background: linear-gradient(135deg, #2E7D6E 0%, #1a4a42 100%);
  color: white;
  text-align: center;
}

.cta-content {
  max-width: 800px;
}

.cta h2 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.cta p {
  font-size: 1.1rem;
  margin-bottom: 40px;
  color: #f0f0f0;
  line-height: 1.8;
}


/* Button styles */
.btn {
  padding: 12px 30px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1rem;
  display: inline-block;
  text-decoration: none;
  text-align: center;
}

.btn-primary {
  background: #4ECDC4;
  color: #1a1a1a;
  font-weight: 700;
}

.btn-primary:hover {
  background: #2E7D6E;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(46, 125, 110, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
  font-weight: 700;
}

.btn-secondary:hover {
  background: white;
  color: #2E7D6E;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
}

.btn-lg {
  padding: 15px 40px;
  font-size: 1.1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: clamp(20px, 4vw, 40px);
  }

  .hero-buttons {
    width: 100%;
    flex-direction: column;
  }

  .btn-lg {
    width: 100%;
    min-height: 44px;
    min-width: auto;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 0 clamp(10px, 3vw, 15px);
  }

  .btn {
    width: 100%;
    min-height: 44px;
  }

  .btn-lg {
    width: 100%;
  }
}

/* Landscape Mode */
@media (max-height: 500px) and (orientation: landscape) {
  .features {
    padding: clamp(20px, 3vh, 40px) clamp(15px, 4vw, 20px);
  }

  .steps-grid {
    gap: clamp(15px, 2vh, 25px);
  }
}
</style>
