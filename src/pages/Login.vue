<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Left Side: Branding -->
      <div class="auth-branding">
        <svg class="logo-icon" viewBox="0 0 24 24">
          <path :d="mdiCar" fill="currentColor" />
        </svg>
        <h1>RURAL-GO VIVA</h1>
        <p>Mobilitat Rural a l'Abast</p>
        <div class="features">
          <div class="feature">
            <svg class="feature-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            Viatges segurs
          </div>
          <div class="feature">
            <svg class="feature-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            Pagament fàcil
          </div>
          <div class="feature">
            <svg class="feature-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            Conductors verificats
          </div>
          <div class="feature">
            <svg class="feature-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            Suport 24/7
          </div>
        </div>
      </div>

      <!-- Right Side: Auth Form -->
      <div class="auth-card">
        <!-- Tabs -->
        <div class="auth-tabs">
          <button 
            class="tab-btn" 
            :class="{ active: mode === 'login' }"
            @click="mode = 'login'; clearForm();"
          >
            <svg class="tab-icon" viewBox="0 0 24 24">
              <path :d="mdiLock" fill="currentColor" />
            </svg>
            Accés
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: mode === 'register' }"
            @click="mode = 'register'; clearForm();"
          >
            <svg class="tab-icon" viewBox="0 0 24 24">
              <path :d="mdiFileDocument" fill="currentColor" />
            </svg>
            Registre
          </button>
        </div>

        <!-- LOGIN FORM -->
        <form v-if="mode === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <h2>Benvingut de Nou</h2>

          <div v-if="error" class="error-box">
            <svg class="error-icon" viewBox="0 0 24 24">
              <path :d="mdiAlert" fill="currentColor" />
            </svg>
            {{ error }}
          </div>

          <div class="form-group">
            <label>
              <svg class="form-icon" viewBox="0 0 24 24">
                <path :d="mdiEmail" fill="currentColor" />
              </svg>
              Email
            </label>
            <input 
              v-model="loginData.email"
              type="email"
              placeholder="correu@example.com"
              required
            >
          </div>

          <div class="form-group">
            <label>
              <svg class="form-icon" viewBox="0 0 24 24">
                <path :d="mdiLock" fill="currentColor" />
              </svg>
              Contrasenya
            </label>
            <input 
              v-model="loginData.password"
              type="password"
              placeholder="Contrasenya"
              required
            >
          </div>

          <div class="remember-me">
            <label>
              <input v-model="loginData.rememberMe" type="checkbox">
              Recorda'm
            </label>
            <a href="#" class="forgot-link">Contrasenya oblidada?</a>
          </div>

          <button type="submit" class="btn btn-primary">
            Accedir
          </button>

          <p class="switch-text">
            No tens compte? <a @click="mode = 'register'" href="#" class="link">Sol·licita accés aquí</a>
          </p>
        </form>

        <!-- SOLICITUD DE ACCESO -->
        <form v-if="mode === 'register'" @submit.prevent="submitRegistrationRequest" class="auth-form">
          <h2>Sol·licitud de Registre</h2>
          <p class="intro-text">Completa el formulari per sol·licitar accés a RURAL-GO VIVA. La teva sol·licitud serà revisada per l'equip d'administració.</p>

          <!-- Tipus d'usuari -->
          <div class="form-group">
            <label for="userType">Tipus d'Usuari *</label>
            <select v-model="registrationForm.userType" id="userType" required>
              <option value="">Selecciona el teu rol</option>
              <option value="client">Client</option>
              <option value="driver">Conductor</option>
            </select>
          </div>

          <!-- Nom complet -->
          <div class="form-group">
            <label for="regName">Nom Complet *</label>
            <input 
              v-model="registrationForm.name" 
              type="text" 
              id="regName" 
              placeholder="El teu nom complet"
              required
            />
          </div>

          <!-- Email -->
          <div class="form-group">
            <label for="regEmail">Correu *</label>
            <input 
              v-model="registrationForm.email" 
              type="email" 
              id="regEmail" 
              placeholder="correu@example.com"
              required
              @blur="checkEmailExists"
            />
            <span v-if="emailError" class="error-message">{{ emailError }}</span>
          </div>

          <!-- Telèfon -->
          <div class="form-group">
            <label for="regPhone">Telèfon *</label>
            <input 
              v-model="registrationForm.phone" 
              type="tel" 
              id="regPhone" 
              placeholder="+34 XXX XXX XXX"
              required
            />
          </div>

          <!-- DNI -->
          <div class="form-group">
            <label for="regDni">DNI/NIF *</label>
            <input 
              v-model="registrationForm.dni" 
              type="text" 
              id="regDni" 
              placeholder="12345678X"
              required
            />
          </div>

          <!-- Dirección -->
          <!-- Dirección con Google Maps -->
          <div class="form-group">
            <AddressAutocomplete
              v-model="selectedAddress"
              label="Adreça *"
              placeholder="Escriu l'adreça o selecciona del mapa..."
              @update:modelValue="updateAddress"
            />
          </div>

          <!-- Codi Postal (auto-rellenat) -->
          <div class="form-group">
            <label for="regPostal">Codi Postal</label>
            <input 
              v-model="registrationForm.postalCode" 
              type="text" 
              id="regPostal" 
              placeholder="Codi postal"
            />
          </div>

          <!-- Ciutat (auto-rellenada) -->
          <div class="form-group">
            <label for="regCity">Ciutat</label>
            <input 
              v-model="registrationForm.city" 
              type="text" 
              id="regCity" 
              placeholder="Ciutat"
            />
          </div>

          <!-- Tarjeta Sanitaria -->
          <div class="form-group">
            <label for="regHealth">Número de Targeta Sanitària *</label>
            <input 
              v-model="registrationForm.healthCard" 
              type="text" 
              id="regHealth" 
              placeholder="Número de targeta sanitària"
              required
            />
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="form-group">
            <label for="regBirth">Data de Naixement *</label>
            <input 
              v-model="registrationForm.birthDate" 
              type="date" 
              id="regBirth"
              required
            />
          </div>



          <!-- Campos adicionales para conductores -->
          <template v-if="registrationForm.userType === 'driver'">
            <div class="form-group">
              <label for="regLicense">Número de Carnet de Conduir *</label>
              <input 
                v-model="registrationForm.licenseNumber" 
                type="text" 
                id="regLicense" 
                placeholder="Número de carnet"
                required
              />
            </div>

            <div class="form-group">
              <label for="regExpiry">Data d'Expiració del Carnet *</label>
              <input 
                v-model="registrationForm.licenseExpiry" 
                type="date" 
                id="regExpiry"
                required
              />
            </div>


          </template>

          <!-- Comentarios -->
          <div class="form-group">
            <label for="regComments">Comentaris Addicionals</label>
            <textarea 
              v-model="registrationForm.comments" 
              id="regComments" 
              placeholder="Informació adicional que consideris important"
              rows="3"
            ></textarea>
          </div>

          <!-- Aceptación de términos -->
          <div class="checkbox-group">
            <label>
              <input v-model="registrationForm.acceptTerms" type="checkbox" required />
              Accepto els termes i condicions de RURAL-GO VIVA *
            </label>
          </div>

          <!-- Botones -->
          <div class="form-actions" style="gap: 10px;">
            <button type="button" @click="mode = 'login'" class="btn btn-secondary">
              Enrere
            </button>
            <button type="submit" class="btn btn-primary">
              Enviar Sol·licitud
            </button>
          </div>

          <p v-if="registrationSuccess" class="success-box">
            <svg class="success-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            {{ registrationSuccess }}
          </p>
        </form>

        <!-- DEMO USERS SECTION -->
        <div class="demo-section">
          <div class="demo-header">
            <svg class="demo-title-icon" viewBox="0 0 24 24">
              <path :d="mdiTarget" fill="currentColor" />
            </svg>
            <h3>Usuaris de Demostració</h3>
          </div>
          <p class="demo-subtitle">Clica per accedir immediatament:</p>
          
          <div class="demo-buttons">
            <button @click="quickLogin('maria@example.com', 'pass123')" class="btn-demo btn-demo-client">
              <svg class="demo-user-icon" viewBox="0 0 24 24">
                <path :d="mdiAccount" fill="currentColor" />
              </svg>
              <span class="text">
                <strong>Maria García</strong>
                <small>Client</small>
              </span>
            </button>
            
            <button @click="quickLogin('joan@example.com', 'pass123')" class="btn-demo btn-demo-driver">
              <svg class="demo-user-icon" viewBox="0 0 24 24">
                <path :d="mdiAccount" fill="currentColor" />
              </svg>
              <span class="text">
                <strong>Joan Riera</strong>
                <small>Conductor</small>
              </span>
            </button>

            <button @click="quickLogin('admin@ruralgo.com', 'admin123')" class="btn-demo btn-demo-admin">
              <svg class="demo-user-icon" viewBox="0 0 24 24">
                <path :d="mdiCog" fill="currentColor" />
              </svg>
              <span class="text">
                <strong>Administrador</strong>
                <small>Panel Admin</small>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useRegistrationStore } from '../store/registrationStore';
