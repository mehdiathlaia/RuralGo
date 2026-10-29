<template>
  <div class="emergency-container">
    <!-- Main Content -->
    <div class="emergency-page">
      <div class="header">
        <h1>Centre d'Emergència</h1>
        <p>Accés ràpid a serveis d'emergència i ajuda</p>
      </div>

      <!-- Call Buttons -->
      <div class="call-buttons">
        <div class="call-btn-wrapper">
          <button class="call-btn call-112" @click="call112">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiPhone" fill="currentColor" />
            </svg>
            <span>Trucar 112</span>
          </button>
          <p class="btn-description">Emergències generals: accident, perill greu, incendi</p>
        </div>
        <div class="call-btn-wrapper">
          <button class="call-btn call-061" @click="call061">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiAmbulance" fill="currentColor" />
            </svg>
            <span>Trucar 061</span>
          </button>
          <p class="btn-description">Emergències mèdiques: lesions, malaltia, problemes de salut</p>
        </div>
        <div class="call-btn-wrapper">
          <button class="call-btn call-support" @click="callSupport">
            <svg class="icon" viewBox="0 0 24 24">
              <path :d="mdiHeadset" fill="currentColor" />
            </svg>
            <span>Contactar Suport</span>
          </button>
          <p class="btn-description">Problemes amb l'app, consultes del viatge, reclamacions</p>
        </div>
      </div>

      <!-- First Aid Guide -->
      <div class="first-aid-section">
        <h2>Manual de Primers Auxilis</h2>
        
        <div class="first-aid-cards">
          <!-- RCP -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('rcp')">
              <div class="card-icon">🫀</div>
              <div class="card-title">Reanimació Cardiopulmonar (RCP)</div>
              <div class="expand-icon">{{ expandedCards.rcp ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.rcp" class="card-content">
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text">Verifica la consciència: crida i toca l'espatlla</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text">Trucar al 061 o 112 IMMEDIATAMENT</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Col·loca boca amunt sobre una superfície ferma</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Posiciona les mans al centre del pit (una sobre l'altra)</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">5</div>
                  <div class="step-text"><strong>Compressions: 100-120 per minut</strong></div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Alterna 30 compressions + 2 respiracions de rescat</div>
                </div>
                <div class="step">
                  <div class="step-number">7</div>
                  <div class="step-text">Continua fins que arribin els serveis d'emergència</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Hemorràgia -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('hemor')">
              <div class="card-icon">🩹</div>
              <div class="card-title">Control de Hemorràgia</div>
              <div class="expand-icon">{{ expandedCards.hemor ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.hemor" class="card-content">
              <div class="steps">
                <div class="step highlight">
                  <div class="step-number">1</div>
                  <div class="step-text"><strong>Trucar al 061 si la hemorràgia és greu</strong></div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text">Col·loca gasa estèril sobre la ferida</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Pressió constant durant 5-10 minuts</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Si continua saignant: afegeix més gasa sense treure la primera</div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-text">Eleva la zona ferida per sobre del cor</div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Immobilitza bé la zona</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Asfíxia -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('asfixia')">
              <div class="card-icon">🫁</div>
              <div class="card-title">Asfíxia per Obstrucció</div>
              <div class="expand-icon">{{ expandedCards.asfixia ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.asfixia" class="card-content">
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text">Pregunta: "Pots parlar?" (Si tus = pot respirar)</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">2</div>
                  <div class="step-text"><strong>Si no pot parlar: Maniobra de Heimlich</strong></div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Col·locar-te darrere la persona</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Fes un puny just per sobre del melic</div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-text">Agafa el puny amb l'altra mà i estira cap a dalt</div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Repeteix la maniobra 5 vegades ràpidament</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lesions Musculars -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('muscular')">
              <div class="card-icon">💪</div>
              <div class="card-title">Esguinços i Lesions Musculars</div>
              <div class="expand-icon">{{ expandedCards.muscular ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.muscular" class="card-content">
              <div class="steps">
                <div class="step highlight">
                  <div class="step-number">R</div>
                  <div class="step-text"><strong>Rest</strong> - Repòs immediatament</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">I</div>
                  <div class="step-text"><strong>Ice</strong> - Gel 15-20 minuts (no directament sobre la pell)</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">C</div>
                  <div class="step-text"><strong>Compression</strong> - Vena de compressió elàstica</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">E</div>
                  <div class="step-text"><strong>Elevation</strong> - Eleva per sobre del cor</div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-text">No carreguis pes sobre la zona afectada</div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Si és greu: trucar al 061</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cremades -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('cremades')">
              <div class="card-icon">🔥</div>
              <div class="card-title">Cremades</div>
              <div class="expand-icon">{{ expandedCards.cremades ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.cremades" class="card-content">
              <div class="steps">
                <div class="step">
                  <div class="step-number">G1-2</div>
                  <div class="step-text">Pell roja/ampolles (mida menor que la palmeta)</div>
                </div>
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text">Treu la roba si és possible (amb molt de cuidat)</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text">Refrigera 10-15 minuts amb aigua freda</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Aplica crema específica per a cremades</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Cobreix amb gasa no adherent</div>
                </div>
                <div class="step highlight">
                  <div class="step-number">G3</div>
                  <div class="step-text"><strong>Pell negra/blanca: TRUCAR AL 061 IMMEDIATAMENT!</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Fractures -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('fractura')">
              <div class="card-icon">🦴</div>
              <div class="card-title">Fractures i Luxacions</div>
              <div class="expand-icon">{{ expandedCards.fractura ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.fractura" class="card-content">
              <div class="steps">
                <div class="step highlight">
                  <div class="step-number">1</div>
                  <div class="step-text"><strong>TRUCAR AL 061 IMMEDIATAMENT</strong></div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text">Immobilitza la zona (amb roba, mantes, objectes tous)</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Aplica gel (envoltat en tela, no directament)</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Eleva la zona sense causar dolor</div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-text">NO intentes alinear ni ajustar la zona</div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Mantén la persona fins que arribin els serveis d'emergència</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Posició Recuperació -->
          <div class="aid-card expandable">
            <div class="card-header" @click="toggleCard('recuperacio')">
              <div class="card-icon">😴</div>
              <div class="card-title">Posició de Recuperació</div>
              <div class="expand-icon">{{ expandedCards.recuperacio ? '▼' : '▶' }}</div>
            </div>
            <div v-if="expandedCards.recuperacio" class="card-content">
              <div class="steps">
                <div class="step">
                  <div class="step-number">1</div>
                  <div class="step-text">Girar la persona boca avall (de costat)</div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div class="step-text">Braç més proper elevat (per estabilitzar)</div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div class="step-text">Obrir la boca perquè flueixi tota secreció</div>
                </div>
                <div class="step">
                  <div class="step-number">4</div>
                  <div class="step-text">Flexionar la cama més propera (per estabilitzar)</div>
                </div>
                <div class="step">
                  <div class="step-number">5</div>
                  <div class="step-text">Cap lleugerament enrere per assegurar l'aire</div>
                </div>
                <div class="step">
                  <div class="step-number">6</div>
                  <div class="step-text">Monitoritza la respiració constantment</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="first-aid-important">
          <div class="warning-content">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <h3>AVÍS IMPORTANT</h3>
              <p>Aquest manual és una guia educativa de referència. <strong>No substitueix el consell mèdic professional.</strong></p>
              <p style="margin-top: 15px; font-size: 16px;"><strong>En qualsevol situació d'emergència, sempre trucar als serveis d'emergència:</strong></p>
              <p style="margin: 12px 0; font-size: 18px; font-weight: bold; color: #e74c3c;">☎️ 112 (Emergències generals) | 061 (Emergències mèdiques)</p>
              <p style="margin-top: 15px;">Els especialistes professionals sabrán exactament què fer en cada situació. Ells són l'única resposta vàlida en una emergència.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeSuccessModal">
      <div class="modal-content success">
        <svg class="success-icon" viewBox="0 0 24 24">
          <path :d="mdiCheckCircle" fill="currentColor" />
        </svg>
        <h2>Informe Enviat</h2>
        <p>El teu informe ha estat enviat al nostre equip de seguretat</p>
        <p class="reference">{{ incidentReference }}</p>
        <button class="close-btn" @click="closeSuccessModal">Tancar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTripStore } from '../store/tripStore'
import {
  mdiAlert,
  mdiPhone,
  mdiChat,
  mdiMapMarker,
  mdiClose,
  mdiAmbulance,
  mdiHeadset,
  mdiEmail,
  mdiCheckCircle
} from '@mdi/js'

const tripStore = useTripStore()

// SOS State
const showSuccessModal = ref(false)

// First Aid Cards State
const expandedCards = ref({
  rcp: false,
  hemor: false,
  asfixia: false,
  muscular: false,
  cremades: false,
  fractura: false,
  recuperacio: false
})

// Methods
const toggleCard = (cardId) => {
  expandedCards.value[cardId] = !expandedCards.value[cardId]
}
const call112 = () => {
  if (confirm('Vols trucar a Emergències (112)?')) {
    window.location.href = 'tel:112'
  }
}

const call061 = () => {
  if (confirm('Vols trucar a Ambulància (061)?')) {
    window.location.href = 'tel:061'
  }
}

const callSupport = () => {
  if (confirm('Vols contactar amb Suport?')) {
    // TODO: Definir número de suport
    alert('Número de suport no definit. Contacta amb el equip de WebRuralGo.')
  }
}

const showSupportInfo = () => {
  alert('Suport WebRuralGo\n\nEl número de telèfon de suport encara no està definit.\nTans aviat com es defineixi, podràs contactar-nos directament des d\'aquí.')
}
</script>

<style scoped>
.emergency-container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Page */
.emergency-page {
  padding-top: 40px;
  padding-bottom: 40px;
}

.header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding: 20px;
}

.header h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.header p {
  font-size: 16px;
  opacity: 0.9;
}

/* Call Buttons */
.call-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.call-btn-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.call-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  padding: 30px 20px;
  background: white;
  border: 3px solid;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  font-size: 16px;
  width: 100%;
}

.call-btn:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.call-btn .icon {
  width: 48px;
  height: 48px;
}

.btn-description {
  font-size: 13px;
  color: white;
  text-align: center;
  font-weight: normal;
  line-height: 1.4;
  opacity: 0.9;
}

.call-112 {
  border-color: #e74c3c;
  color: #e74c3c;
}

.call-112:hover {
  background: #ffe6e6;
}

.call-061 {
  border-color: #16a085;
  color: #16a085;
}

.call-061:hover {
  background: #e8f9f6;
}

.call-support {
  border-color: #3498db;
  color: #3498db;
}

.call-support:hover {
  background: #ebf5fb;
}

/* First Aid Section */
.first-aid-section {
  max-width: 1200px;
  margin: 60px auto;
  padding: 0 20px 40px;
}

.first-aid-section h2 {
  color: white;
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
}

.first-aid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.aid-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.aid-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.aid-card h3 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 3px solid #667eea;
  padding-bottom: 10px;
}

.aid-card ol {
  list-style-position: inside;
  color: #34495e;
  line-height: 1.8;
}

.aid-card li {
  margin-bottom: 8px;
  font-size: 14px;
}

.first-aid-important {
  background: linear-gradient(135deg, rgba(231, 76, 60, 0.15) 0%, rgba(192, 57, 43, 0.1) 100%);
  border-left: 5px solid #e74c3c;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);
  margin-top: 40px;
}

.warning-content {
  display: flex;
  gap: 20px;
  padding: 25px;
  align-items: flex-start;
}

.warning-icon {
  font-size: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 60px;
}

.warning-text {
  flex-grow: 1;
  color: #2c3e50;
}

.warning-text h3 {
  color: #c0392b;
  font-size: 20px;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.warning-text p {
  color: #34495e;
  margin: 10px 0;
  font-size: 15px;
  line-height: 1.6;
}

.warning-text strong {
  color: #c0392b;
  font-weight: 700;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ecf0f1;
}

.modal-header h2 {
  color: #2c3e50;
  font-size: 20px;
  margin: 0;
}

.modal-body {
  padding: 20px;
}

/* Form Groups */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 14px;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
}

/* Incident Type Buttons */
.incident-type-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.type-btn {
  padding: 12px;
  background: #ecf0f1;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 12px;
  text-align: center;
  color: #2c3e50;
}

.type-btn:hover {
  border-color: #9b59b6;
}

.type-btn.active {
  background: #9b59b6;
  color: white;
  border-color: #9b59b6;
}

/* Severity Buttons */
.severity-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.severity-btn {
  padding: 12px;
  border: 2px solid #bdc3c7;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 12px;
  text-align: center;
}

.severity-btn.active {
  color: white;
  border-width: 2px;
}

.severity-baja {
  color: #27ae60;
}

.severity-baja.active {
  background: #27ae60;
  border-color: #27ae60;
}

.severity-media {
  color: #f39c12;
}

.severity-media.active {
  background: #f39c12;
  border-color: #f39c12;
}

.severity-alta {
  color: #e74c3c;
}

.severity-alta.active {
  background: #e74c3c;
  border-color: #e74c3c;
}

.severity-critica {
  color: #c0392b;
}

.severity-critica.active {
  background: #c0392b;
  border-color: #c0392b;
}

/* File Input */
.file-input-wrapper {
  margin-top: 10px;
}

input[type="file"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 8px;
}

/* Submit Button */
.submit-btn {
  width: 100%;
  padding: 14px;
  background: #9b59b6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

.submit-btn:hover {
  background: #8e44ad;
  transform: translateY(-2px);
}

/* Success Modal */
.modal-content.success {
  text-align: center;
  padding: 40px 20px;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #27ae60;
  animation: scaleIn 0.3s ease;
}

.modal-content.success h2 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.modal-content.success p {
  color: #7f8c8d;
  margin-bottom: 10px;
}

.reference {
  background: #ecf0f1;
  padding: 10px;
  border-radius: 8px;
  font-family: monospace;
  font-weight: 600;
  color: #2c3e50;
  margin: 20px 0;
}

.modal-content.success .close-btn {
  width: 100%;
  padding: 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 20px;
}

.modal-content.success .close-btn:hover {
  background: #229954;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

/* Expandable Card Styles */
.aid-card.expandable {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.aid-card.expandable:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.card-header:hover {
  background: linear-gradient(135deg, #5568d3 0%, #6a3f92 100%);
}

.card-icon {
  font-size: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-title {
  flex-grow: 1;
  font-size: 18px;
  font-weight: 600;
}

.expand-icon {
  font-size: 16px;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.card-content {
  padding: 25px;
  background: white;
  animation: slideDown 0.3s ease;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  padding: 15px;
  background: #f8f9ff;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.step.highlight {
  background: #ffe6e6;
  border-left-color: #e74c3c;
}

.step-number {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  flex-shrink: 0;
}

.step.highlight .step-number {
  background: #e74c3c;
}

.step-text {
  flex-grow: 1;
  color: #34495e;
  font-size: 15px;
  line-height: 1.6;
}

.step-text strong {
  color: #2c3e50;
  font-weight: 700;
}

@keyframes slideDown {
  from {
    opacity: 0;
    max-height: 0;
  }
  to {
    opacity: 1;
    max-height: 500px;
  }
}

/* First Aid Important Warning */
.first-aid-important {
  background: #ffffff;
  border-left: 6px solid #e74c3c;
  border-top: 2px solid #e74c3c;
  border-right: 2px solid #e74c3c;
  border-bottom: 2px solid #e74c3c;
  border-radius: 12px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(231, 76, 60, 0.3);
  margin-top: 40px;
}

.warning-content {
  display: flex;
  gap: 20px;
  padding: 30px;
  align-items: flex-start;
  background: #fafafa;
}

.warning-icon {
  font-size: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 60px;
  background: #fff0f0;
  border-radius: 8px;
}

.warning-text {
  flex-grow: 1;
  color: #1a1a1a;
}

.warning-text h3 {
  color: #c0392b;
  font-size: 22px;
  margin: 0 0 15px 0;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.warning-text p {
  color: #2c3e50;
  margin: 12px 0;
  font-size: 15px;
  line-height: 1.7;
  font-weight: 500;
}

.warning-text strong {
  color: #c0392b;
  font-weight: 800;
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions {
    grid-template-columns: repeat(2, 1fr);
  }

  .incident-type-buttons {
    grid-template-columns: 1fr;
  }

  .severity-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .sos-button {
    width: 70px;
    height: 70px;
    font-size: 14px;
    bottom: 20px;
    right: 20px;
  }

  .header h1 {
    font-size: 24px;
  }
}
</style>
