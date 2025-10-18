export class RelationshipsEngine {
  static factions = {
    'Righteous Sects': { alignment: 'good', relations: 50 },
    'Demonic Cult': { alignment: 'evil', relations: -50 },
    'Neutral Clans': { alignment: 'neutral', relations: 0 }
  };

  static calculateRelationChange(action, currentRelation, faction) {
    let change = 0;
    
    switch (action.type) {
      case 'help':
        change = 10;
        break;
      case 'betray':
        change = -20;
        break;
      case 'complete_quest':
        change = 15;
        break;
      case 'attack_member':
        change = -30;
        break;
      default:
        change = 5;
    }
    
    // Alignment modifiers
    if (action.alignment && this.factions[faction].alignment !== action.alignment) {
      change *= 1.5;
    }
    
    return Math.max(-100, Math.min(100, currentRelation + change));
  }

  static getFactionBenefits(relationLevel) {
    if (relationLevel >= 80) return ['Access to secret techniques', 'Discounts on items', 'Elite quests'];
    if (relationLevel >= 50) return ['Special items', 'Better quests', 'Training grounds'];
    if (relationLevel >= 20) return ['Basic quests', 'Shop access'];
    if (relationLevel <= -50) return ['Hostile encounters', 'Bounty hunters'];
    return ['Neutral status'];
  }
}