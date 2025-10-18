export const WORLDS = {
  'starting-village': {
    name: 'Starting Village',
    description: 'A peaceful village where your cultivation journey begins',
    type: 'safe',
    cultivationBonus: 1.0,
    enemies: ['Wild Beast'],
    shops: ['General Store'],
    connections: ['forest', 'mountains']
  },
  'forest': {
    name: 'Mysterious Forest',
    description: 'A dense forest filled with spiritual energy and dangers',
    type: 'wilderness',
    cultivationBonus: 1.2,
    enemies: ['Wild Beast', 'Bandit'],
    shops: [],
    connections: ['starting-village', 'ancient-ruins']
  },
  'mountains': {
    name: 'Spiritual Mountains',
    description: 'Sacred mountains where powerful cultivators meditate',
    type: 'sacred',
    cultivationBonus: 1.5,
    enemies: ['Ancient Spirit'],
    shops: ['Alchemist'],
    connections: ['starting-village', 'cultivator-city']
  },
  'cultivator-city': {
    name: 'Cultivator City',
    description: 'A bustling city filled with cultivators of all realms',
    type: 'city',
    cultivationBonus: 1.1,
    enemies: ['Demonic Cultivator'],
    shops: ['Auction House', 'Technique Hall', 'Alchemist'],
    connections: ['mountains']
  }
};

export const getWorld = (worldId) => WORLDS[worldId];
export const getConnectedWorlds = (worldId) => {
  const world = WORLDS[worldId];
  return world ? world.connections.map(conn => WORLDS[conn]) : [];
};