// Analytics Service per a Planification avançada

export const analyticsService = {
  // Dades simulades de viatges
  trips: [
    { id: 1, date: '2024-01-15', region: 'Barcelona', type: 'normal', passengers: 2, km: 12.5, duration: 35, cost: 18.75 },
    { id: 2, date: '2024-01-15', region: 'Barcelona', type: 'assisted', passengers: 1, km: 8.3, duration: 25, cost: 15.50 },
    { id: 3, date: '2024-01-14', region: 'Terrassa', type: 'normal', passengers: 3, km: 22.1, duration: 45, cost: 32.50 },
    { id: 4, date: '2024-01-14', region: 'Sabadell', type: 'adapted', passengers: 1, km: 15.0, duration: 40, cost: 28.75 },
    { id: 5, date: '2024-01-13', region: 'Barcelona', type: 'normal', passengers: 2, km: 10.2, duration: 30, cost: 15.30 },
    { id: 6, date: '2024-01-13', region: 'Barcelona', type: 'normal', passengers: 1, km: 7.5, duration: 22, cost: 11.25 },
    { id: 7, date: '2024-01-12', region: 'Cerdanyola', type: 'assisted', passengers: 1, km: 18.0, duration: 50, cost: 36.00 },
    { id: 8, date: '2024-01-12', region: 'Barcelona', type: 'normal', passengers: 4, km: 9.8, duration: 28, cost: 14.70 },
  ],

  // Obtenir dades per any
  getYearlyStats() {
    return {
      totalTrips: this.trips.length,
      totalPassengers: this.trips.reduce((sum, t) => sum + t.passengers, 0),
      totalKm: this.trips.reduce((sum, t) => sum + t.km, 0),
      totalCost: this.trips.reduce((sum, t) => sum + t.cost, 0),
      totalDuration: this.trips.reduce((sum, t) => sum + t.duration, 0),
      averagePassengers: (this.trips.reduce((sum, t) => sum + t.passengers, 0) / this.trips.length).toFixed(2),
      averageKm: (this.trips.reduce((sum, t) => sum + t.km, 0) / this.trips.length).toFixed(2),
      averageCost: (this.trips.reduce((sum, t) => sum + t.cost, 0) / this.trips.length).toFixed(2)
    };
  },

  // Dades per mes
  getMonthlyTrends() {
    const months = {};
    
    this.trips.forEach(trip => {
      const date = new Date(trip.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!months[monthKey]) {
        months[monthKey] = { trips: 0, passengers: 0, km: 0, cost: 0 };
      }
      
      months[monthKey].trips++;
      months[monthKey].passengers += trip.passengers;
      months[monthKey].km += trip.km;
      months[monthKey].cost += trip.cost;
    });
    
    return Object.entries(months).map(([month, data]) => ({
      month,
      ...data
    }));
  },

  // Dades per regió
  getRegionalAnalysis() {
    const regions = {};
    
    this.trips.forEach(trip => {
      if (!regions[trip.region]) {
        regions[trip.region] = { trips: 0, passengers: 0, km: 0, cost: 0 };
      }
      
      regions[trip.region].trips++;
      regions[trip.region].passengers += trip.passengers;
      regions[trip.region].km += trip.km;
      regions[trip.region].cost += trip.cost;
    });
    
    return Object.entries(regions)
      .map(([region, data]) => ({
        region,
        ...data
      }))
      .sort((a, b) => b.trips - a.trips);
  },

  // Dades per tipus de viatge
  getTypeAnalysis() {
    const types = {};
    
    this.trips.forEach(trip => {
      if (!types[trip.type]) {
        types[trip.type] = { trips: 0, passengers: 0, km: 0, cost: 0, percentage: 0 };
      }
      
      types[trip.type].trips++;
      types[trip.type].passengers += trip.passengers;
      types[trip.type].km += trip.km;
      types[trip.type].cost += trip.cost;
    });
    
    const total = this.trips.length;
    return Object.entries(types)
      .map(([type, data]) => ({
        type,
        ...data,
        percentage: ((data.trips / total) * 100).toFixed(1)
      }))
      .sort((a, b) => b.trips - a.trips);
  },

  // Exportar dades CSV
  exportToCSV() {
    const headers = ['ID', 'Data', 'Regió', 'Tipus', 'Passatgers', 'km', 'Durada (min)', 'Cost (€)'];
    const rows = this.trips.map(t => [
      t.id,
      t.date,
      t.region,
      t.type,
      t.passengers,
      t.km.toFixed(1),
      t.duration,
      t.cost.toFixed(2)
    ]);
    
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csv;
  },

  // Descarregar CSV
  downloadCSV(filename = 'trips-export.csv') {
    const csv = this.exportToCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  },

  // Obtenir dades per rang de dates
  getDataByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return this.trips.filter(trip => {
      const tripDate = new Date(trip.date);
      return tripDate >= start && tripDate <= end;
    });
  },

  // Estadístiques comparatives
  getComparativeStats(dateRange = 'month') {
    // Simulació de dades comparatives
    return {
      current: {
        period: 'Aquesta setmana',
        trips: 8,
        passengers: 14,
        km: 103.4,
        cost: 172.75
      },
      previous: {
        period: 'Setmana anterior',
        trips: 6,
        passengers: 10,
        km: 85.2,
        cost: 128.30
      },
      growth: {
        trips: '+33.3%',
        passengers: '+40%',
        km: '+21.3%',
        cost: '+34.6%'
      }
    };
  },

  // Generar prediccions
  getPredictions() {
    return {
      estimatedWeeklyTrips: 8.5,
      estimatedMonthlyTrips: 34,
      estimatedMonthlyCost: 680,
      trend: 'upward',
      confidence: 0.85
    };
  },

  // KPIs principals
  getKPIs() {
    const stats = this.getYearlyStats();
    return {
      occupancyRate: (stats.totalPassengers / (stats.totalTrips * 4) * 100).toFixed(1) + '%',
      costPerKm: (stats.totalCost / stats.totalKm).toFixed(2),
      costPerPassenger: (stats.totalCost / stats.totalPassengers).toFixed(2),
      averageTripsPerDay: (stats.totalTrips / 8).toFixed(1),
      efficiency: ((stats.totalPassengers / stats.totalTrips) * 100).toFixed(1) + '%'
    };
  }
};
