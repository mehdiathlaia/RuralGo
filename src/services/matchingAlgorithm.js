/**
 * Algoritme Intel·ligent de Matching RURAL-GO VIVA
 * Assigna el millor conductor/vehicle basant-se en múltiples criteris
 */

export const matchingAlgorithm = {
  /**
   * Calcula la distància entre dos punts (Haversine formula)
   */
  calculateDistance(from, to) {
    const R = 6371; // km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round((R * c) * 10) / 10;
  },

  /**
   * Calcula puntuació per a cada conductor
   * Valora: proximitat, tipo de vehicle, disponibilitat, rating
   */
  scoreDriver(driver, clientLocation, requiredVehicleType) {
    let score = 100;

    // 1. Penalització per distància (40 punts màxims)
    const distance = this.calculateDistance(driver.location, clientLocation);
    const distancePenalty = Math.min(40, (distance / 10) * 40);
    score -= distancePenalty;

    // 2. Penalització per tipus de vehicle incorrecte (30 punts)
    if (requiredVehicleType && driver.type !== requiredVehicleType && driver.type !== 'adapted') {
      score -= 30; // Els adaptats sempre són compatibles
    }

    // 3. Bonus per rating (20 punts)
    const ratingBonus = (driver.rating / 5) * 20;
    score += ratingBonus;

    // 4. Penalització si no està disponible
    if (!driver.available) {
      score = 0;
    }

    return Math.max(0, score);
  },

  /**
   * Troba el millor conductor segons criteris
   */
  findBestDriver(drivers, clientLocation, requiredVehicleType = 'normal') {
    // Filtra drivers disponibles del tipus requerit
    let candidates = drivers.filter(d => d.available);

    // Prioritza drivers del tipo exacte requerit
    const exactMatch = candidates.filter(d => d.type === requiredVehicleType);
    if (exactMatch.length > 0) {
      candidates = exactMatch;
    } else {
      // Si no hi ha match exacte, accepta adaptats
      const adaptedMatch = candidates.filter(d => d.type === 'adapted');
      if (adaptedMatch.length > 0) {
        candidates = adaptedMatch;
      }
    }

    if (candidates.length === 0) {
      return null; // No hi ha drivers disponibles
    }

    // Calcula puntuacions i tria el millor
    let bestDriver = null;
    let bestScore = -1;

    candidates.forEach(driver => {
      const score = this.scoreDriver(driver, clientLocation, requiredVehicleType);
      if (score > bestScore) {
        bestScore = score;
        bestDriver = driver;
      }
    });

    return { driver: bestDriver, score: bestScore };
  },

  /**
   * Estima el temps de trajecte
   */
  estimateTime(distance) {
    // Velocitat mitjana: 40 km/h en zona rural
    const drivingTime = (distance / 40) * 60; // minuts
    const pickupTime = 5; // minuts per preparar pickup
    return Math.round(pickupTime + drivingTime);
  },

  /**
   * Detecta condicions del camí basant-se en l'adreça
   */
  detectPathCondition(address) {
    const ruralsKeywords = ['camí', 'carretera', 'pista', 'caminal', 'senda', 'rural'];
    const isRural = ruralsKeywords.some(kw => address.toLowerCase().includes(kw));

    if (isRural) {
      return {
        type: 'rural',
        description: 'Camí rural: terra compactada, accessible',
        difficulty: 'moderate',
        icon: '🛣️'
      };
    }

    return {
      type: 'urban',
      description: 'Via urbana: asfaltat i en bon estat',
      difficulty: 'easy',
      icon: '🚗'
    };
  },

  /**
   * Recomana opcions de servei RURAL-GO basant-se en el perfil
   */
  recommendServices(userProfile = {}) {
    const recommendations = [];

    // Exemple de perfil: { age, interests, health, mobility, lastActivities }
    const age = userProfile.age || 70;
    const interests = userProfile.interests || [];
    const health = userProfile.health || 'normal';
    const mobility = userProfile.mobility || 'normal';

    // Recomanacions per edat i mobilitat
    if (age > 65 || health === 'limited') {
      recommendations.push('salut'); // Viatges al CAP
    }

    if (mobility !== 'normal') {
      // Recomanacions d'activitats accessibles
      recommendations.push('natura'); // Passejos accessibles
      recommendations.push('compres'); // Serveis comunitaris i compres
    } else {
      // Per a persones amb mobilitat normal
      recommendations.push('cultura');
      recommendations.push('familia');
    }

    recommendations.push('salut'); // Sempre disponible

    return [...new Set(recommendations)]; // Elimina duplicats
  },

  /**
   * Prioritza cercants d'emergència
   */
  findClosestDriverForEmergency(drivers, clientLocation) {
    const available = drivers.filter(d => d.available);
    if (available.length === 0) return null;

    let closest = available[0];
    let minDistance = this.calculateDistance(closest.location, clientLocation);

    available.forEach(driver => {
      const distance = this.calculateDistance(driver.location, clientLocation);
      if (distance < minDistance) {
        minDistance = distance;
        closest = driver;
      }
    });

    return { driver: closest, distance: minDistance, eta: Math.ceil(minDistance * 1.5) }; // ETA en minuts
  }
};
