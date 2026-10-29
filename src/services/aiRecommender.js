// AI Recommender Service per a Domus Viva
// Proporciona recomanacions personalitzades d'activitats culturals i socials

export const aiRecommender = {
  // Base de dades d'activitats
  activities: {
    cultura: [
      {
        id: 'act-001',
        name: 'Teatre Municipal',
        description: 'Obra de teatre clàssic',
        location: 'Plaça Major, Barcelona',
        category: 'cultura',
        difficulty: 'baix',
        price: 15,
        rating: 4.5,
        duration: '2h',
        tags: ['teatre', 'clàssic', 'entreteniment']
      },
      {
        id: 'act-002',
        name: 'Cinema El Roure',
        description: 'Pel·lícula documental sobre natura',
        location: 'Carrer del Cinema, Barcelona',
        category: 'cultura',
        difficulty: 'baix',
        price: 8,
        rating: 4.2,
        duration: '1h 45m',
        tags: ['cinema', 'documental', 'natura']
      },
      {
        id: 'act-003',
        name: 'Concert Jazz a la Plaça',
        description: 'Música en directe de bandes locals',
        location: 'Plaça Reial, Barcelona',
        category: 'cultura',
        difficulty: 'baix',
        price: 12,
        rating: 4.7,
        duration: '2h',
        tags: ['música', 'jazz', 'en viu']
      },
      {
        id: 'act-004',
        name: 'Exposició d\'art contemporani',
        description: 'Galeria d\'art amb obres locals',
        location: 'Museu d\'Art Modern',
        category: 'cultura',
        difficulty: 'mig',
        price: 10,
        rating: 4.3,
        duration: '1h 30m',
        tags: ['art', 'modern', 'galeria']
      }
    ],
    natura: [
      {
        id: 'act-005',
        name: 'Passeig al riu Besòs',
        description: 'Caminada relaxant seguint el riu',
        location: 'Besòs Park, Barcelona',
        category: 'natura',
        difficulty: 'baix',
        price: 0,
        rating: 4.6,
        duration: '1h 30m',
        tags: ['camí', 'natura', 'relaxació']
      },
      {
        id: 'act-006',
        name: 'Sortida terapèutica al bosc',
        description: 'Activitat de connexió amb la natura',
        location: 'Bosc de Montserrat',
        category: 'natura',
        difficulty: 'mig',
        price: 5,
        rating: 4.8,
        duration: '2h',
        tags: ['bosc', 'teràpia', 'meditació']
      },
      {
        id: 'act-007',
        name: 'Observació d\'ocells',
        description: 'Senderisme especialitzat',
        location: 'Delta del Llobregat',
        category: 'natura',
        difficulty: 'mig',
        price: 8,
        rating: 4.4,
        duration: '2h 30m',
        tags: ['birdwatching', 'senderisme', 'fauna']
      }
    ],
    social: [
      {
        id: 'act-008',
        name: 'Grup de jocs de taula',
        description: 'Reunió setmanal de jocs de societat',
        location: 'Centre Cívic, Barcelona',
        category: 'social',
        difficulty: 'baix',
        price: 3,
        rating: 4.5,
        duration: '2h',
        tags: ['jocs', 'social', 'comunitat']
      },
      {
        id: 'act-009',
        name: 'Tallerr de cuina tradicional',
        description: 'Aprèn receptes de la cuina local',
        location: 'Escola de Cuina, Barcelona',
        category: 'social',
        difficulty: 'mig',
        price: 20,
        rating: 4.7,
        duration: '2h 30m',
        tags: ['cuina', 'tradició', 'aprenentatge']
      },
      {
        id: 'act-010',
        name: 'Club de lectura',
        description: 'Discussió d\'obres literàries',
        location: 'Biblioteca Municipal',
        category: 'social',
        difficulty: 'baix',
        price: 0,
        rating: 4.3,
        duration: '1h 30m',
        tags: ['literatura', 'discussió', 'cultura']
      }
    ]
  },

  // Obtenir suggerències per propòsit
  getSuggestions(purpose, userProfile = {}) {
    const activities = this.activities[purpose] || [];
    
    // Filtrar segons perfil de l'usuari si disponible
    if (userProfile.difficulty) {
      return activities
        .filter(a => a.difficulty === userProfile.difficulty)
        .sort((a, b) => b.rating - a.rating);
    }
    
    return activities.sort((a, b) => b.rating - a.rating);
  },

  // Recomanacions personalitzades
  getPersonalizedRecommendations(userProfile = {}) {
    let recommendations = [];
    
    // Si l'usuari té interessos definits
    if (userProfile.interests && Array.isArray(userProfile.interests)) {
      userProfile.interests.forEach(interest => {
        const matching = this.activities[interest] || [];
        recommendations = [...recommendations, ...matching];
      });
    } else {
      // Si no, retorna una selecció variada
      recommendations = [
        ...this.activities.cultura.slice(0, 2),
        ...this.activities.natura.slice(0, 2),
        ...this.activities.social.slice(0, 1)
      ];
    }
    
    // Ordenar per rating i limitar resultats
    return recommendations
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  },

  // Buscar activitats per tags
  searchByTags(tags) {
    const allActivities = [
      ...this.activities.cultura,
      ...this.activities.natura,
      ...this.activities.social
    ];
    
    return allActivities.filter(activity =>
      tags.some(tag => activity.tags.includes(tag))
    ).sort((a, b) => b.rating - a.rating);
  },

  // Obtenir activitats per dificultats
  getByDifficulty(difficulty) {
    const allActivities = [
      ...this.activities.cultura,
      ...this.activities.natura,
      ...this.activities.social
    ];
    
    return allActivities.filter(a => a.difficulty === difficulty);
  },

  // Obtenir activitats accessibles (baix cost, baix esforç)
  getAccessibleActivities() {
    const allActivities = [
      ...this.activities.cultura,
      ...this.activities.natura,
      ...this.activities.social
    ];
    
    return allActivities
      .filter(a => a.difficulty === 'baix' && a.price <= 15)
      .sort((a, b) => b.rating - a.rating);
  },

  // Obtenir activitats per rang de preu
  getByPrice(maxPrice) {
    const allActivities = [
      ...this.activities.cultura,
      ...this.activities.natura,
      ...this.activities.social
    ];
    
    return allActivities
      .filter(a => a.price <= maxPrice)
      .sort((a, b) => b.rating - a.rating);
  },

  // Recomanació del dia
  getDailyRecommendation() {
    const allActivities = [
      ...this.activities.cultura,
      ...this.activities.natura,
      ...this.activities.social
    ];
    
    // Agafar una activitat aleatòria del top 5
    const topActivities = allActivities
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
    
    return topActivities[Math.floor(Math.random() * topActivities.length)];
  },

  // Matchejar usuari amb activitat
  matchUserWithActivity(userProfile) {
    const recommendations = this.getPersonalizedRecommendations(userProfile);
    
    return {
      recommendations,
      summary: `Hem trobar ${recommendations.length} activitats adaptades als teus interessos`,
      nextEvent: recommendations[0] || null
    };
  }
};

