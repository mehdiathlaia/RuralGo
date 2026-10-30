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
        <form v-if="recoveryMode === 'forgot'" @submit.prevent="requestPasswordReset" class="auth-form">
          <h2>Recupera la contrasenya</h2>
          <p class="intro-text">Introdueix el correu del teu compte i t’enviarem un enllaç segur.</p>
          <div v-if="recoveryError" class="error-box" role="alert">{{ recoveryError }}</div>
          <div v-if="recoveryMessage" class="success-box" role="status">{{ recoveryMessage }}</div>
          <div class="form-group">
            <label for="recoveryEmail">Correu electrònic</label>
            <input id="recoveryEmail" v-model="recoveryEmail" type="email" autocomplete="email" required placeholder="nom@exemple.cat">
          </div>
          <button class="btn btn-primary" type="submit" :disabled="recoveryLoading">{{ recoveryLoading ? 'Enviant…' : 'Enviar l’enllaç' }}</button>
          <button class="btn btn-secondary recovery-back" type="button" @click="recoveryMode = ''">Tornar a l’inici de sessió</button>
        </form>

        <form v-else-if="recoveryMode === 'reset'" @submit.prevent="resetPassword" class="auth-form">
          <h2>Tria una contrasenya nova</h2>
          <p class="intro-text">Fes servir almenys 10 caràcters.</p>
          <div v-if="recoveryError" class="error-box" role="alert">{{ recoveryError }}</div>
          <div v-if="recoveryMessage" class="success-box" role="status">{{ recoveryMessage }}</div>
          <div class="form-group">
            <label for="newPassword">Contrasenya nova</label>
            <input id="newPassword" v-model="recoveryPassword" type="password" autocomplete="new-password" minlength="10" required>
          </div>
          <button class="btn btn-primary" type="submit" :disabled="recoveryLoading">{{ recoveryLoading ? 'Desant…' : 'Desar la contrasenya' }}</button>
        </form>

        <div v-else-if="recoveryMode === 'done'" class="auth-form recovery-complete">
          <h2>Contrasenya actualitzada</h2>
          <p class="success-box" role="status">{{ recoveryMessage }}</p>
          <button class="btn btn-primary" type="button" @click="recoveryMode = ''; recoveryMessage = ''">Torna a iniciar la sessió</button>
        </div>

        <form v-else-if="mode === 'login'" @submit.prevent="handleLogin" class="auth-form">
          <h2>Benvingut/da a RuralGo</h2>

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
            <button type="button" class="forgot-link" @click="recoveryMode = 'forgot'; recoveryEmail = loginData.email; recoveryError = ''; recoveryMessage = ''">He oblidat la contrasenya</button>
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
          <h2>Sol·licitud d’alta</h2>
          <p class="intro-text">Completa el formulari per sol·licitar accés a RURAL-GO VIVA. La teva sol·licitud serà revisada per l'equip d'administració.</p>

          <!-- Tipus d'usuari -->
          <div class="form-group">
            <label for="userType">Tipus d’usuari *</label>
            <select v-model="registrationForm.userType" id="userType" required>
              <option value="">Selecciona el teu rol</option>
              <option value="client">Client</option>
              <option value="driver">Conductor</option>
            </select>
          </div>

          <!-- Nom complet -->
          <div class="form-group">
            <label for="regName">Nom complet *</label>
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
            <label for="regEmail">Correu electrònic *</label>
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

          <!-- Adreça: camp de text lliure, sense mapa ni selecció externa -->
          <div class="form-group">
            <label for="regAddress">Adreça *</label>
            <input
              v-model="registrationForm.address"
              type="text"
              id="regAddress"
              placeholder="Carrer, número, pis"
              required
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
            <label for="regHealth">Número de targeta sanitària *</label>
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
            <label for="regBirth">Data de naixement *</label>
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
            <label for="regComments">Comentaris addicionals</label>
            <textarea 
              v-model="registrationForm.comments" 
              id="regComments" 
              placeholder="Informació addicional que consideris important"
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
            <button type="submit" class="btn btn-primary">
              Envia la sol·licitud
            </button>
            <button type="button" @click="mode = 'login'" class="btn btn-secondary">
              Enrere
            </button>
          </div>

          <p v-if="registrationSuccess" class="success-box">
            <svg class="success-icon" viewBox="0 0 24 24">
              <path :d="mdiCheck" fill="currentColor" />
            </svg>
            {{ registrationSuccess }}
          </p>
        </form>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../store/authStore';
import { useRegistrationStore } from '../store/registrationStore';
import { mdiCar, mdiCheck, mdiLock, mdiFileDocument, mdiAlert, mdiEmail } from '@mdi/js';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const registrationStore = useRegistrationStore();

