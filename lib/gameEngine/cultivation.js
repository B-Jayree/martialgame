// Cultivation Engine - Handles all cultivation-related calculations and logic

export class CultivationEngine {
  // Define all cultivation realms and their properties
  static REALMS = {
    'Mortal': { 
      name: 'Mortal', 
      maxStage: 3, 
      baseQi: 100,
      color: 'gray',
      description: 'An ordinary mortal with slight spiritual awareness',
      healthBonus: 0,
      statBonus: { strength: 0, agility: 0, intelligence: 0, vitality: 0 }
    },
    'Qi Condensation': { 
      name: 'Qi Condensation', 
      maxStage: 9, 
      baseQi: 500,
      color: 'green', 
      description: 'Can sense and absorb spiritual energy',
      healthBonus: 50,
      statBonus: { strength: 5, agility: 5, intelligence: 10, vitality: 5 }
    },
    'Foundation': { 
      name: 'Foundation', 
      maxStage: 9, 
      baseQi: 2000,
      color: 'blue',
      description: 'Established a solid foundation for cultivation',
      healthBonus: 100,
      statBonus: { strength: 10, agility: 10, intelligence: 20, vitality: 10 }
    },
    'Golden Core': { 
      name: 'Golden Core', 
      maxStage: 9, 
      baseQi: 10000,
      color: 'gold',
      description: 'Formed a golden core, lifespan extends significantly',
      healthBonus: 200,
      statBonus: { strength: 20, agility: 20, intelligence: 40, vitality: 20 }
    },
    'Nascent Soul': { 
      name: 'Nascent Soul', 
      maxStage: 9, 
      baseQi: 50000,
      color: 'purple',
      description: 'Cultivated a nascent soul, approaching immortality',
      healthBonus: 500,
      statBonus: { strength: 50, agility: 50, intelligence: 100, vitality: 50 }
    }
  };

  // Calculate how much qi needed for next breakthrough
  static calculateBreakthroughCost(currentRealm, currentStage) {
    const baseCost = this.REALMS[currentRealm]?.baseQi || 100;
    // Exponential cost increase: 100 * 1.8^(stage-1)
    return Math.floor(baseCost * Math.pow(1.8, currentStage - 1));
  }

  // Check if player can attempt breakthrough
  static canBreakthrough(playerCultivation) {
    if (!playerCultivation) return false;
    
    const { realm, stage, qi } = playerCultivation;
    const realmData = this.REALMS[realm];
    
    if (!realmData) return false;
    
    const cost = this.calculateBreakthroughCost(realm, stage);
    return qi >= cost && stage < realmData.maxStage;
  }

  // Calculate cultivation speed based on various factors
  static getCultivationSpeed(player, technique = null, locationBonus = 1) {
    if (!player?.cultivation) return 1;
    
    let speed = 1;
    
    // Realm multiplier (higher realms cultivate faster)
    const realmMultipliers = {
      'Mortal': 1,
      'Qi Condensation': 2,
      'Foundation': 4,
      'Golden Core': 8,
      'Nascent Soul': 16
    };
    
    speed *= realmMultipliers[player.cultivation.realm] || 1;
    
    // Technique multiplier
    if (technique && technique.efficiency) {
      speed *= technique.efficiency;
    }
    
    // Intelligence stat bonus (1% per point)
    if (player.stats?.intelligence) {
      speed *= (1 + player.stats.intelligence / 100);
    }
    
    // Cultivation stage bonus (slight boost per stage)
    if (player.cultivation.stage) {
      speed *= (1 + (player.cultivation.stage - 1) * 0.05);
    }
    
    // Location bonus (sacred grounds etc.)
    speed *= locationBonus;
    
    return Math.max(0.1, speed); // Minimum 10% speed
  }

  // Get cultivation progress percentage (0-100)
  static getProgressPercentage(playerCultivation) {
    if (!playerCultivation) return 0;
    
    const { realm, stage, qi } = playerCultivation;
    const cost = this.calculateBreakthroughCost(realm, stage);
    
    if (cost <= 0) return 100; // Max stage
    
    const progress = (qi / cost) * 100;
    return Math.min(progress, 100);
  }

  // Get next realm info
  static getNextRealmInfo(currentRealm) {
    const realms = Object.keys(this.REALMS);
    const currentIndex = realms.indexOf(currentRealm);
    
    if (currentIndex < realms.length - 1) {
      return this.REALMS[realms[currentIndex + 1]];
    }
    return null;
  }

  // Calculate stats after realm advancement
  static getRealmStats(realm, stage) {
    const realmData = this.REALMS[realm];
    if (!realmData) return { health: 100, stats: {} };
    
    // Base stats increase with realm
    const baseStats = {
      health: 100 + realmData.healthBonus + (stage * 10),
      stats: { ...realmData.statBonus }
    };
    
    // Additional stat growth per stage
    const stageMultiplier = stage * 0.5;
    baseStats.stats.strength += stageMultiplier;
    baseStats.stats.agility += stageMultiplier;
    baseStats.stats.intelligence += stageMultiplier;
    baseStats.stats.vitality += stageMultiplier;
    
    return baseStats;
  }

