<template>
  <div class="register-request-container">
    <div class="register-request-card">
      <h1>Solicitud de Registre</h1>
      <p class="intro-text">Completa el formulari per a sol·licitar l'accés a RURAL-GO VIVA. La teva sol·licitud serà revisada pel nostre equip d'administració.</p>

      <form @submit.prevent="submitRequest" class="register-form">
        <!-- Tipus d'usuari -->
        <div class="form-group">
          <label for="userType">Tipus d'Usuari *</label>
          <select v-model="form.userType" id="userType" required>
            <option value="">Selecciona el teu rol</option>
            <option value="client">Client</option>
            <option value="driver">Conductor</option>
          </select>
        </div>

        <!-- Nom complet -->
        <div class="form-group">
          <label for="name">Nom Complet *</label>
          <input 
            v-model="form.name" 
            type="text" 
            id="name" 
            placeholder="El teu nom complet"
            required
          />
        </div>

        <!-- Correu -->
        <div class="form-group">
          <label for="email">Correu *</label>
          <input 
            v-model="form.email" 
            type="email" 
            id="email" 
            placeholder="correu@example.com"
            required
            @blur="checkEmailExists"
          />
          <span v-if="emailError" class="error-message">{{ emailError }}</span>
        </div>

        <!-- Telèfon -->
        <div class="form-group">
          <label for="phone">Telèfon *</label>
          <input 
            v-model="form.phone" 
            type="tel" 
            id="phone" 
            placeholder="+34 XXX XXX XXX"
            required
          />
        </div>

        <!-- Documentació (DNI/NIF) -->
        <div class="form-group">
          <label for="dni">DNI/NIF *</label>
          <input 
            v-model="form.dni" 
            type="text" 
            id="dni" 
            placeholder="12345678X"
            required
          />
        </div>

        <!-- Adreça -->
        <div class="form-group">
          <label for="address">Adreça *</label>
          <input 
            v-model="form.address" 
            type="text" 
            id="address" 
            placeholder="Carrer, número, pis"
            required
          />
        </div>

        <!-- Codi Postal -->
        <div class="form-group">
          <label for="postalCode">Codi Postal *</label>
          <input 
            v-model="form.postalCode" 
            type="text" 
            id="postalCode" 
            placeholder="08001"
            required
          />
        </div>

        <!-- Ciutat -->
        <div class="form-group">
          <label for="city">Ciutat *</label>
          <input 
            v-model="form.city" 
            type="text" 
            id="city" 
            placeholder="La teva ciutat"
            required
          />
        </div>

        <!-- Targeta Sanitària -->
        <div class="form-group">
          <label for="healthCard">Número de Targeta Sanitària *</label>
          <input 
            v-model="form.healthCard" 
            type="text" 
            id="healthCard" 
            placeholder="Número de targeta"
            required
          />
        </div>

        <!-- Data de Naixement -->
        <div class="form-group">
          <label for="birthDate">Data de Naixement *</label>
          <input 
            v-model="form.birthDate" 
            type="date" 
            id="birthDate"
            required
          />
        </div>

        <!-- Contacte d'Emergència -->
        <div class="form-group">
          <label for="emergencyContact">Contacte d'Emergència (nom) *</label>
          <input 
            v-model="form.emergencyContact" 
            type="text" 
            id="emergencyContact" 
            placeholder="Nom del contacte"
            required
          />
        </div>

        <!-- Telèfon Contacte Emergència -->
        <div class="form-group">
          <label for="emergencyPhone">Telèfon del Contacte d'Emergència *</label>
          <input 
            v-model="form.emergencyPhone" 
            type="tel" 
            id="emergencyPhone" 
            placeholder="+34 XXX XXX XXX"
            required
          />
        </div>

        <!-- Camps adicionals per a conductors -->
        <template v-if="form.userType === 'driver'">
          <div class="form-group">
            <label for="licenseNumber">Número de Carnet de Conduir *</label>
            <input 
              v-model="form.licenseNumber" 
              type="text" 
              id="licenseNumber" 
              placeholder="Número de carnet"
              required
            />
          </div>

          <div class="form-group">
            <label for="licenseExpiry">Data de Caducitat del Carnet *</label>
            <input 
              v-model="form.licenseExpiry" 
              type="date" 
              id="licenseExpiry"
              required
            />
          </div>

          <div class="form-group">
            <label for="vehicleType">Tipus de Vehicle *</label>
            <input 
              v-model="form.vehicleType" 
              type="text" 
              id="vehicleType" 
              placeholder="Ex: Cotxe, Furgoneta, etc."
              required
            />
          </div>

          <div class="form-group">
            <label for="insurance">Número de Pòlissa de Segurs *</label>
            <input 
              v-model="form.insurance" 
              type="text" 
              id="insurance" 
              placeholder="Número de pòlissa"
              required
            />
          </div>
        </template>

        <!-- Comentaris adicionals -->
        <div class="form-group">
          <label for="comments">Comentaris Adicionals</label>
          <textarea 
            v-model="form.comments" 
            id="comments" 
            placeholder="Informació adicional que consideris important"
            rows="4"
          ></textarea>
        </div>

        <!-- Acceptació de termes -->
        <div class="form-group checkbox">
          <input 
            v-model="form.acceptTerms" 
            type="checkbox" 
            id="acceptTerms"
            required
          />
          <label for="acceptTerms">Accepto els termes i condicions de RURAL-GO VIVA *</label>
        </div>

        <!-- Botons -->
        <div class="form-actions">
          <router-link to="/login" class="btn btn-secondary">
            Enrere
          </router-link>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Enviant...' : 'Enviar Sol·licitud' }}
          </button>
        </div>
      </form>

      <!-- Missatge d'èxit -->
      <div v-if="successMessage" class="success-message">
        <p>✓ {{ successMessage }}</p>
        <router-link to="/login" class="btn btn-primary mt-3">
          Anar a Accés
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useRegistrationStore } from '../store/registrationStore';

