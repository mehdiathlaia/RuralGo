// Ejemplo de cómo usar el adminStore en otros componentes

// 1. Importar el store
import { useAdminStore } from '@/store/adminStore';

// 2. En el script setup
const adminStore = useAdminStore();

// 3. Ejemplos de acciones comunes:

// ============ GESTIÓN DE USUARIOS ============

// Obtener todos los usuarios
const allUsers = computed(() => adminStore.getAllUsers);

// Obtener usuarios filtrados
const filteredUsers = computed(() => adminStore.getFilteredUsers);

// Obtener estadísticas de usuarios
const userStats = computed(() => adminStore.getUserStats);
// Resultado: { total, clients, drivers, active, inactive, banned }

// Buscar usuario
adminStore.setSearchTerm('Maria');

// Filtrar por tipo
adminStore.setUserTypeFilter('client'); // 'client', 'driver', 'all'

// Filtrar por estado
adminStore.setStatusFilter('active'); // 'active', 'inactive', 'banned', 'all'

// Ordenar usuarios
adminStore.setSortBy('name'); // 'name', 'createdAt', 'trips', 'rating'

// Ver detalles de un usuario
adminStore.setSelectedUser(1);
console.log(adminStore.selectedUser);

// Editar usuario
adminStore.setEditingUser(1);
adminStore.editingUser.name = 'Nuevo nombre';
adminStore.updateUser(1, adminStore.editingUser);

// Banear usuario
adminStore.banUser(1, 'Motivo del ban');

// Desbanear usuario
adminStore.unbanUser(1);

// Desactivar usuario
adminStore.deactivateUser(1);

// Activar usuario
adminStore.activateUser(1);

// Eliminar usuario (IRREVERSIBLE)
adminStore.deleteUser(1);

// Exportar usuarios a CSV
adminStore.exportUsersToCSV();

// ============ GESTIÓN DE VIAJES ============

// Obtener todos los viajes
const allTrips = computed(() => adminStore.allTrips);

// Obtener estadísticas de viajes
const tripStats = computed(() => adminStore.getTripStats);
// Resultado: { total, completed, active, cancelled, totalRevenue, averageRating }

// Exportar viajes a CSV
adminStore.exportTripsToCSV();

// ============ CONFIGURACIÓN DE PLATAFORMA ============

// Obtener configuración actual
const settings = computed(() => adminStore.getPlatformSettings);

// Actualizar configuración
adminStore.updatePlatformSetting('commissionRate', 25);
adminStore.updatePlatformSetting('minimumBalance', 50);
adminStore.updatePlatformSetting('maxRideDistance', 150);
adminStore.updatePlatformSetting('supportEmail', 'nuevoemail@example.com');
adminStore.updatePlatformSetting('emergencyPhone', '112');

// Activar modo mantenimiento
adminStore.enableMaintenanceMode();

// Desactivar modo mantenimiento
adminStore.disableMaintenanceMode();

// ============ AUDITORÍA ============

// Obtener registro de auditoria
const auditLog = computed(() => adminStore.getAuditLog);

// Registrar una acción manual
adminStore.logAction('CUSTOM_ACTION', 'Descripción de la acción', userId);

// ============ REPORTES ============

// Generar reporte diario
const dailyReport = adminStore.generateDailyReport();

// ============ ALMACENAMIENTO ============

// Guardar datos en localStorage
adminStore.saveToLocalStorage();

// Cargar datos desde localStorage
adminStore.loadFromLocalStorage();

// ============ INICIALIZACIÓN ============

// Inicializar admin store (ejecutar en mounted)
onMounted(() => {
  adminStore.initializeAdmin();
});

// ============ EJEMPLOS COMPLETOS ============

// Ejemplo 1: Crear un botón para aprobar usuario
<button @click="approveUser">Aprobar</button>

const approveUser = () => {
  registrationStore.approveRequest(userId);
  adminStore.logAction('APPROVE_REGISTRATION', `Usuario ${userName} aprobado`, userId);
};

// Ejemplo 2: Crear un componente que muestre estadísticas
<template>
  <div class="admin-stats">
    <p>Total usuarios: {{ adminStore.getUserStats.total }}</p>
    <p>Usuarios activos: {{ adminStore.getUserStats.active }}</p>
    <p>Viajes completados: {{ adminStore.getTripStats.completed }}</p>
    <p>Ingresos totales: €{{ adminStore.getTripStats.totalRevenue }}</p>
  </div>
</template>

// Ejemplo 3: Componente con tabla de usuarios filtrada
<template>
  <div>
    <input 
      @input="adminStore.setSearchTerm"
      placeholder="Buscar usuario..."
    >
    <table>
      <tr v-for="user in adminStore.getFilteredUsers" :key="user.id">
        <td>{{ user.name }}</td>
        <td>{{ user.email }}</td>
        <td>
          <button @click="adminStore.setSelectedUser(user.id); showDetails = true">
            Ver
          </button>
        </td>
      </tr>
    </table>
  </div>
</template>

// Ejemplo 4: Componente con diálogo de edición
<script setup>
const editingUser = computed(() => adminStore.editingUser);

const startEditing = (userId) => {
  adminStore.setEditingUser(userId);
  showEditDialog.value = true;
};

const saveChanges = () => {
  adminStore.updateUser(adminStore.editingUser.id, adminStore.editingUser);
  showEditDialog.value = false;
  adminStore.logAction('UPDATE_USER', `Usuario ${adminStore.editingUser.name} actualizado`);
};

const cancelEditing = () => {
  adminStore.cancelEditUser();
  showEditDialog.value = false;
};
</script>

// Ejemplo 5: Monitorizar usuarios baneados
<template>
  <div class="banned-users">
    <h2>Usuarios Baneados</h2>
    <div v-for="user in bannedUsers" :key="user.id">
      <p>{{ user.name }}</p>
      <p>Motivo: {{ user.banReason }}</p>
      <p>Baneado desde: {{ formatDate(user.bannedAt) }}</p>
      <button @click="adminStore.unbanUser(user.id)">Desbanear</button>
    </div>
  </div>
</template>

<script setup>
const bannedUsers = computed(() => {
  return adminStore.getAllUsers.filter(u => u.isBanned);
});
</script>