import { mdiCar, mdiCheck, mdiLock, mdiFileDocument, mdiAlert, mdiAccount, mdiAccountMultiple, mdiEmail, mdiTarget, mdiCog } from '@mdi/js';
import AddressAutocomplete from '../components/AddressAutocomplete.vue';

const router = useRouter();
const authStore = useAuthStore();
const registrationStore = useRegistrationStore();

const mode = ref('login');
const error = ref('');
const emailError = ref('');
const registrationSuccess = ref('');
const selectedAddress = ref(null);

const loginData = ref({
  email: '',
  password: '',
  rememberMe: false
});

const registrationForm = ref({
  userType: '',
  name: '',
  email: '',
  phone: '',
  dni: '',
  address: '',
  postalCode: '',
  city: '',
  healthCard: '',
  birthDate: '',
  licenseNumber: '',
  licenseExpiry: '',
  comments: '',
  acceptTerms: false
});

const clearForm = () => {
  error.value = '';
  loginData.value = { email: '', password: '', rememberMe: false };
};

const checkEmailExists = () => {
  if (registrationForm.value.email && registrationStore.emailExists(registrationForm.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en proces de revisió';
  } else {
    emailError.value = '';
  }
};

const updateAddress = (address) => {
  if (address) {
    console.log('📍 Adreça seleccionada:', address);
    registrationForm.value.address = address.description || address.fullAddress || address.name || '';
    
    // Assegurar-se que els camps postalCode i city es rellenen correctament
    registrationForm.value.postalCode = address.postalCode || '';
    registrationForm.value.city = address.city || '';
    
    console.log('✅ Formulari actualitzat:', {
      address: registrationForm.value.address,
      postalCode: registrationForm.value.postalCode,
      city: registrationForm.value.city,
      addressObject: address
    });
  }
};

const submitRegistrationRequest = () => {
  if (!registrationForm.value.acceptTerms) {
    alert('Has d\'acceptar els termes i condicions');
    return;
  }

  if (!selectedAddress.value) {
    alert('Si us plau, selecciona una adreça del llistat');
    return;
  }

  if (registrationStore.emailExists(registrationForm.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en proces de revisió';
    return;
  }

  try {
    const request = registrationStore.createRegistrationRequest({
      userType: registrationForm.value.userType,
      name: registrationForm.value.name,
      email: registrationForm.value.email,
      phone: registrationForm.value.phone,
      dni: registrationForm.value.dni,
      address: registrationForm.value.address,
      postalCode: registrationForm.value.postalCode,
      city: registrationForm.value.city,
      healthCard: registrationForm.value.healthCard,
      birthDate: registrationForm.value.birthDate,
      licenseNumber: registrationForm.value.licenseNumber,
      licenseExpiry: registrationForm.value.licenseExpiry,
      comments: registrationForm.value.comments
    });

    registrationSuccess.value = `✓ Sol·licitud enviada! El teu ID de sol·licitud és: ${request.id}. Rebràs un correu amb la resolució en breu.`;

    setTimeout(() => {
      registrationForm.value = {
        userType: '',
        name: '',
        email: '',
        phone: '',
        dni: '',
        address: '',
        postalCode: '',
        city: '',
        healthCard: '',
        birthDate: '',
        licenseNumber: '',
        licenseExpiry: '',
        comments: '',
        acceptTerms: false
      };
      registrationSuccess.value = '';
      mode.value = 'login';
    }, 3000);
  } catch (err) {
    alert('Error en enviar la sol·licitud. Si us plau intenta de nou.');
  }
};

const handleLogin = () => {
  error.value = '';
  
  if (!loginData.value.email || !loginData.value.password) {
    error.value = 'Completa tots els camps';
    return;
  }

  // Usar authStore.login() que ja gestiona tot correctament
  const success = authStore.login(loginData.value.email, loginData.value.password);
  
  if (!success) {
    error.value = authStore.loginError || 'Correu o contrasenya incorrectes';
    return;
  }
  
  // Redirect correcte basant-se en el role de l'usuari
  if (authStore.userRole === 'admin') {
    router.push('/admin/registrations');
  } else if (authStore.userRole === 'driver') {
    router.push('/driver-dashboard');
  } else {
    router.push('/planification');
  }
};

const handleRegister = () => {
  error.value = '';

  if (!registerData.value.fullName || !registerData.value.email || !registerData.value.phone) {
    error.value = 'Completa tots els camps obligatoris';
    return;
  }

  if (registerData.value.password.length < 8) {
    error.value = 'La contrasenya ha de tenir mínim 8 caràcters';
    return;
  }

  if (registerData.value.password !== registerData.value.confirmPassword) {
    error.value = 'Les contrasenyes no coincideixen';
    return;
  }

  if (!registerData.value.acceptTerms || !registerData.value.acceptPrivacy) {
    error.value = 'Has d\'acceptar els Termes i la Privacitat';
    return;
  }
};

const quickLogin = (email, password) => {
  loginData.value = { email, password, rememberMe: false };
  setTimeout(() => handleLogin(), 100);
};
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  max-width: 900px;
  width: 100%;
  align-items: center;
}

.auth-branding {
  color: white;
  text-align: center;
}

.logo-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px auto;
  color: #4ECDC4;
}

