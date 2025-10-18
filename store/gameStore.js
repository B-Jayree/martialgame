import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useGameStore = create(
  persist(
    (set, get) => ({
      player: {
        _id: null,
        name: 'Cultivator',
        health: 100,
        maxHealth: 100,
        cultivation: {
          realm: 'Mortal',
          stage: 1,
          qi: 0,
          maxQi: 100,
          speed: 1
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      world: {
        currentTime: 0,
        discoveredLocations: ['starting-village'],
        activeQuests: []
      },
      isLoading: false,
      error: null,

      // Actions
      loadGame: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`/api/game/load?userId=${userId}`);
          const data = await response.json();
          if (data.success) {
            set({ 
              player: data.gameData.player,
              world: data.gameData.world,
              isLoading: false 
            });
          } else {
            set({ error: data.error, isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to load game', isLoading: false });
        }
      },

      saveGame: async () => {
        set({ isLoading: true, error: null });
        try {
          const state = get();
          const response = await fetch('/api/game/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              player: state.player,
              world: state.world
            }),
          });
          const data = await response.json();
          if (data.success) {
            set({ 
              player: { ...state.player, _id: data.gameId },
              isLoading: false 
            });
          } else {
            set({ error: data.error, isLoading: false });
          }
        } catch (error) {
          set({ error: 'Failed to save game', isLoading: false });
        }
      },

      cultivate: (amount) => set(state => {
        const newQi = Math.min(state.player.cultivation.qi + amount, state.player.cultivation.maxQi);
        return {
          player: {
            ...state.player,
            cultivation: {
              ...state.player.cultivation,
              qi: newQi
            },
            updatedAt: new Date().toISOString()
          }
        };
      }),

      breakthrough: () => set(state => {
        const { realm, stage, qi } = state.player.cultivation;
        const realms = {
          'Mortal': { maxStage: 3, nextRealm: 'Qi Condensation' },
          'Qi Condensation': { maxStage: 9, nextRealm: 'Foundation' },
          'Foundation': { maxStage: 9, nextRealm: 'Golden Core' },
          'Golden Core': { maxStage: 9, nextRealm: 'Nascent Soul' },
          'Nascent Soul': { maxStage: 9, nextRealm: null }
        };
        const currentRealm = realms[realm];
        const breakthroughCost = 100 * Math.pow(2, stage - 1);

        if (qi >= breakthroughCost && stage < currentRealm.maxStage) {
          return {
            player: {
              ...state.player,
              cultivation: {
                ...state.player.cultivation,
                stage: stage + 1,
                qi: qi - breakthroughCost,
                maxQi: state.player.cultivation.maxQi * 1.5
              },
              updatedAt: new Date().toISOString()
            }
          };
        } else if (stage === currentRealm.maxStage && currentRealm.nextRealm) {
          return {
            player: {
              ...state.player,
              cultivation: {
                realm: currentRealm.nextRealm,
                stage: 1,
                qi: 0,
                maxQi: state.player.cultivation.maxQi * 3,
                speed: state.player.cultivation.speed * 1.2
              },
              updatedAt: new Date().toISOString()
            }
          };
        }
        return state;
      }),

      addItem: (item) => set(state => ({
        player: {
          ...state.player,
          inventory: [...state.player.inventory, item],
          updatedAt: new Date().toISOString()
        }
      })),

      removeItem: (itemId) => set(state => ({
        player: {
          ...state.player,
          inventory: state.player.inventory.filter(item => item.id !== itemId),
          updatedAt: new Date().toISOString()
        }
      })),

      travelTo: (location) => set(state => ({
        player: {
          ...state.player,
          location
        },
        world: {
          ...state.world,
          discoveredLocations: state.world.discoveredLocations.includes(location) 
            ? state.world.discoveredLocations 
            : [...state.world.discoveredLocations, location]
        }
      })),

      clearError: () => set({ error: null })
    }),
    {
      name: 'martial-peak-game-storage',
      partialize: (state) => ({ player: state.player, world: state.world }),
    }
  )
);