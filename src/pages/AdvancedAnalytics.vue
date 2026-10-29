<template>
  <div class="advanced-analytics-page">
    <div class="page-header">
      <h1>📈 Analítiques avançades - RURAL-GO VIVA</h1>
      <p>Dashboard d'analítiques per a decisions municipals estratègiques</p>
    </div>

    <!-- Dates selector -->
    <div class="date-range-selector">
      <div class="date-input-group">
        <label>Data inici</label>
        <input v-model="dateStart" type="date" class="date-input">
      </div>
      <div class="date-input-group">
        <label>Data fi</label>
        <input v-model="dateEnd" type="date" class="date-input">
      </div>
      <button @click="applyDateRange" class="btn btn-primary">Aplicar filtre</button>
      <button @click="downloadData" class="btn btn-success">📥 Descarregar CSV</button>
    </div>

    <!-- KPIs Principals -->
    <div class="kpis-section">
      <h2>📊 Indicadors principals (KPI)</h2>
      <div class="kpis-grid">
        <div class="kpi-card">
          <div class="kpi-icon">👥</div>
          <div class="kpi-content">
            <div class="kpi-label">Taxa d'ocupació</div>
            <div class="kpi-value">{{ kpis.occupancyRate }}</div>
            <div class="kpi-desc">Passatgers per trajecte</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">€</div>
          <div class="kpi-content">
            <div class="kpi-label">Cost per km</div>
            <div class="kpi-value">{{ kpis.costPerKm }}€</div>
            <div class="kpi-desc">Eficiència econòmica</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">👤</div>
          <div class="kpi-content">
            <div class="kpi-label">Cost per passatger</div>
            <div class="kpi-value">{{ kpis.costPerPassenger }}€</div>
            <div class="kpi-desc">Subvenció per persona</div>
          </div>
        </div>

        <div class="kpi-card">
          <div class="kpi-icon">📊</div>
          <div class="kpi-content">
            <div class="kpi-label">Eficiència</div>
            <div class="kpi-value">{{ kpis.efficiency }}</div>
            <div class="kpi-desc">Utilització de recursos</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estadístiques globals -->
    <div class="stats-section">
      <h2>📈 Estadístiques globals</h2>
      <div class="stats-overview">
        <div class="stat-item">
          <span class="stat-label">Viatges totals</span>
          <span class="stat-value">{{ stats.totalTrips }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Passatgers totals</span>
          <span class="stat-value">{{ stats.totalPassengers }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Km recorreguts</span>
          <span class="stat-value">{{ stats.totalKm.toFixed(1) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Cost total</span>
          <span class="stat-value">{{ stats.totalCost.toFixed(2) }}€</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Durada total</span>
          <span class="stat-value">{{ stats.totalDuration }}h</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Passatgers/viatge</span>
          <span class="stat-value">{{ stats.averagePassengers }}</span>
        </div>
      </div>
    </div>

    <!-- Analisi per tipus de viatge -->
    <div class="analysis-section">
      <h2>🚕 Analisi per tipus de vehicle</h2>
      <div class="analysis-grid">
        <div v-for="type in typeAnalysis" :key="type.type" class="analysis-card">
          <div class="card-header">
            <h3>{{ getTypeLabel(type.type) }}</h3>
            <span class="percentage">{{ type.percentage }}%</span>
          </div>
          <div class="chart-bar">
            <div class="bar-fill" :style="{ width: type.percentage + '%' }"></div>
          </div>
          <div class="card-stats">
            <div class="stat">
              <span class="label">Viatges:</span>
              <span class="value">{{ type.trips }}</span>
            </div>
            <div class="stat">
              <span class="label">Passatgers:</span>
              <span class="value">{{ type.passengers }}</span>
            </div>
            <div class="stat">
              <span class="label">km:</span>
              <span class="value">{{ type.km.toFixed(1) }}</span>
            </div>
            <div class="stat">
              <span class="label">Cost:</span>
              <span class="value">{{ type.cost.toFixed(2) }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Analisi regional -->
    <div class="analysis-section">
      <h2>🗺️ Analisi per regió</h2>
      <div class="regional-table">
        <table>
          <thead>
            <tr>
              <th>Regió</th>
              <th>Viatges</th>
              <th>Passatgers</th>
              <th>km</th>
              <th>Cost total</th>
              <th>Cost/viatge</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="region in regionalAnalysis" :key="region.region">
              <td class="region-name">📍 {{ region.region }}</td>
              <td>{{ region.trips }}</td>
              <td>{{ region.passengers }}</td>
              <td>{{ region.km.toFixed(1) }}</td>
              <td class="highlight">{{ region.cost.toFixed(2) }}€</td>
              <td>{{ (region.cost / region.trips).toFixed(2) }}€</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tendències mensuals -->
    <div class="analysis-section">
      <h2>📅 Tendències mensuals</h2>
      <div class="monthly-trends">
        <div v-for="month in monthlyTrends" :key="month.month" class="month-card">
          <h4>{{ formatMonth(month.month) }}</h4>
          <div class="trend-stat">
            <span class="icon">🚗</span>
            <span>{{ month.trips }} viatges</span>
          </div>
          <div class="trend-stat">
            <span class="icon">👥</span>
            <span>{{ month.passengers }} passatgers</span>
          </div>
          <div class="trend-stat">
            <span class="icon">🛣️</span>
            <span>{{ month.km.toFixed(1) }} km</span>
          </div>
          <div class="trend-stat">
            <span class="icon">€</span>
            <span>{{ month.cost.toFixed(2) }}€</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Prediccions -->
    <div class="analysis-section">
      <h2>🔮 Prediccions</h2>
      <div class="predictions-cards">
        <div class="prediction-card">
          <h3>Viatges setmanal estimat</h3>
          <div class="prediction-value">{{ predictions.estimatedWeeklyTrips }}</div>
          <p class="confidence">Confiança: {{ (predictions.confidence * 100).toFixed(0) }}%</p>
        </div>
        <div class="prediction-card">
          <h3>Viatges mensual estimat</h3>
          <div class="prediction-value">{{ predictions.estimatedMonthlyTrips }}</div>
          <p class="confidence">Tendència: {{ predictions.trend }}</p>
        </div>
        <div class="prediction-card">
          <h3>Cost mensual estimat</h3>
          <div class="prediction-value">{{ predictions.estimatedMonthlyCost }}€</div>
          <p class="confidence">Estimació per a propera</p>
        </div>
      </div>
    </div>

    <!-- Comparativa períodes -->
    <div class="analysis-section">
      <h2>📊 Comparativa períodes</h2>
      <div class="comparison-grid">
        <div class="comparison-card">
          <h3>{{ comparativeStats.current.period }}</h3>
          <div class="comparison-stats">
            <div class="comp-stat">
              <span class="label">Viatges</span>
              <span class="value">{{ comparativeStats.current.trips }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">Passatgers</span>
              <span class="value">{{ comparativeStats.current.passengers }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">km</span>
              <span class="value">{{ comparativeStats.current.km }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">Cost</span>
              <span class="value">{{ comparativeStats.current.cost }}€</span>
            </div>
          </div>
        </div>

        <div class="comparison-card comparison-card-previous">
          <h3>{{ comparativeStats.previous.period }}</h3>
          <div class="comparison-stats">
            <div class="comp-stat">
              <span class="label">Viatges</span>
              <span class="value">{{ comparativeStats.previous.trips }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">Passatgers</span>
              <span class="value">{{ comparativeStats.previous.passengers }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">km</span>
              <span class="value">{{ comparativeStats.previous.km }}</span>
            </div>
            <div class="comp-stat">
              <span class="label">Cost</span>
              <span class="value">{{ comparativeStats.previous.cost }}€</span>
            </div>
          </div>
        </div>
      </div>

      <div class="growth-indicators">
        <h4>Creixement respecte a setmana anterior</h4>
        <div class="growth-grid">
          <div class="growth-item positive">
            <span class="label">Viatges</span>
            <span class="growth">{{ comparativeStats.growth.trips }}</span>
          </div>
          <div class="growth-item positive">
            <span class="label">Passatgers</span>
            <span class="growth">{{ comparativeStats.growth.passengers }}</span>
          </div>
          <div class="growth-item positive">
            <span class="label">km</span>
            <span class="growth">{{ comparativeStats.growth.km }}</span>
          </div>
          <div class="growth-item positive">
            <span class="label">Cost</span>
            <span class="growth">{{ comparativeStats.growth.cost }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { analyticsService } from '../services/analyticsService';

// State
const activeTab = ref('overview');
const dateStart = ref(new Date(2024, 0, 8).toISOString().split('T')[0]);
const dateEnd = ref(new Date(2024, 0, 15).toISOString().split('T')[0]);

// Data
const stats = ref({});
const kpis = ref({});
const typeAnalysis = ref([]);
const regionalAnalysis = ref([]);
const monthlyTrends = ref([]);
const predictions = ref({});
const comparativeStats = ref({});

// Methods
const loadAnalytics = () => {
  stats.value = analyticsService.getYearlyStats();
  kpis.value = analyticsService.getKPIs();
  typeAnalysis.value = analyticsService.getTypeAnalysis();
  regionalAnalysis.value = analyticsService.getRegionalAnalysis();
  monthlyTrends.value = analyticsService.getMonthlyTrends();
  predictions.value = analyticsService.getPredictions();
  comparativeStats.value = analyticsService.getComparativeStats();
};

const applyDateRange = () => {
  // Cargar dades per rang de dates
  console.log('Aplicar filtre:', dateStart.value, 'a', dateEnd.value);
  loadAnalytics();
};

const downloadData = () => {
  analyticsService.downloadCSV(`analytics-${new Date().toISOString().split('T')[0]}.csv`);
};

const getTypeLabel = (type) => {
  const labels = {
    'normal': '🚗 Vehicle normal',
    'assisted': '♿ Vehicle assistit',
    'adapted': '🦽 Vehicle adaptat'
  };
  return labels[type] || type;
};

const formatMonth = (month) => {
  const [year, monthNum] = month.split('-');
  const date = new Date(year, parseInt(monthNum) - 1);
  return date.toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' });
};

onMounted(() => {
  loadAnalytics();
});
</script>

<style scoped>
.advanced-analytics-page {
  padding: 20px;
  max-width: 1600px;
  margin: 0 auto;
  background: #f8f9fa;
}

.page-header {
  margin-bottom: 30px;
  text-align: center;
}

.page-header h1 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 32px;
}

.page-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 16px;
}

/* Date Range Selector */
.date-range-selector {
  display: flex;
  gap: 15px;
  align-items: flex-end;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}

.date-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.date-input-group label {
  color: #2c3e50;
  font-weight: 600;
  font-size: 13px;
}

.date-input {
  padding: 10px;
  border: 1px solid #bdc3c7;
  border-radius: 6px;
  font-size: 14px;
  width: 150px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #4ECDC4;
  color: white;
}

.btn-primary:hover {
  background: #44A08D;
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
}

/* KPIs */
.kpis-section {
  margin-bottom: 30px;
}

.kpis-section h2 {
  color: #2c3e50;
  margin-bottom: 20px;
}

.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.kpi-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.kpi-icon {
  font-size: 40px;
  min-width: 50px;
  text-align: center;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  color: #7f8c8d;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 5px;
}

.kpi-value {
  font-size: 28px;
  font-weight: bold;
  color: #4ECDC4;
  margin-bottom: 5px;
}

.kpi-desc {
  color: #95a5a6;
  font-size: 12px;
}

/* Stats Overview */
.stats-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.stats-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.stat-item {
  background: #f8f9fa;
  border-left: 4px solid #4ECDC4;
  padding: 15px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 13px;
  font-weight: 600;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

/* Analysis */
.analysis-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.analysis-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.analysis-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid #e0e0e0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 16px;
}

.percentage {
  background: #4ECDC4;
  color: white;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 12px;
}

.chart-bar {
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 12px;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #4ECDC4, #44A08D);
  transition: width 0.3s ease;
}

.card-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 12px;
}

.stat {
  display: flex;
  justify-content: space-between;
  color: #555;
}

.stat .label {
  font-weight: 600;
}

.stat .value {
  color: #2c3e50;
  font-weight: 600;
}

/* Regional Table */
.regional-table {
  overflow-x: auto;
}

.regional-table table {
  width: 100%;
  border-collapse: collapse;
}

.regional-table th {
  background: #f0f0f0;
  padding: 12px;
  text-align: left;
  color: #2c3e50;
  font-weight: 600;
  font-size: 13px;
  border-bottom: 2px solid #ddd;
}

.regional-table td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555;
}

.regional-table tr:hover {
  background: #f8f9fa;
}

.region-name {
  font-weight: 600;
  color: #2c3e50;
}

.highlight {
  color: #4ECDC4;
  font-weight: 600;
}

/* Monthly Trends */
.monthly-trends {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.month-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #f39c12;
}

.month-card h4 {
  margin: 0 0 12px 0;
  color: #2c3e50;
  font-size: 14px;
}

.trend-stat {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #555;
}

.trend-stat .icon {
  font-size: 18px;
}

/* Predictions */
.predictions-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.prediction-card {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.prediction-card h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  opacity: 0.9;
}

.prediction-value {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 8px;
}

.confidence {
  margin: 0;
  font-size: 12px;
  opacity: 0.8;
}

/* Comparison */
.comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.comparison-card {
  background: #e8f8f6;
  border-left: 4px solid #27ae60;
  border-radius: 8px;
  padding: 15px;
}

.comparison-card-previous {
  background: #f5f5f5;
  border-left-color: #95a5a6;
}

.comparison-card h3 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 16px;
}

.comparison-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.comp-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.comp-stat .label {
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
}

.comp-stat .value {
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.growth-indicators {
  background: #f0fffe;
  border: 2px solid #4ECDC4;
  border-radius: 8px;
  padding: 15px;
}

.growth-indicators h4 {
  margin: 0 0 15px 0;
  color: #2c3e50;
}

.growth-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.growth-item {
  background: white;
  border: 2px solid #27ae60;
  border-radius: 6px;
  padding: 10px;
  text-align: center;
}

.growth-item.positive {
  border-color: #27ae60;
}

.growth-item .label {
  display: block;
  color: #7f8c8d;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
}

.growth-item .growth {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #27ae60;
}

@media (max-width: 768px) {
  .date-range-selector {
    flex-direction: column;
    align-items: stretch;
  }

  .date-input {
    width: 100%;
  }

  .kpis-grid {
    grid-template-columns: 1fr;
  }

  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .monthly-trends {
    grid-template-columns: repeat(2, 1fr);
  }

  .regional-table {
    font-size: 12px;
  }
}
</style>
