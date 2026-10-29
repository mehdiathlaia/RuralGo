<template>
  <!-- Modal Pop-up overlay - bloquea toda la web -->
  <div v-if="showTerms" class="terms-modal-overlay">
    <div class="terms-modal">
      <div class="terms-modal-header">
        <h2>Termes i Condicions</h2>
      </div>

      <div class="terms-modal-body">
        <p class="intro-text">Per a continuar usant RURAL-GO VIVA, has d'acceptar els nostre termes i condicions.</p>

        <div class="terms-content">
          <h3>Ressum dels termes:</h3>
          <ul>
            <li>✓ <strong>Privacitat:</strong> Els teus dades es protegeixen amb encriptació de grau bancari</li>
            <li>✓ <strong>Seguretat:</strong> Tots els viatges són coberts per assegurança</li>
            <li>✓ <strong>Responsabilitat:</strong> Els conductors han de complir amb la normativa de trànsit</li>
            <li>✓ <strong>Cancelacions:</strong> Pots cancel·lar viatges fins a 10 minuts abans de la sortida</li>
            <li>✓ <strong>Pagaments:</strong> Els pagaments es realitzen de manera segura i transparent</li>
            <li>✓ <strong>Suport:</strong> Tenim suport 24/7 en cas d'emergències</li>
          </ul>

          <p class="read-more">
            <a href="#" @click.prevent="showFullTermsModal = true">Llegir els termes i condicions complets →</a>
          </p>
        </div>
      </div>

      <div class="terms-modal-footer">
        <button @click="rejectTerms" class="btn btn-secondary">
          Rebutjar
        </button>
        <button @click="acceptTerms" class="btn btn-primary">
          Accepto els termes
        </button>
      </div>
    </div>
  </div>

  <!-- Modal for full terms -->
  <div v-if="showFullTermsModal" class="terms-modal-overlay">
    <div class="terms-modal terms-modal-full">
      <div class="terms-modal-header">
        <h2>Termes i Condicions Complets</h2>
        <button @click="showFullTermsModal = false" class="modal-close-btn">
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path :d="mdiClose" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div class="terms-modal-body terms-full-content">
        <section>
          <h3>1. Acceptació dels Termes</h3>
          <p>En accedir i utilitzar RURAL-GO VIVA, acceptes estar vinculat per aquests termes i condicions. Si no estàs d'acord amb cap part, et demanem que deixis d'usar el servei.</p>
        </section>

        <section>
          <h3>2. Descripció del Servei</h3>
          <p>RURAL-GO VIVA és una plataforma de mobilitat rural que connecta clients amb conductors per a serveis de transport en àrees rurals. La nostra missió és garantir accessibilitat, seguretat i conforta en tota la xarxa.</p>
        </section>

        <section>
          <h3>3. Responsabilitats de l'Usuari</h3>
          <ul>
            <li>Proporcionar informació exacta i completa durant el registre</li>
            <li>Mantenir la confidencialitat de la contrasenya</li>
            <li>Acceptar que ets responsable de totes les activitats sota el teu compte</li>
            <li>Respectar els drets d'altres usuaris</li>
            <li>Complir amb totes les lleis aplicables</li>
          </ul>
        </section>

        <section>
          <h3>4. Política de Privacitat i Protecció de Dades</h3>
          <p>Coleccionem informació personal necessària per proporcionar els serveis:</p>
          <ul>
            <li>Dades de registre (nom, email, telèfon)</li>
            <li>Informació de localització durant viatges</li>
            <li>Historial de viatges i pagaments</li>
            <li>Informació de perfil i preferències</li>
          </ul>
          <p>Aquestes dades es tracten de conformitat amb la Llei Orgànica 3/2018 (RGPD) i no es comparteixen amb tercers sense consentiment.</p>
        </section>

        <section>
          <h3>5. Seguretat i Assegurança</h3>
          <p>Tots els viatges realitzats a través de RURAL-GO VIVA estan coberts per pòlissa d'assegurança integral que inclou:</p>
          <ul>
            <li>Responsabilitat civil</li>
            <li>Protecció del passatger</li>
            <li>Cobertura en cas d'accident</li>
            <li>Assegurança de bagatge</li>
          </ul>
        </section>

        <section>
          <h3>6. Polítiques de Cancelació</h3>
          <ul>
            <li><strong>Client:</strong> Pots cancel·lar fins a 10 minuts abans de la sortida sense penalitat</li>
            <li><strong>Conductor:</strong> Cancel·lacions indiscriminades resultaran en l'eliminació del compte</li>
            <li><strong>Causa major:</strong> Cancellacions per raons de força major no comporten multa</li>
          </ul>
        </section>

        <section>
          <h3>7. Polítiques de Pagament</h3>
          <ul>
            <li>Els pagaments es processan de forma segura a través de plataformes certificades</li>
            <li>Acceptem diverses formes de pagament (targeta de crèdit, efectiu, moneda digital)</li>
            <li>Els preus es mostren clarament abans de confirmar el viatge</li>
            <li>No hi ha sorpreses tarifàries - el preu final és exacte</li>
          </ul>
        </section>

        <section>
          <h3>8. Responsabilitat Limitada</h3>
          <p>RURAL-GO VIVA no es responsabilitza de:</p>
          <ul>
            <li>Danys indirectes o conseqüents</li>
            <li>Danys causats per tercers</li>
            <li>Retards per causes fora del nostre control</li>
            <li>Danys a efectes personals del passatger</li>
          </ul>
        </section>

        <section>
          <h3>9. Suport al Client</h3>
          <p>Disposem de suport 24/7 a través de:</p>
          <ul>
            <li>Chat en directe integrat a l'aplicació</li>
            <li>Email: suport@ruralgoviva.com</li>
            <li>Telèfon: +34 XXX XXX XXX (emergències)</li>
            <li>Centre de suport: suport.ruralgoviva.com</li>
          </ul>
        </section>

        <section>
          <h3>10. Modificacions dels Termes</h3>
          <p>RURAL-GO VIVA es reserva el dret de modificar aquests termes en qualsevol moment. Els canvis es notificaran amb 30 dies d'avançament. L'ús continu del servei implica l'acceptació dels nous termes.</p>
        </section>

        <section>
          <h3>11. Resolució de Disputes</h3>
          <p>Qualsevol disputa serà resuelta mitjançant:</p>
          <ul>
            <li>Negociació amistosa</li>
            <li>Mediació (si la negociació falla)</li>
            <li>Arbitratge (com a últim recurs)</li>
          </ul>
        </section>

        <section>
          <h3>12. Llei Aplicable</h3>
          <p>Aquests termes es regeixen per la llei espanyola, en particular la de la Comunitat Autònoma pertinent.</p>
        </section>

        <section>
          <h3>13. Contacte</h3>
          <p><strong>RURAL-GO VIVA SL</strong><br>
          Adreça: Carrer Rural, 123, 25005 Lleida, Espanya<br>
          Email: legal@ruralgoviva.com<br>
          Telèfon: +34 XXX XXX XXX</p>
        </section>

        <p class="last-updated">Última actualització: December 16, 2025</p>
      </div>

      <div class="terms-modal-footer">
        <button @click="showFullTermsModal = false" class="btn btn-secondary">
          Tancar
        </button>
        <button @click="acceptTerms" class="btn btn-primary">
          Accepto els termes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { mdiClose } from '@mdi/js';