  // Calculate max health based on cultivation and vitality
  static calculateMaxHealth(player) {
    if (!player) return 100;
    
    const baseHealth = 100;
    const vitalityBonus = player.stats?.vitality ? player.stats.vitality * 2 : 0;
    const realmBonus = this.REALMS[player.cultivation?.realm]?.healthBonus || 0;
    const stageBonus = player.cultivation?.stage ? (player.cultivation.stage - 1) * 10 : 0;
    
    return baseHealth + vitalityBonus + realmBonus + stageBonus;
  }

  // Get cultivation efficiency (for UI display)
  static getCultivationEfficiency(player) {
    if (!player) return { speed: 1, bonuses: [] };
    
    const speed = this.getCultivationSpeed(player);
    const bonuses = [];
    
    // Realm bonus
    const realmMultipliers = {
      'Mortal': 1,
      'Qi Condensation': 2,
      'Foundation': 4,
      'Golden Core': 8,
      'Nascent Soul': 16
    };
    const realmBonus = realmMultipliers[player.cultivation.realm] || 1;
    if (realmBonus > 1) {
      bonuses.push(`Realm: ${(realmBonus - 1) * 100}%`);
    }
    
    // Intelligence bonus
    if (player.stats?.intelligence) {
      const intBonus = player.stats.intelligence / 100;
      bonuses.push(`Intelligence: ${(intBonus * 100).toFixed(0)}%`);
    }
    
    // Stage bonus
    const stageBonus = (player.cultivation.stage - 1) * 0.05;
    if (stageBonus > 0) {
      bonuses.push(`Stage: ${(stageBonus * 100).toFixed(0)}%`);
    }
    
    return { speed, bonuses };
  }

  // Calculate time required for cultivation (in seconds)
  static calculateCultivationTime(amount, player) {
    const speed = this.getCultivationSpeed(player);
    const baseTime = amount / 10; // Base: 10 qi per second
    return Math.max(1, baseTime / speed);
  }

  // Get all available realms for UI
  static getAllRealms() {
    return Object.values(this.REALMS);
  }

  // Get realm by name
  static getRealm(name) {
    return this.REALMS[name];
  }

  // Check if player can advance to next realm
  static canAdvanceRealm(playerCultivation) {
    if (!playerCultivation) return false;
    
    const { realm, stage } = playerCultivation;
    const realmData = this.REALMS[realm];
    
    return realmData && stage === realmData.maxStage;
  }

  // Calculate the benefits of next breakthrough
  static getBreakthroughBenefits(currentRealm, currentStage) {
    const benefits = [];
    
    if (this.canAdvanceRealm({ realm: currentRealm, stage: currentStage })) {
      const nextRealm = this.getNextRealmInfo(currentRealm);
      if (nextRealm) {
        benefits.push(`Advance to ${nextRealm.name}`);
        benefits.push(`+${nextRealm.healthBonus} Max Health`);
        benefits.push(`+${nextRealm.statBonus.strength} Strength`);
        benefits.push(`+${nextRealm.statBonus.agility} Agility`);
        benefits.push(`+${nextRealm.statBonus.intelligence} Intelligence`);
        benefits.push(`+${nextRealm.statBonus.vitality} Vitality`);
      }
    } else {
      benefits.push(`Advance to Stage ${currentStage + 1}`);
      benefits.push('+50 Max Qi');
      benefits.push('+5% Cultivation Speed');
      benefits.push('+1 to all stats');
    }
    
    return benefits;
  }

  // Validate cultivation data
  static validateCultivationData(cultivationData) {
    if (!cultivationData) return false;
    
    const { realm, stage, qi, maxQi } = cultivationData;
    
    // Check if realm exists
    if (!this.REALMS[realm]) return false;
    
    // Check stage bounds
    const realmData = this.REALMS[realm];
    if (stage < 1 || stage > realmData.maxStage) return false;
    
    // Check qi values
    if (qi < 0 || maxQi < 0 || qi > maxQi) return false;
    
    return true;
  }

  // Get cultivation rank (for sorting/comparison)
  static getCultivationRank(realm, stage) {
    const realms = Object.keys(this.REALMS);
    const realmIndex = realms.indexOf(realm);
    
    if (realmIndex === -1) return 0;
    
    // Each realm is worth 100 points, plus stages within realm
    return (realmIndex * 100) + stage;
  }

  // Compare two cultivation levels
  static compareCultivation(cultivationA, cultivationB) {
    const rankA = this.getCultivationRank(cultivationA.realm, cultivationA.stage);
    const rankB = this.getCultivationRank(cultivationB.realm, cultivationB.stage);
    
    if (rankA > rankB) return 1;
    if (rankA < rankB) return -1;
    return 0;
  }
}

// Export utility functions
export const cultivationUtils = {
  // Format qi amount for display
  formatQi: (qi) => {
    if (qi >= 1000000) return `${(qi / 1000000).toFixed(1)}M Qi`;
    if (qi >= 1000) return `${(qi / 1000).toFixed(1)}K Qi`;
    return `${Math.floor(qi)} Qi`;
  },

  // Get realm color for UI
  getRealmColor: (realm) => {
    return CultivationEngine.REALMS[realm]?.color || 'gray';
  },

  // Calculate required cultivation sessions
  calculateSessionsRequired: (targetQi, player, sessionLength = 10) => {
    const speed = CultivationEngine.getCultivationSpeed(player);
    const qiPerSession = sessionLength * speed;
    return Math.ceil(targetQi / qiPerSession);
  }
};

export default CultivationEngine;