const router = useRouter();
const registrationStore = useRegistrationStore();

const form = ref({
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
  emergencyContact: '',
  emergencyPhone: '',
  licenseNumber: '',
  licenseExpiry: '',
  vehicleType: '',
  insurance: '',
  comments: '',
  acceptTerms: false
});

const isSubmitting = ref(false);
const emailError = ref('');
const successMessage = ref('');

const checkEmailExists = () => {
  if (form.value.email && registrationStore.emailExists(form.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en procés de revisió';
  } else {
    emailError.value = '';
  }
};

const submitRequest = async () => {
  if (!form.value.acceptTerms) {
    alert('Has d\'acceptar els termes i condicions');
    return;
  }

  if (registrationStore.emailExists(form.value.email)) {
    emailError.value = 'Aquest correu ja està registrat o en procés de revisió';
    return;
  }

  isSubmitting.value = true;

  try {
    // Crear sol·licitud
    const request = registrationStore.createRegistrationRequest({
      userType: form.value.userType,
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      dni: form.value.dni,
      address: form.value.address,
      postalCode: form.value.postalCode,
      city: form.value.city,
      healthCard: form.value.healthCard,
      birthDate: form.value.birthDate,
      emergencyContact: form.value.emergencyContact,
      emergencyPhone: form.value.emergencyPhone,
      licenseNumber: form.value.licenseNumber,
      licenseExpiry: form.value.licenseExpiry,
      vehicleType: form.value.vehicleType,
      insurance: form.value.insurance,
      comments: form.value.comments
    });

    successMessage.value = `¡Sol·licitud enviada! El teu ID de sol·licitud és: ${request.id}. Rebràs un correu amb la resolució aviat.`;

    // Netejar formulari
    setTimeout(() => {
      form.value = {
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
        emergencyContact: '',
        emergencyPhone: '',
        licenseNumber: '',
        licenseExpiry: '',
        vehicleType: '',
        insurance: '',
        comments: '',
        acceptTerms: false
      };
    }, 2000);
  } catch (error) {
    console.error('Error en enviar la sol·licitud:', error);
    alert('Error en enviar la sol·licitud. Siusplau intenta de nou.');
  } finally {
    isSubmitting.value = false;
  }
};

// Carregar dades al muntar
registrationStore.loadFromLocalStorage();
</script>

<style scoped>
.register-request-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.register-request-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

h1 {
  color: #2E7D6E;
  margin-bottom: 10px;
  font-size: 28px;
}

.intro-text {
  color: #666;
  margin-bottom: 30px;
  line-height: 1.6;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.checkbox {
  flex-direction: row;
  align-items: flex-start;
  gap: 10px;
}

.form-group.checkbox input {
  width: auto;
  margin-top: 4px;
}

.form-group.checkbox label {
  margin-bottom: 0;
  font-weight: 500;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1a1a1a;
  font-size: 14px;
}

input, textarea, select {
  padding: 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  transition: all 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: #2E7D6E;
  box-shadow: 0 0 0 4px rgba(46, 125, 110, 0.1);
}

textarea {
  resize: vertical;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex: 1;
}

.btn-primary {
  background: #2E7D6E;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1a4a42;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 110, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e9ecef;
  color: #1a1a1a;
  border: 1px solid #dee2e6;
}

.btn-secondary:hover {
  background: #dee2e6;
  transform: translateY(-2px);
}

.success-message {
  background: #d4edda;
  border: 1px solid #c3e6cb;
  color: #155724;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  text-align: center;
}

.success-message p {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.mt-3 {
  margin-top: 15px !important;
}

/* Responsive */
@media (max-width: 768px) {
  .register-request-container {
    padding: 20px;
  }

  .register-request-card {
    padding: 20px;
  }

  h1 {
    font-size: 22px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