.auth-branding h1 {
  font-size: 36px;
  margin: 10px 0;
}

.auth-branding p {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 30px;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  text-align: left;
}

.feature {
  font-size: 16px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: #4ECDC4;
}

.tab-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.form-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-right: 6px;
  vertical-align: middle;
}

.error-icon,
.success-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  margin-right: 8px;
  vertical-align: middle;
}

.demo-user-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.auth-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.auth-tabs {
  display: flex;
  background: #f8f9fa;
  border-bottom: 2px solid #e9ecef;
}

.tab-btn {
  flex: 1;
  padding: 16px;
  border: none;
  background: transparent;
  color: #555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.tab-btn:hover {
  background: #e9ecef;
}

.tab-btn.active {
  color: #4ECDC4;
  border-bottom-color: #4ECDC4;
}

.auth-form {
  padding: 40px;
}

.auth-form h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 25px;
  text-align: center;
}

.error-box {
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.demo-box {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.demo-box p {
  margin: 0 0 10px 0;
  font-weight: 600;
  font-size: 13px;
  color: #b45309;
}

.demo-btn {
  display: block;
  width: 100%;
  padding: 10px;
  background: #fcd34d;
  color: #b45309;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.demo-btn:last-child {
  margin-bottom: 0;
}

.demo-btn:hover {
  background: #fbbf24;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4ECDC4;
  box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.1);
}

.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 13px;
}

