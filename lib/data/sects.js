export const SECTS = {
  'cloud-sword-sect': {
    id: 'cloud-sword-sect',
    name: 'Cloud Sword Sect',
    alignment: 'righteous',
    description: 'A righteous sect specializing in sword techniques',
    requirements: {
      realm: 'Qi Condensation',
      stage: 3
    },
    benefits: {
      cultivationSpeed: 1.2,
      techniques: ['Cloud Sword Art'],
      reputation: 50
    }
  },
  'shadow-palace': {
    id: 'shadow-palace',
    name: 'Shadow Palace',
    alignment: 'demonic',
    description: 'A demonic sect that values power above all',
    requirements: {
      realm: 'Foundation',
      stage: 1
    },
    benefits: {
      cultivationSpeed: 1.5,
      techniques: ['Shadow Step', 'Blood Art'],
      reputation: -50
    }
  },
  'neutral-alliance': {
    id: 'neutral-alliance',
    name: 'Neutral Alliance',
    alignment: 'neutral',
    description: 'An alliance of independent cultivators',
    requirements: {
      realm: 'Qi Condensation',
      stage: 1
    },
    benefits: {
      cultivationSpeed: 1.1,
      techniques: ['Basic Meditation'],
      reputation: 0
    }
  }
};

export const getSect = (sectId) => SECTS[sectId];
export const getAvailableSects = (playerRealm, playerStage) => {
  return Object.values(SECTS).filter(sect => {
    const req = sect.requirements;
    const playerRank = getCultivationRank(playerRealm, playerStage);
    const requiredRank = getCultivationRank(req.realm, req.stage);
    return playerRank >= requiredRank;
  });
};

function getCultivationRank(realm, stage) {
  const realms = ['Mortal', 'Qi Condensation', 'Foundation', 'Golden Core', 'Nascent Soul'];
  return realms.indexOf(realm) * 100 + stage;
}