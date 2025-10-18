export const ITEMS = {
  'spirit-stone': {
    id: 'spirit-stone',
    name: 'Spirit Stone',
    type: 'cultivation',
    rarity: 'common',
    value: 10,
    description: 'A stone containing spiritual energy for cultivation',
    useEffect: (player) => ({ qi: player.cultivation.qi + 50 })
  },
  'healing-pill': {
    id: 'healing-pill',
    name: 'Healing Pill',
    type: 'consumable',
    rarity: 'common',
    value: 25,
    description: 'Restores health points',
    useEffect: (player) => ({ health: Math.min(player.health + 30, player.maxHealth) })
  },
  'qi-replenishment-pill': {
    id: 'qi-replenishment-pill',
    name: 'Qi Replenishment Pill',
    type: 'consumable',
    rarity: 'uncommon',
    value: 40,
    description: 'Restores spiritual energy',
    useEffect: (player) => ({ qi: Math.min(player.cultivation.qi + 100, player.cultivation.maxQi) })
  },
  'breakthrough-pill': {
    id: 'breakthrough-pill',
    name: 'Breakthrough Pill',
    type: 'cultivation',
    rarity: 'rare',
    value: 150,
    description: 'Increases chances of successful breakthrough',
    useEffect: (player) => ({ cultivation: { ...player.cultivation, qi: player.cultivation.qi + 200 } })
  }
};

export const getItemById = (id) => ITEMS[id];
export const getItemsByType = (type) => Object.values(ITEMS).filter(item => item.type === type);