defineProps({
  showTerms: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['accept', 'reject']);

const showFullTermsModal = ref(false);

const acceptTerms = () => {
  localStorage.setItem('termsAndConditionsAccepted', 'true');
  localStorage.setItem('termsAndConditionsAcceptedDate', new Date().toISOString());
  showFullTermsModal.value = false;
  emit('accept');
};

const rejectTerms = () => {
  // Limpiar localStorage y volver atrás en el historial
  localStorage.removeItem('termsAndConditionsAccepted');
  // Volver a la página anterior (como el botón atrás del navegador)
  window.history.back();
};
</script>

<style scoped>
.terms-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.terms-modal {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90vw;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.terms-modal-full {
  max-width: 800px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.terms-modal-header {
  padding: 30px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.terms-modal-header h2 {
  margin: 0;
  color: #2E7D6E;
  font-size: 24px;
}

.modal-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.3s ease;
}

.modal-close-btn:hover {
  color: #2E7D6E;
}

.terms-modal-body {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.8;
}

.intro-text {
  font-size: 16px;
  color: #1a1a1a;
  margin-bottom: 20px;
  font-weight: 500;
}

.terms-content h3 {
  margin: 0 0 15px 0;
  color: #2E7D6E;
  font-size: 16px;
}

.terms-content ul {
  margin: 0;
  padding-left: 20px;
}

.terms-content li {
  margin-bottom: 12px;
  color: #555;
}

.read-more {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.read-more a {
  color: #2E7D6E;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.read-more a:hover {
  color: #1a4a42;
}

.terms-full-content {
  color: #555;
}

.terms-full-content section {
  margin-bottom: 25px;
}

.terms-full-content h3 {
  color: #2E7D6E;
  font-size: 16px;
  margin: 0 0 10px 0;
}

.terms-full-content p {
  margin: 0 0 10px 0;
}

.terms-full-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.terms-full-content li {
  margin-bottom: 8px;
}

.last-updated {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
  font-size: 12px;
  color: #999;
  font-style: italic;
}

.terms-modal-footer {
  padding: 20px 30px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-shrink: 0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  white-space: nowrap;
}

.btn-primary {
  background: #2E7D6E;
  color: white;
}

.btn-primary:hover {
  background: #1a4a42;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(46, 125, 110, 0.3);
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

/* Responsive */
@media (max-width: 768px) {
  .terms-modal {
    max-height: 90vh;
    border-radius: 8px;
  }

  .terms-modal-header {
    padding: 20px;
  }

  .terms-modal-header h2 {
    font-size: 20px;
  }

  .terms-modal-body {
    padding: 20px;
    font-size: 13px;
  }

  .intro-text {
    font-size: 14px;
  }

  .terms-modal-footer {
    padding: 16px 20px;
    flex-direction: column;
  }

  .btn {
    padding: 10px 20px;
    font-size: 13px;
    width: 100%;
  }
}
</style>
