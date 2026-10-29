<template>
  <div class="checkout-container">
    <!-- Header -->
    <div class="header">
      <button @click="goBack" class="back-btn">← Enrere</button>
      <h1><svg class="header-icon" viewBox="0 0 24 24"><path :d="mdiCreditCard" fill="currentColor" /></svg> Pagament del Viatge</h1>
    </div>

    <div class="checkout-content">
      <!-- Steps Progress -->
      <div class="steps">
        <div class="step" :class="{ active: currentStep === 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <div class="step-label">Resum</div>
        </div>
        <div class="step-connector" :class="{ completed: currentStep > 1 }"></div>
        
        <div class="step" :class="{ active: currentStep === 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <div class="step-label">Pagament</div>
        </div>
        <div class="step-connector" :class="{ completed: currentStep > 2 }"></div>
        
        <div class="step" :class="{ active: currentStep === 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <div class="step-label">Confirmació</div>
        </div>
      </div>

      <!-- Step 1: Summary -->
      <div v-if="currentStep === 1" class="step-content">
        <h2>Resum del Viatge</h2>

        <div class="trip-summary">
          <div class="summary-section">
            <h3><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiMapMarker" fill="currentColor" /></svg> Ruta</h3>
            <div class="summary-row">
              <span class="label">Origen:</span>
              <span class="value">Carrer Principal, 123</span>
            </div>
            <div class="summary-row">
              <span class="label">Destí:</span>
              <span class="value">Hospital Clínic</span>
            </div>
            <div class="summary-row">
              <span class="label">Distància:</span>
              <span class="value">5.2 km</span>
            </div>
            <div class="summary-row">
              <span class="label">Durada:</span>
              <span class="value">~12 minuts</span>
            </div>
          </div>

          <div class="summary-section">
            <h3><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiTarget" fill="currentColor" /></svg> Servei</h3>
            <div class="summary-row">
              <span class="label">Tipus:</span>
              <span class="value">Serveis Sanitaris</span>
            </div>
            <div class="summary-row">
              <span class="label">Vehicle:</span>
              <span class="value">Adaptat</span>
            </div>
            <div class="summary-row">
              <span class="label">Camí:</span>
              <span class="value urban">Via urbana</span>
            </div>
          </div>

          <div class="summary-section">
            <h3><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiAccountCircle" fill="currentColor" /></svg> Conductor</h3>
            <div class="driver-card">
              <div class="driver-avatar"><svg viewBox="0 0 24 24"><path :d="mdiAccountCircle" fill="currentColor" /></svg></div>
              <div class="driver-details">
                <h4>Maria López García</h4>
                <p><svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiStar" fill="currentColor" /></svg> 4.9/5 (287 valoracions)</p>
                <p><svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiCar" fill="currentColor" /></svg> Mercedes Vito Adapted</p>
              </div>
            </div>
          </div>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 2" class="btn btn-primary">Continuar → Pagament</button>
        </div>
      </div>

      <!-- Step 2: Payment -->
      <div v-if="currentStep === 2" class="step-content">
        <h2>Mètode de Pagament</h2>

        <div class="payment-methods-selection">
          <div 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="payment-option"
            :class="{ selected: selectedPayment === method.id }"
            @click="selectedPayment = method.id"
          >
            <div class="payment-header">
              <input type="radio" :checked="selectedPayment === method.id">
              <span class="icon">{{ method.icon }}</span>
              <span class="name">{{ method.name }}</span>
            </div>
            <div class="payment-detail">{{ method.detail }}</div>
          </div>
        </div>

        <button @click="showAddCard = true" class="btn btn-secondary" style="width: 100%; margin-top: 20px;">
          + Afegir Targeta Nova
        </button>

        <div class="step-actions">
          <button @click="currentStep = 1" class="btn btn-secondary">← Enrere</button>
          <button @click="currentStep = 3" class="btn btn-primary">Continuar → Revisió</button>
        </div>
      </div>

      <!-- Step 3: Confirmation -->
      <div v-if="currentStep === 3" class="step-content">
        <h2>Revisió Final</h2>

        <div class="price-breakdown">
          <h3><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiCreditCard" fill="currentColor" /></svg> Desglosament</h3>
          <div class="breakdown-row">
            <span>Tarifa Base:</span>
            <span>€3.50</span>
          </div>
          <div class="breakdown-row">
            <span>Distància (5.2 km × €0.85):</span>
            <span>€4.42</span>
          </div>
          <div class="breakdown-row">
            <span>Recàrrec Vehicle Adaptat:</span>
            <span>€2.50</span>
          </div>
          <div class="breakdown-row total">
            <span>Total:</span>
            <span>€10.42</span>
          </div>
        </div>

        <div class="selected-method">
          <h3><svg class="section-icon" viewBox="0 0 24 24"><path :d="mdiCreditCard" fill="currentColor" /></svg> Pagament: <svg class="inline-icon" viewBox="0 0 24 24"><path :d="mdiCreditCard" fill="currentColor" /></svg> Targeta Crèdit</h3>
          <p>**** **** **** 1234</p>
        </div>

        <div class="terms-check">
          <label>
            <input v-model="acceptTerms" type="checkbox">
            Accepto els Termes i Condicions
          </label>
        </div>

        <div class="step-actions">
          <button @click="currentStep = 2" class="btn btn-secondary">← Enrere</button>
          <button @click="processPayment" class="btn btn-success" :disabled="!acceptTerms">
            <svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiCheckCircle" fill="currentColor" /></svg> Confirmar (€10.42)
          </button>
        </div>
      </div>

      <!-- Success Screen -->
      <div v-if="paymentSuccess" class="success-overlay">
        <div class="success-box">
          <div class="success-icon"><svg viewBox="0 0 24 24"><path :d="mdiCheckCircle" fill="currentColor" /></svg></div>
          <h2>Pagament Completat!</h2>
          <p>Confirmació: <strong>#{{ confirmationCode }}</strong></p>
          <p class="subtitle">El viatge s'ha assignat. Rebràs actualitzacions en temps real.</p>
          <button @click="goToDashboard" class="btn btn-primary">
            <svg class="btn-icon" viewBox="0 0 24 24"><path :d="mdiCar" fill="currentColor" /></svg> Veure Viatge
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { mdiCreditCard, mdiMapMarker, mdiTarget, mdiAccountCircle, mdiStar, mdiCar, mdiCheckCircle } from '@mdi/js'