const mode = ref('login');
const error = ref('');
const emailError = ref('');
const registrationSuccess = ref('');
const recoveryMode = ref(route.query.resetToken ? 'reset' : '');
const recoveryEmail = ref('');
const recoveryToken = ref(String(route.query.resetToken || ''));
const recoveryPassword = ref('');
const recoveryMessage = ref('');
const recoveryError = ref('');
const recoveryLoading = ref(false);

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


const API_URL = 'https://ruralgo-backend-ighg.onrender.com';

const requestPasswordReset = async () => {
  recoveryError.value = '';
  recoveryMessage.value = '';
  recoveryLoading.value = true;
  try {
    const response = await fetch(API_URL + '/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: recoveryEmail.value.trim() })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'No s’ha pogut enviar la sol·licitud.');
    recoveryMessage.value = result.message;
  } catch (err) {
    recoveryError.value = err.message || 'Error de connexió. Torna-ho a provar.';
  } finally {
    recoveryLoading.value = false;
  }
};

const resetPassword = async () => {
  recoveryError.value = '';
  recoveryMessage.value = '';
  if (recoveryPassword.value.length < 10) {
    recoveryError.value = 'La contrasenya ha de tenir almenys 10 caràcters.';
    return;
  }
  recoveryLoading.value = true;
  try {
    const response = await fetch(API_URL + '/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: recoveryToken.value, password: recoveryPassword.value })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'No s’ha pogut actualitzar la contrasenya.');
    recoveryMessage.value = result.message;
    recoveryMode.value = 'done';
    recoveryPassword.value = '';
    window.history.replaceState({}, '', '/login');
  } catch (err) {
    recoveryError.value = err.message || 'Error de connexió. Torna-ho a provar.';
  } finally {
    recoveryLoading.value = false;
  }
};

const clearForm = () => {
  error.value = '';
  loginData.value = { email: '', password: '', rememberMe: false };
};

const checkEmailExists = () => {
  if (registrationForm.value.email && registrationStore.emailExists(registrationForm.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en procés de revisió';
  } else {
    emailError.value = '';
  }
};

const submitRegistrationRequest = async () => {
  if (!registrationForm.value.acceptTerms) {
    alert('Has d\'acceptar els termes i condicions');
    return;
  }

  if (registrationStore.emailExists(registrationForm.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en proces de revisió';
    return;
  }

  try {
    const request = await registrationStore.createRegistrationRequest({
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
    console.error('Error en enviar la sol·licitud:', err);
    alert(err?.message || 'No s’ha pogut connectar amb el servidor. Comprova la connexió i torna-ho a provar.');
  }
};

const handleLogin = async () => {
  error.value = '';
  
  if (!loginData.value.email || !loginData.value.password) {
    error.value = 'Completa tots els camps obligatoris';
    return;
  }

  // Usar authStore.login() que ja gestiona tot correctament
  const success = await authStore.login(loginData.value.email, loginData.value.password);
  
  if (!success) {
    error.value = authStore.loginError || 'Correu o contrasenya incorrectes';
    return;
  }
  
  // Redirecció segons el perfil de l’usuari
  if (authStore.userRole === 'admin') {
    router.push('/admin/registrations');
  } else if (authStore.userRole === 'driver') {
    router.push(route.query.redirect || '/driver-dashboard');
  } else {
    router.push(route.query.redirect || '/planification');
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

</script>

<style scoped>
.auth-page {
  background-image: radial-gradient(circle at 15% 15%, rgba(255,255,255,.12), transparent 32%), linear-gradient(135deg, #1f6b5b 0%, #123f37 100%);
  min-height: 100vh;
  background: linear-gradient(135deg, #1f6b5b 0%, #123f37 100%);
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
  color: #45b69c;
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
  color: #45b69c;
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
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 24px 70px rgba(10, 45, 36, 0.22);
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
  color: #45b69c;
  border-bottom-color: #45b69c;
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
  border-color: #45b69c;
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
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font: inherit;
  color: #45b69c;
  text-decoration: none;
  font-weight: 600;
}

.forgot-link:hover {
  text-decoration: underline;
}

.recovery-back { margin-top: 10px; }
.recovery-complete { text-align: center; }

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
  border-color: #45b69c;
  background: #f0f9fc;
}

.type-btn.selected {
  border-color: #45b69c;
  background: #f0f9fc;
  color: #45b69c;
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
  background: linear-gradient(135deg, #1f6b5b 0%, #123f37 100%);
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
  color: #45b69c;
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
    border-right-color: #45b69c;
    border-bottom-color: transparent;
  }
}
</style>
