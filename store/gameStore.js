import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CultivationEngine } from '@/lib/gameEngine/cultivation';
import { CombatEngine } from '@/lib/gameEngine/combat';

// Migration function to handle version changes
const migrations = {
  0: (persistedState) => {
    // Version 0 to 1 migration
    return persistedState;
  },
  1: (persistedState) => {
    // Version 1 to 2 migration
    return persistedState;
  },
  2: (persistedState) => {
    // Version 2 to 3 migration
    return persistedState;
  },
  3: (persistedState) => {
    // Version 3 to 4 migration
    return persistedState;
  },
  4: (persistedState) => {
    // Version 4 to 5 migration - ensure proper cultivation state
    if (persistedState?.player?.cultivation) {
      return {
        ...persistedState,
        player: {
          ...persistedState.player,
          cultivation: {
            realm: persistedState.player.cultivation.realm || 'Mortal',
            stage: persistedState.player.cultivation.stage || 1,
            qi: Math.min(
              persistedState.player.cultivation.qi || 0,
              persistedState.player.cultivation.maxQi || 100
            ),
            maxQi: persistedState.player.cultivation.maxQi || 100,
            speed: persistedState.player.cultivation.speed || 1,
            lastCultivationTime: persistedState.player.cultivation.lastCultivationTime || Date.now()
          },
          health: Math.min(
            persistedState.player.health || 100,
            persistedState.player.maxHealth || 100
          ),
          maxHealth: persistedState.player.maxHealth || 100
        }
      };
    }
    return persistedState;
  }
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      player: {
        _id: null,
        name: '',
        sect: '',
        health: 100,
        maxHealth: 100,
        cultivation: {
          realm: 'Mortal',
          stage: 1,
          qi: 0,
          maxQi: 100,
          speed: 1,
          lastCultivationTime: Date.now()
        },
        stats: {
          strength: 10,
          agility: 10,
          intelligence: 10,
          vitality: 10
        },
        inventory: [],
        techniques: [],
        location: 'starting-village',
        gold: 100,
        experience: 0,
        level: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      world: {
        currentTime: Date.now(),
        discoveredLocations: ['starting-village'],
        activeQuests: [],
        completedQuests: [],
        factionRelations: {
          'Righteous Sects': 50,
          'Demonic Cult': -50,
          'Neutral Clans': 0
        }
      },
      combat: {
        inCombat: false,
        currentEnemy: null,
        combatLog: []
      },
      isLoading: false,
      error: null,

      // Initialize player
      initializePlayer: (playerData) => set({
        player: {
          ...get().player,
          name: playerData.name,
          sect: playerData.sect,
          createdAt: playerData.startingTime || new Date().toISOString()
        }
      }),

      // Enhanced Cultivation System with validation
      cultivate: (amount) => set(state => {
        // Input validation
        if (amount <= 0 || !Number.isFinite(amount)) {
          console.warn('Invalid cultivation amount:', amount);
          return { ...state, error: 'Invalid cultivation amount' };
        }

        const currentQi = state.player.cultivation.qi;
        const maxQi = state.player.cultivation.maxQi;
        const newQi = Math.min(currentQi + amount, maxQi);
        const gainedQi = newQi - currentQi;

        // Gain experience from cultivation
        const expGain = Math.floor(gainedQi / 10);

        return {
          player: {
            ...state.player,
            cultivation: {
              ...state.player.cultivation,
              qi: newQi,
              lastCultivationTime: Date.now()
            },
            experience: state.player.experience + expGain,
            updatedAt: new Date().toISOString()
          },
          error: null
        };
      }),

      // Auto-cultivation based on time passed
      processAutoCultivation: () => set(state => {
        const lastTime = state.player.cultivation.lastCultivationTime || Date.now();
        const currentTime = Date.now();
        const timeDiff = Math.floor((currentTime - lastTime) / 1000); // seconds
        
        if (timeDiff < 1) return state;

        const autoQi = Math.floor(timeDiff * state.player.cultivation.speed * 0.1);
        
        if (autoQi <= 0) return state;

        const newQi = Math.min(state.player.cultivation.qi + autoQi, state.player.cultivation.maxQi);
        
        return {
          player: {
            ...state.player,
            cultivation: {
              ...state.player.cultivation,
              qi: newQi,
              lastCultivationTime: currentTime
            },
            updatedAt: new Date().toISOString()
          },
          world: {
            ...state.world,
            currentTime: currentTime
          },
          error: null
        };
      }),

      // FIXED Breakthrough System - Proper realm advancement handling
      breakthrough: () => set(state => {
        const { realm, stage, qi, maxQi } = state.player.cultivation;
        
        console.log(`🧘 Breakthrough Attempt: ${realm} Stage ${stage}, Qi: ${qi}/${maxQi}`);
        
        // Use CultivationEngine for consistent calculations
        const breakthroughCost = CultivationEngine.calculateBreakthroughCost(realm, stage);
        console.log(`💰 Breakthrough Cost: ${breakthroughCost} Qi`);
        
        // Get realm data
        const realmData = CultivationEngine.REALMS[realm];
        if (!realmData) {
          console.log('❌ Invalid realm data');
          return { ...state, error: 'Invalid cultivation realm' };
        }
        
        console.log(`📊 Realm Data: Max Stage ${realmData.maxStage}, Current Stage ${stage}`);
        
        // Check if we can advance to next stage within same realm
        const canAdvanceStage = stage < realmData.maxStage && qi >= breakthroughCost;
        console.log(`🎯 Can advance stage: ${canAdvanceStage}`);
        
        if (canAdvanceStage) {
          console.log(`🚀 Advancing to Stage ${stage + 1}`);
          
          const newPlayerState = {
            player: {
              ...state.player,
              cultivation: {
                ...state.player.cultivation,
                stage: stage + 1,
                qi: qi - breakthroughCost,
                maxQi: Math.floor(maxQi * 1.5), // 50% increase
                lastCultivationTime: Date.now()
              },
              stats: {
                ...state.player.stats,
                strength: state.player.stats.strength + 1,
                agility: state.player.stats.agility + 1,
                intelligence: state.player.stats.intelligence + 2,
                vitality: state.player.stats.vitality + 1
              },
              maxHealth: state.player.maxHealth + 20,
              health: Math.min(state.player.maxHealth + 20, state.player.health + 20),
              experience: state.player.experience + 100,
              updatedAt: new Date().toISOString()
            },
            error: null
          };
          
          console.log(`✅ SUCCESS: Advanced to ${realm} Stage ${stage + 1}`);
          console.log(`🆕 New State: Qi ${newPlayerState.player.cultivation.qi}/${newPlayerState.player.cultivation.maxQi}`);
          return newPlayerState;
        }
        
        // Check if we can advance to next realm - USING CONSISTENT MULTIPLIER
        const nextRealm = CultivationEngine.getNextRealmInfo(realm);
        const realmAdvancementMultiplier = 1; // Consistent with CultivationEngine
        const realmCost = breakthroughCost * realmAdvancementMultiplier;
        const canAdvanceRealm = stage === realmData.maxStage && nextRealm && qi >= realmCost;
        
        console.log(`🌌 Can advance realm: ${canAdvanceRealm}`);
        console.log(`🔮 Next realm: ${nextRealm?.name}`);
        console.log(`💎 Realm cost: ${realmCost} Qi`);
        
        if (canAdvanceRealm) {
          console.log(`🌟 Advancing to ${nextRealm.name} Realm!`);
          
          const newPlayerState = {
            player: {
              ...state.player,
              cultivation: {
                realm: nextRealm.name,
                stage: 1, // Start at stage 1 in new realm
                qi: Math.max(0, qi - realmCost),
                maxQi: nextRealm.baseQi,
                speed: state.player.cultivation.speed * 1.2,
                lastCultivationTime: Date.now()
              },
              stats: {
                strength: state.player.stats.strength + nextRealm.statBonus.strength,
                agility: state.player.stats.agility + nextRealm.statBonus.agility,
                intelligence: state.player.stats.intelligence + nextRealm.statBonus.intelligence,
                vitality: state.player.stats.vitality + nextRealm.statBonus.vitality
              },
              maxHealth: state.player.maxHealth + nextRealm.healthBonus,
              health: state.player.maxHealth + nextRealm.healthBonus, // Full heal
              experience: state.player.experience + 500,
              level: state.player.level + 1,
              updatedAt: new Date().toISOString()
            },
            error: null
          };
          
          console.log(`🎉 REALM ADVANCEMENT: Now in ${nextRealm.name} Realm!`);
          return newPlayerState;
        }
        
        // If we get here, breakthrough failed
        let errorMessage = '';
        if (qi < breakthroughCost) {
          errorMessage = `Need ${breakthroughCost} Qi for stage advancement, but only have ${qi} Qi`;
        } else if (stage >= realmData.maxStage && !nextRealm) {
          errorMessage = 'You have reached the peak of cultivation!';
        } else if (stage >= realmData.maxStage) {
          errorMessage = `Need ${realmCost} Qi to advance to ${nextRealm.name} Realm`;
        } else {
          errorMessage = 'Cannot breakthrough at this time';
        }
        
        console.log(`❌ Breakthrough failed: ${errorMessage}`);
        return { ...state, error: errorMessage };
      }),

      // Health System
      regenerateHealth: (amount = 5) => set(state => ({
        player: {
          ...state.player,
          health: Math.min(state.player.maxHealth, state.player.health + amount),
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      takeDamage: (amount) => set(state => ({
        player: {
          ...state.player,
          health: Math.max(0, state.player.health - amount),
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      healFull: () => set(state => ({
        player: {
          ...state.player,
          health: state.player.maxHealth,
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      // Enhanced Item System with validation
      useItem: (itemId) => set(state => {
        const item = state.player.inventory.find(item => item.id === itemId);
        if (!item) {
          return { ...state, error: 'Item not found' };
        }

        let healthChange = 0;
        let qiChange = 0;
        let statChanges = {};
        let message = 'Item used';

        // Enhanced item effects
        const itemEffects = {
          'healing-pill': { 
            health: 50, 
            qi: 0, 
            message: 'Restored 50 health' 
          },
          'qi-pill': { 
            health: 0, 
            qi: 80, 
            message: 'Gained 80 Qi' 
          },
          'great-pill': { 
            health: 80, 
            qi: 120, 
            message: 'Gained 80 health and 120 Qi' 
          },
          'stat-pill-strength': { 
            health: 0, 
            qi: 0, 
            stats: { strength: 3 }, 
            message: 'Permanently gained +3 Strength' 
          },
          'stat-pill-intelligence': { 
            health: 0, 
            qi: 0, 
            stats: { intelligence: 3 }, 
            message: 'Permanently gained +3 Intelligence' 
          },
          'breakthrough-pill': {
            health: 0,
            qi: 200,
            message: 'Massive Qi infusion! Gained 200 Qi'
          }
        };

        const effect = itemEffects[item.type] || { health: 0, qi: 0, message: 'Item used' };

        // Calculate new values
        const newHealth = Math.min(state.player.maxHealth, state.player.health + effect.health);
        const newQi = Math.min(state.player.cultivation.maxQi, state.player.cultivation.qi + effect.qi);
        
        // Apply stat changes if any
        const newStats = { ...state.player.stats };
        if (effect.stats) {
          Object.keys(effect.stats).forEach(stat => {
            newStats[stat] += effect.stats[stat];
          });
        }

        return {
          player: {
            ...state.player,
            health: newHealth,
            cultivation: {
              ...state.player.cultivation,
              qi: newQi
            },
            stats: newStats,
            inventory: state.player.inventory.filter(i => i.id !== itemId),
            updatedAt: new Date().toISOString()
          },
          error: effect.message
        };
      }),

      addItem: (item) => set(state => {
        // Generate truly unique ID
        const uniqueId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}_${state.player.inventory.length}`;
        
        return {
          player: {
            ...state.player,
            inventory: [...state.player.inventory, { 
              ...item, 
              id: uniqueId
            }],
            updatedAt: new Date().toISOString()
          },
          error: null
        };
      }),

      removeItem: (itemId) => set(state => ({
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      // Combat System
      startCombat: (enemy) => set({
        combat: {
          inCombat: true,
          currentEnemy: enemy,
          combatLog: [{ type: 'info', message: `A ${enemy.name} appears!` }]
        },
        error: null
      }),

      playerAttack: () => set(state => {
        if (!state.combat.inCombat || !state.combat.currentEnemy) return state;

        const player = state.player;
        const enemy = state.combat.currentEnemy;
        const combatLog = [...state.combat.combatLog];

        // Player attack
        const playerDamage = CombatEngine.calculateDamage(player, enemy);
        enemy.health -= playerDamage.damage;
        
        combatLog.push({
          type: 'player_attack',
          message: `You attack ${enemy.name} for ${playerDamage.damage} damage!`
        });

        // Check if enemy defeated
        if (enemy.health <= 0) {
          const goldReward = Math.floor(enemy.maxHealth / 10);
          const expReward = enemy.maxHealth;
          
          combatLog.push({
            type: 'victory',
            message: `You defeated ${enemy.name}! Gained ${goldReward} gold and ${expReward} experience.`
          });

          return {
            player: {
              ...state.player,
              gold: state.player.gold + goldReward,
              experience: state.player.experience + expReward,
              updatedAt: new Date().toISOString()
            },
            combat: {
              inCombat: false,
              currentEnemy: null,
              combatLog
            },
            error: null
          };
        }

        // Enemy attack
        const enemyDamage = CombatEngine.calculateDamage(enemy, player);
        const newHealth = Math.max(0, state.player.health - enemyDamage.damage);
        
        combatLog.push({
          type: 'enemy_attack',
          message: `${enemy.name} attacks you for ${enemyDamage.damage} damage!`
        });

        // Check if player defeated
        if (newHealth <= 0) {
          combatLog.push({
            type: 'defeat',
            message: 'You have been defeated!'
          });

          return {
            player: {
              ...state.player,
              health: 1, // Leave with 1 HP
              updatedAt: new Date().toISOString()
            },
            combat: {
              inCombat: false,
              currentEnemy: null,
              combatLog
            },
            error: null
          };
        }

        return {
          player: {
            ...state.player,
            health: newHealth,
            updatedAt: new Date().toISOString()
          },
          combat: {
            ...state.combat,
            currentEnemy: { ...enemy },
            combatLog
          },
          error: null
        };
      }),

      fleeCombat: () => set(state => ({
        combat: {
          inCombat: false,
          currentEnemy: null,
          combatLog: [...state.combat.combatLog, { type: 'info', message: 'You fled from combat!' }]
        },
        error: null
      })),

      // Travel system
      travelTo: (location) => set(state => ({
        player: {
          ...state.player,
          location,
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      discoverLocation: (locationId) => set(state => ({
        world: {
          ...state.world,
          discoveredLocations: state.world.discoveredLocations.includes(locationId) 
            ? state.world.discoveredLocations 
            : [...state.world.discoveredLocations, locationId]
        },
        error: null
      })),

      // Gold system
      addGold: (amount) => set(state => ({
        player: {
          ...state.player,
          gold: state.player.gold + amount,
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      removeGold: (amount) => set(state => ({
        player: {
          ...state.player,
          gold: Math.max(0, state.player.gold - amount),
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      // Quest system
      addQuest: (quest) => set(state => ({
        world: {
          ...state.world,
          activeQuests: [...state.world.activeQuests, { ...quest, id: `quest_${Date.now()}` }]
        },
        error: null
      })),

      completeQuest: (questId) => set(state => {
        const quest = state.world.activeQuests.find(q => q.id === questId);
        if (!quest) return state;

        return {
          player: {
            ...state.player,
            gold: state.player.gold + (quest.reward?.gold || 50),
            experience: state.player.experience + (quest.reward?.exp || 100),
            updatedAt: new Date().toISOString()
          },
          world: {
            ...state.world,
            activeQuests: state.world.activeQuests.filter(q => q.id !== questId),
            completedQuests: [...state.world.completedQuests, questId]
          },
          error: null
        };
      }),

      // NEW: Debug and utility functions for testing breakthroughs
      debugBreakthrough: () => {
        const state = get();
        const { realm, stage, qi, maxQi } = state.player.cultivation;
        const breakthroughCost = CultivationEngine.calculateBreakthroughCost(realm, stage);
        const realmData = CultivationEngine.REALMS[realm];
        const nextRealm = CultivationEngine.getNextRealmInfo(realm);
        
        console.log('=== BREAKTHROUGH DEBUG ===');
        console.log(`Realm: ${realm}, Stage: ${stage}`);
        console.log(`Qi: ${qi}/${maxQi}`);
        console.log(`Breakthrough Cost: ${breakthroughCost}`);
        console.log(`Realm Max Stage: ${realmData.maxStage}`);
        console.log(`Next Realm: ${nextRealm?.name}`);
        console.log(`Can Advance Stage: ${stage < realmData.maxStage && qi >= breakthroughCost}`);
        console.log(`Can Advance Realm: ${stage === realmData.maxStage && nextRealm && qi >= breakthroughCost * 2}`);
        console.log('========================');
      },

      // Force set cultivation state for testing
      setCultivationState: (newCultivation) => set(state => ({
        player: {
          ...state.player,
          cultivation: {
            ...state.player.cultivation,
            ...newCultivation
          },
          updatedAt: new Date().toISOString()
        },
        error: null
      })),

      // Reset to specific stage for testing
      resetToStage: (realm, stage, qi = 0) => set(state => {
        const realmData = CultivationEngine.REALMS[realm];
        const baseQi = realmData?.baseQi || 100;
        const maxQi = baseQi * Math.pow(1.5, stage - 1);
        
        return {
          player: {
            ...state.player,
            cultivation: {
              realm,
              stage,
              qi,
              maxQi,
              speed: 1,
              lastCultivationTime: Date.now()
            },
            health: 100 + ((stage - 1) * 20),
            maxHealth: 100 + ((stage - 1) * 20),
            updatedAt: new Date().toISOString()
          },
          error: null
        };
      }),

      // Utility functions
      clearError: () => set({ error: null }),

      resetStuckState: () => set(state => ({
        player: {
          ...state.player,
          cultivation: {
            ...state.player.cultivation,
            qi: Math.min(state.player.cultivation.qi, state.player.cultivation.maxQi)
          },
          health: Math.min(state.player.health, state.player.maxHealth)
        },
        error: null
      })),

      // Debug function
      debugState: () => {
        const state = get();
        console.log('=== GAME STATE DEBUG ===');
        console.log('Player:', state.player);
        console.log('Combat:', state.combat);
        console.log('World:', state.world);
        console.log('========================');
      }
    }),
    {
      name: 'martial-peak-game-storage',
      partialize: (state) => ({ 
        player: state.player,
        world: state.world 
      }),
      version: 5, // Current version
      migrate: (persistedState, version) => {
        console.log(`Migrating from version ${version} to 5`);
        
        // Start from the current version and migrate step by step
        let state = persistedState;
        for (let i = version; i < 5; i++) {
          const migration = migrations[i];
          if (migration) {
            state = migration(state);
          }
        }
        return state;
      }
    }
  )
);

// Clear storage if you want to start fresh (uncomment if needed)
// localStorage.removeItem('martial-peak-game-storage');