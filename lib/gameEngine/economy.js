export class EconomyEngine {
  static calculateItemValue(item, playerLevel = 1) {
    let value = item.baseValue || 10;
    
    // Scale with player level
    value *= (1 + (playerLevel * 0.1));
    
    // Rarity multipliers
    const rarityMultipliers = {
      common: 1,
      uncommon: 2,
      rare: 5,
      epic: 10,
      legendary: 25
    };
    
    value *= rarityMultipliers[item.rarity || 'common'];
    return Math.floor(value);
  }

  static calculateTransactionPrice(basePrice, playerCharisma = 10) {
    const charismaBonus = playerCharisma / 100; // 1% per charisma point
    const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
    return Math.floor(basePrice * randomFactor * (1 - charismaBonus));
  }

  static generateShopItems(playerLevel) {
    const items = [
      { id: 'healing-potion', name: 'Healing Potion', type: 'consumable', baseValue: 20 },
      { id: 'qi-pill', name: 'Qi Restoration Pill', type: 'consumable', baseValue: 35 },
      { id: 'spirit-stone', name: 'Spirit Stone', type: 'cultivation', baseValue: 50 },
      { id: 'basic-technique', name: 'Basic Cultivation Manual', type: 'technique', baseValue: 100 }
    ];
    
    return items.map(item => ({
      ...item,
      price: this.calculateItemValue(item, playerLevel),
      quantity: Math.floor(Math.random() * 5) + 1
    }));
  }
}