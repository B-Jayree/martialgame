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
    },
    'Immortal Emperor': { 
      name: 'Immortal Emperor', 
      maxStage: 9, 
      baseQi: 250000,
      color: 'rainbow',
      description: 'The ultimate cultivation realm, ruler of the cosmos',
      healthBonus: 1000,
      statBonus: { strength: 100, agility: 100, intelligence: 200, vitality: 100 }
    }
  };

  // Constants for consistent calculations
  static BREAKTHROUGH_MULTIPLIERS = {
    STAGE: 1,
    REALM: 1 // Consistent 2x multiplier for realm advancement
  };

  // FIXED: Consistent breakthrough cost calculation
  static calculateBreakthroughCost(currentRealm, currentStage) {
    const realmData = this.REALMS[currentRealm];
    if (!realmData) {
      console.warn(`Invalid realm: ${currentRealm}`);
      return 100;
    }
    
    const baseCost = realmData.baseQi;
    
    // FIXED: Use stage-based multiplier instead of linear formula
    // This ensures 100% progress when qi reaches maxQi
    const stageMultiplier = 1 + ((currentStage - 1) * 0.3); // 30% increase per stage
    
    const cost = Math.floor(baseCost * stageMultiplier);
    
    // Validate cost
    if (cost <= 0 || !Number.isFinite(cost)) {
      console.warn(`Invalid breakthrough cost calculated: ${cost} for ${currentRealm} Stage ${currentStage}`);
      return baseCost;
    }
    
    return cost;
  }

  // FIXED: Progress calculation that makes sense
  static getProgressPercentage(playerCultivation) {
    if (!playerCultivation) return 0;
    
    const { realm, stage, qi, maxQi } = playerCultivation;
    
    // Handle invalid cultivation state
    if (!this.REALMS[realm] || stage < 1) return 0;
    
    const cost = this.calculateBreakthroughCost(realm, stage);
    
    // If at max cultivation or cost is invalid
    if (cost <= 0 || qi >= maxQi) return 100;
    
    // Progress is based on current Qi vs breakthrough cost, capped at 100%
    const progress = (qi / cost) * 100;
    return Math.min(100, Math.max(0, progress));
  }

  // FIXED: Consistent breakthrough logic
  static canBreakthrough(playerCultivation) {
    if (!playerCultivation) return false;
    
    const { realm, stage, qi } = playerCultivation;
    const realmData = this.REALMS[realm];
    
    if (!realmData) {
      console.warn(`Invalid realm in canBreakthrough: ${realm}`);
      return false;
    }
    
    const cost = this.calculateBreakthroughCost(realm, stage);
    
    // Check for stage advancement
    if (stage < realmData.maxStage) {
      return qi >= cost;
    }
    
    // Check for realm advancement
    const nextRealm = this.getNextRealmInfo(realm);
    if (nextRealm) {
      const realmCost = cost * this.BREAKTHROUGH_MULTIPLIERS.REALM;
      return qi >= realmCost;
    }
    
    return false; // Max cultivation reached
  }

  // FIXED: Simplified realm advancement check
  static canAdvanceRealm(playerCultivation) {
    if (!playerCultivation) return false;
    
    const { realm, stage, qi } = playerCultivation;
    const realmData = this.REALMS[realm];
    const nextRealm = this.getNextRealmInfo(realm);
    
    if (!realmData || !nextRealm) return false;
    
    // Need to be at max stage and have enough qi for realm advancement
    const realmAdvancementCost = this.calculateBreakthroughCost(realm, stage) * this.BREAKTHROUGH_MULTIPLIERS.REALM;
    return stage === realmData.maxStage && qi >= realmAdvancementCost;
  }

  // NEW: Simple cultivation gain calculation with validation
  static calculateCultivationGain(player, baseAmount) {
    if (!player?.cultivation) {
      console.warn('Invalid player object in calculateCultivationGain');
      return baseAmount;
    }
    
    if (baseAmount <= 0 || !Number.isFinite(baseAmount)) {
      console.warn(`Invalid baseAmount in calculateCultivationGain: ${baseAmount}`);
      return 0;
    }
    
    let gain = baseAmount;
    
    // Intelligence bonus (1% per point)
    if (player.stats?.intelligence) {
      gain *= (1 + player.stats.intelligence / 100);
    }
    
    // Cultivation speed
    if (player.cultivation.speed) {
      gain *= player.cultivation.speed;
    }
    
    const finalGain = Math.floor(gain);
    return finalGain > 0 ? finalGain : 0;
  }

  // Calculate automatic cultivation with breakthroughs
  static calculateCultivationCycle(player, cultivationAmount, autoBreakthrough = true) {
    if (!player?.cultivation) {
      return { newPlayerState: player, breakthroughs: [], qiUsed: 0 };
    }
    
    let remainingQi = Math.max(0, cultivationAmount);
    const breakthroughs = [];
    let newPlayerState = { ...player };
    
    while (remainingQi > 0) {
      const currentQi = newPlayerState.cultivation.qi;
      const maxQi = newPlayerState.cultivation.maxQi;
      const realm = newPlayerState.cultivation.realm;
      const stage = newPlayerState.cultivation.stage;
      
      // Add qi (capped at max)
      const qiToAdd = Math.min(remainingQi, maxQi - currentQi);
      newPlayerState.cultivation.qi = currentQi + qiToAdd;
      remainingQi -= qiToAdd;
      
      // Check for breakthroughs
      if (autoBreakthrough && this.canBreakthrough(newPlayerState.cultivation)) {
        if (this.canAdvanceRealm(newPlayerState.cultivation)) {
          // Realm advancement
          const nextRealm = this.getNextRealmInfo(realm);
          breakthroughs.push({
            type: 'realm',
            from: realm,
            to: nextRealm.name,
            stage: 1
          });
          
          newPlayerState.cultivation.realm = nextRealm.name;
          newPlayerState.cultivation.stage = 1;
          newPlayerState.cultivation.qi = 0;
          newPlayerState.cultivation.maxQi = nextRealm.baseQi;
          newPlayerState.cultivation.speed *= 1.2;
          
        } else {
          // Stage advancement
          breakthroughs.push({
            type: 'stage',
            realm: realm,
            from: stage,
            to: stage + 1
          });
          
          newPlayerState.cultivation.stage += 1;
          const breakthroughCost = this.calculateBreakthroughCost(realm, stage);
          newPlayerState.cultivation.qi -= breakthroughCost;
          newPlayerState.cultivation.maxQi = Math.floor(newPlayerState.cultivation.maxQi * 1.5);
        }
        
        // Reset remaining qi calculation since state changed
        remainingQi = cultivationAmount;
      } else {
        // No more breakthroughs possible or auto-breakthrough disabled
        break;
      }
    }
    
    return {
      newPlayerState,
      breakthroughs,
      qiUsed: cultivationAmount - remainingQi
    };
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
      'Nascent Soul': 16,
      'Immortal Emperor': 32
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
    
    // Cultivation speed from player state
    if (player.cultivation.speed) {
      speed *= player.cultivation.speed;
    }
    
    // Location bonus (sacred grounds etc.)
    speed *= locationBonus;
    
    return Math.max(0.1, speed); // Minimum 10% speed
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

  // Calculate max cultivation possible in one session
  static getMaxCultivationPossible(player) {
    if (!player?.cultivation) return 0;
    
    const { realm, stage, qi, maxQi } = player.cultivation;
    const realmData = this.REALMS[realm];
    
    if (!realmData) return 0;
    
    let totalCultivation = 0;
    let currentStage = stage;
    let currentRealm = realm;
    let currentQi = qi;
    
    while (currentRealm && currentStage <= realmData.maxStage) {
      const breakthroughCost = this.calculateBreakthroughCost(currentRealm, currentStage);
      const qiNeeded = breakthroughCost - currentQi;
      totalCultivation += Math.max(0, qiNeeded);
      
      // Move to next stage
      currentStage++;
      currentQi = 0;
      
      // Check for realm advancement
      if (currentStage > realmData.maxStage) {
        const nextRealm = this.getNextRealmInfo(currentRealm);
        if (nextRealm) {
          currentRealm = nextRealm.name;
          currentStage = 1;
        } else {
          break; // Reached max realm
        }
      }
    }
    
    return totalCultivation;
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
      'Nascent Soul': 16,
      'Immortal Emperor': 32
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
    
    // Speed bonus from cultivation
    if (player.cultivation.speed && player.cultivation.speed > 1) {
      bonuses.push(`Cultivation: ${((player.cultivation.speed - 1) * 100).toFixed(0)}%`);
    }
    
    return { speed, bonuses };
  }

  // Check if player has reached maximum cultivation
  static hasReachedMaxCultivation(playerCultivation) {
    if (!playerCultivation) return false;
    
    const { realm, stage } = playerCultivation;
    const realmData = this.REALMS[realm];
    const nextRealm = this.getNextRealmInfo(realm);
    
    return stage === realmData.maxStage && !nextRealm;
  }

  // Get all available realms for UI
  static getAllRealms() {
    return Object.values(this.REALMS);
  }

  // Get realm by name
  static getRealm(name) {
    return this.REALMS[name];
  }

  // FIXED: Better breakthrough benefits calculation
  static getBreakthroughBenefits(currentRealm, currentStage) {
    const benefits = [];
    const realmData = this.REALMS[currentRealm];
    const nextRealm = this.getNextRealmInfo(currentRealm);
    
    if (currentStage >= realmData.maxStage && nextRealm) {
      // Realm advancement
      benefits.push(`🌟 Advance to ${nextRealm.name} Realm`);
      benefits.push(`❤️ +${nextRealm.healthBonus} Max Health`);
      benefits.push(`💪 +${nextRealm.statBonus.strength} Strength`);
      benefits.push(`🏃 +${nextRealm.statBonus.agility} Agility`);
      benefits.push(`🧠 +${nextRealm.statBonus.intelligence} Intelligence`);
      benefits.push(`🛡️ +${nextRealm.statBonus.vitality} Vitality`);
      benefits.push(`⚡ +20% Cultivation Speed`);
    } else if (this.canBreakthrough({ realm: currentRealm, stage: currentStage, qi: 0 })) {
      // Stage advancement
      benefits.push(`⚡ Advance to Stage ${currentStage + 1}`);
      benefits.push(`🌀 +50% Max Qi`);
      benefits.push(`🎯 +5% Cultivation Speed`);
      benefits.push(`📈 +1 to all stats`);
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

  // FIXED: Complete compareCultivation method
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
  },

  // Estimate time to reach target
  estimateTimeToTarget: (targetRealm, targetStage, player) => {
    const currentRank = CultivationEngine.getCultivationRank(player.cultivation.realm, player.cultivation.stage);
    const targetRank = CultivationEngine.getCultivationRank(targetRealm, targetStage);
    
    if (targetRank <= currentRank) return "Already achieved";
    
    const rankDifference = targetRank - currentRank;
    const averageQiNeeded = 1000 * rankDifference; // Rough estimate
    const dailyQi = CultivationEngine.getCultivationSpeed(player) * 3600; // Qi per hour * 24
    
    const days = averageQiNeeded / dailyQi;
    
    if (days < 1) return "Less than a day";
    if (days < 7) return `${Math.ceil(days)} days`;
    if (days < 30) return `${Math.ceil(days / 7)} weeks`;
    return `${Math.ceil(days / 30)} months`;
  }
};

export default CultivationEngine;