.remember-me label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin: 0;
  font-weight: normal;
  color: #555;
}

.forgot-link {
  color: #4ECDC4;
  text-decoration: none;
  font-weight: 600;
}

.forgot-link:hover {
  text-decoration: underline;
}

.account-type {
  margin-bottom: 20px;
}

.account-type label {
  display: block;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 14px;
}

.type-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.type-btn {
  padding: 12px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: #555;
  transition: all 0.3s;
}

.type-btn:hover {
  border-color: #4ECDC4;
  background: #f0f9fc;
}

.type-btn.selected {
  border-color: #4ECDC4;
  background: #f0f9fc;
  color: #4ECDC4;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: normal;
  font-size: 13px;
  color: #555;
  cursor: pointer;
  margin: 0;
}

.checkbox-group input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: #e9ecef;
  color: #555;
}

.btn-secondary:hover {
  background: #dee2e6;
  transform: translateY(-2px);
}

.switch-text {
  text-align: center;
  margin-top: 15px;
  font-size: 13px;
  color: #555;
}

.link {
  color: #4ECDC4;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

/* Demo Section */
.demo-section {
  margin-top: 25px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px dashed #2E7D6E;
}

.demo-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.demo-title-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: #2E7D6E;
}

.demo-section h3 {
  margin: 0;
  font-size: 14px;
  color: #2E7D6E;
  font-weight: 700;
}

.demo-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0 0 15px 0;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-demo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 2px solid transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: white;
  color: #333;
}

.btn-demo:hover {
  transform: translateX(4px);
}

.btn-demo .icon {
  font-size: 20px;
  min-width: 30px;
  text-align: center;
}

.btn-demo .text {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.btn-demo strong {
  font-size: 13px;
  color: #1a1a1a;
}

.btn-demo small {
  font-size: 11px;
  color: #999;
  font-weight: 400;
}

.btn-demo-client {
  border-left: 4px solid #3498db;
}

.btn-demo-client:hover {
  background: #ebf8ff;
}

.btn-demo-driver {
  border-left: 4px solid #f39c12;
}

.btn-demo-driver:hover {
  background: #fff4e6;
}

.btn-demo-admin {
  border-left: 4px solid #27ae60;
}

.btn-demo-admin:hover {
  background: #e8f8f0;
}

@media (max-width: 768px) {
  .auth-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .auth-branding {
    display: none;
  }

  .auth-form {
    padding: 25px;
  }

  .type-buttons {
    grid-template-columns: 1fr;
  }

  .auth-tabs {
    flex-direction: column;
  }

  .tab-btn {
    border-bottom: none;
    border-right: 3px solid transparent;
  }

  .tab-btn.active {
    border-right-color: #4ECDC4;
    border-bottom-color: transparent;
  }
}
</style>
