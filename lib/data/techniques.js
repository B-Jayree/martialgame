export const TECHNIQUES = {
  'basic-meditation': {
    id: 'basic-meditation',
    name: 'Basic Meditation',
    type: 'cultivation',
    realm: 'Mortal',
    power: 0,
    efficiency: 1.2,
    cost: 0,
    description: 'A fundamental technique for qi accumulation'
  },
  'dragon-tiger-fist': {
    id: 'dragon-tiger-fist',
    name: 'Dragon Tiger Fist',
    type: 'offensive',
    realm: 'Qi Condensation',
    power: 15,
    efficiency: 1.0,
    cost: 10,
    description: 'A powerful fist technique combining dragon and tiger energies'
  },
  'cloud-sword-art': {
    id: 'cloud-sword-art',
    name: 'Cloud Sword Art',
    type: 'offensive',
    realm: 'Foundation',
    power: 35,
    efficiency: 1.0,
    cost: 25,
    description: 'Ethereal sword techniques that move like clouds'
  },
  'nine-heavens-thunder': {
    id: 'nine-heavens-thunder',
    name: 'Nine Heavens Thunder',
    type: 'offensive',
    realm: 'Golden Core',
    power: 75,
    efficiency: 1.0,
    cost: 50,
    description: 'Summons thunder from the nine heavens to strike enemies'
  }
};

export const getTechnique = (techniqueId) => TECHNIQUES[techniqueId];
export const getAvailableTechniques = (playerRealm, playerStage) => {
  return Object.values(TECHNIQUES).filter(tech => {
    const realms = ['Mortal', 'Qi Condensation', 'Foundation', 'Golden Core', 'Nascent Soul'];
    const playerIndex = realms.indexOf(playerRealm);
    const techIndex = realms.indexOf(tech.realm);
    return playerIndex >= techIndex;
  });
};