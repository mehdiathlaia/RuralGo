import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useRegistrationStore = defineStore('registration', () => {
  const pendingRequests = ref([]);
  const approvedUsers = ref([]);

  // Carregar des de localStorage al inicialitzar
  const loadFromLocalStorage = () => {
    const pendingData = localStorage.getItem('registrationPendingRequests');
    const approvedData = localStorage.getItem('registrationApprovedUsers');
    
    if (pendingData) {
      pendingRequests.value = JSON.parse(pendingData);
    }
    if (approvedData) {
      approvedUsers.value = JSON.parse(approvedData);
    }
  };

  // Guardar a localStorage
  const saveToLocalStorage = () => {
    localStorage.setItem('registrationPendingRequests', JSON.stringify(pendingRequests.value));
    localStorage.setItem('registrationApprovedUsers', JSON.stringify(approvedUsers.value));
  };

  // Crear sol·licitud de registre
  const createRegistrationRequest = (userData) => {
    const request = {
      id: Date.now().toString(),
      ...userData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      temporaryPassword: null,
      rejectionReason: null,
      reviewedAt: null,
      reviewedBy: null
    };

    pendingRequests.value.push(request);
    saveToLocalStorage();

    return request;
  };

  // Aprovar sol·licitud
  const approveRequest = (requestId) => {
    const requestIndex = pendingRequests.value.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return false;

    const request = pendingRequests.value[requestIndex];
    
    // Generar contrasenya provisional
    const tempPassword = generateTemporaryPassword();
    
    const approvedUser = {
      ...request,
      status: 'approved',
      temporaryPassword: tempPassword,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'admin'
    };

    approvedUsers.value.push(approvedUser);
    pendingRequests.value.splice(requestIndex, 1);
    saveToLocalStorage();

    // Simular enviament de correu
    simulateEmailSent(approvedUser.email, 'approved', {
      email: approvedUser.email,
      password: tempPassword,
      name: approvedUser.name
    });

    return approvedUser;
  };

  // Rebutjar sol·licitud
  const rejectRequest = (requestId, reason) => {
    const requestIndex = pendingRequests.value.findIndex(r => r.id === requestId);
    
    if (requestIndex === -1) return false;

    const request = pendingRequests.value[requestIndex];
    
    const rejectedUser = {
      ...request,
      status: 'rejected',
      rejectionReason: reason,
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'admin'
    };

    // Mantenir historial de rebutjats
    const rejectedData = JSON.parse(localStorage.getItem('registrationRejectedUsers') || '[]');
    rejectedData.push(rejectedUser);
    localStorage.setItem('registrationRejectedUsers', JSON.stringify(rejectedData));

    pendingRequests.value.splice(requestIndex, 1);
    saveToLocalStorage();

    // Simular enviament de correu
    simulateEmailSent(rejectedUser.email, 'rejected', { reason });

    return rejectedUser;
  };

  // Generar contrasenya temporal
  const generateTemporaryPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Simular enviament de correu
  const simulateEmailSent = (email, status, data) => {
    const emailLog = JSON.parse(localStorage.getItem('emailLog') || '[]');
    
    const emailRecord = {
      id: Date.now().toString(),
      to: email,
      status: status,
      subject: status === 'approved' ? 
        'Tu solicitud ha sido APROBADA - RURAL-GO VIVA' :
        'Tu solicitud ha sido RECHAZADA - RURAL-GO VIVA',
      body: status === 'approved' ?
        `Felicidades!\n\nTu solicitud para registrarte en RURAL-GO VIVA ha sido aprobada.\n\nDatos de acceso:\nEmail: ${data.email}\nContraseña provisional: ${data.password}\n\nPor favor, cambia tu contraseña en la primera conexión.` :
        `Estimado usuario,\n\nLamentablemente, tu solicitud ha sido rechazada.\n\nMotivo: ${data.reason}`,
      sentAt: new Date().toISOString()
    };

    emailLog.push(emailRecord);
    localStorage.setItem('emailLog', JSON.stringify(emailLog));

    // Log en consola para debugging
    console.log('📧 Email simulado enviado:', emailRecord);
  };

  // Verificar si email ya existe
  const emailExists = (email) => {
    return pendingRequests.value.some(r => r.email === email) ||
           approvedUsers.value.some(u => u.email === email);
  };

  // Obtener solicitudes pendientes
  const getPendingRequests = computed(() => pendingRequests.value);

  // Obtener usuarios aprobados
  const getApprovedUsers = computed(() => approvedUsers.value);

  // Obtener solicitud por ID
  const getRequestById = (id) => {
    return pendingRequests.value.find(r => r.id === id);
  };

  // Obtener usuario aprobado por ID
  const getApprovedUserById = (id) => {
    return approvedUsers.value.find(u => u.id === id);
  };

  // Obtener email log
  const getEmailLog = () => {
    return JSON.parse(localStorage.getItem('emailLog') || '[]');
  };

  return {
    pendingRequests,
    approvedUsers,
    loadFromLocalStorage,
    saveToLocalStorage,
    createRegistrationRequest,
    approveRequest,
    rejectRequest,
    emailExists,
    getPendingRequests,
    getApprovedUsers,
    getRequestById,
    getApprovedUserById,
    getEmailLog
  };
});