const router = useRouter();
const currentStep = ref(1);
const selectedPayment = ref(1);
const acceptTerms = ref(false);
const paymentSuccess = ref(false);
const confirmationCode = ref('');
const showAddCard = ref(false);

const paymentMethods = ref([
  { id: 1, name: 'Targeta Crèdit', icon: 'credit-card', detail: '**** **** **** 1234 (05/26)' },
  { id: 2, name: 'Targeta Dèbit', icon: 'credit-card', detail: '**** **** **** 5678 (08/25)' },
  { id: 3, name: 'PayPal', icon: 'paypal', detail: 'joan@example.com' },
  { id: 4, name: 'Apple Pay', icon: 'apple', detail: 'Configurat' }
]);

const processPayment = () => {
  confirmationCode.value = Math.random().toString(36).substr(2, 10).toUpperCase();
  paymentSuccess.value = true;
};

const goBack = () => router.back();
const goToDashboard = () => router.push('/client-dashboard');
</script>

<style scoped>
.checkout-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 20px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.back-btn {
  padding: 10px 20px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #e0e0e0;
}

.header h1 {
  margin: 0;
  color: #2c3e50;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 28px;
  height: 28px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.checkout-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0.4;
}

.step.active,
.step.completed {
  opacity: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}

.step.active .step-number {
  background: #4ECDC4;
  color: white;
}

.step.completed .step-number {
  background: #27ae60;
  color: white;
}

.step-label {
  font-size: 12px;
  font-weight: 600;
}

.step-connector {
  width: 40px;
  height: 2px;
  background: #e9ecef;
}

.step-connector.completed {
  background: #27ae60;
}

.step-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.step-content h2 {
  color: #2c3e50;
  margin-top: 0;
  border-bottom: 2px solid #4ECDC4;
  padding-bottom: 15px;
}

.trip-summary {
  display: grid;
  gap: 20px;
  margin-bottom: 30px;
}

.summary-section {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #4ECDC4;
}

.summary-section h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-icon {
  width: 20px;
  height: 20px;
  color: #4ECDC4;
  flex-shrink: 0;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
}

.summary-row:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #2c3e50;
}

.value {
  color: #555;
}

.value.urban {
  color: #27ae60;
}

.driver-card {
  background: white;
  padding: 12px;
  border-radius: 6px;
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.driver-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4ECDC4;
}

.driver-details h4 {
  margin: 0;
  color: #2c3e50;
  font-size: 14px;
}

.driver-details p {
  margin: 4px 0;
  font-size: 12px;
  color: #555;
  display: flex;
  align-items: center;
  gap: 6px;
}

.inline-icon {
  width: 14px;
  height: 14px;
  color: #f39c12;
  flex-shrink: 0;
}

.payment-methods-selection {
  display: grid;
  gap: 12px;
  margin-bottom: 20px;
}

.payment-option {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.payment-option:hover {
  border-color: #4ECDC4;
}

.payment-option.selected {
  border-color: #4ECDC4;
  background: #f0f9fc;
}

.payment-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.payment-header input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.icon {
  font-size: 20px;
}

.name {
  font-weight: 600;
  color: #2c3e50;
}

.payment-detail {
  margin-left: 28px;
  font-size: 12px;
  color: #555;
}

.price-breakdown {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #4ECDC4;
}

.price-breakdown h3 {
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.breakdown-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #e9ecef;
}

.breakdown-row.total {
  border-bottom: none;
  padding-top: 10px;
  margin-top: 10px;
  border-top: 2px solid #e9ecef;
  font-weight: 700;
  color: #2c3e50;
  font-size: 16px;
}

.selected-method {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.selected-method h3 {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.selected-method p {
  margin: 0;
  font-size: 13px;
  opacity: 0.9;
}

.terms-check {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.terms-check label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  cursor: pointer;
  margin: 0;
}

.terms-check input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.step-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #44A08D;
  transform: translateY(-2px);
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e9ecef;
  color: #555;
}

.btn-secondary:hover {
  background: #d9dde2;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #229954;
  transform: translateY(-2px);
}

.btn-success:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
  z-index: 1000;
}

.success-box {
  text-align: center;
  padding: 40px;
}

.success-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #27ae60;
  margin: 0 auto 20px;
  animation: bounce 0.6s;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.success-box h2 {
  color: #27ae60;
  margin-bottom: 10px;
}

.success-box p {
  color: #555;
  margin: 8px 0;
  font-size: 14px;
}

.subtitle {
  color: #7f8c8d;
  font-size: 13px !important;
}

@media (max-width: 768px) {
  .steps {
    gap: 10px;
  }

  .step-connector {
    width: 10px;
  }

  .step-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
