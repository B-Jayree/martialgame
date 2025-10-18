export class CombatEngine {
  static calculateDamage(attacker, defender, technique = null) {
    let baseDamage = attacker.stats.strength;
    if (technique) baseDamage += technique.power;
    
    const defense = defender.stats.vitality * 0.7;
    let finalDamage = Math.max(1, baseDamage - defense);
    
    const critChance = attacker.stats.agility / 200;
    if (Math.random() < critChance) {
      finalDamage *= 2;
      return { damage: finalDamage, critical: true };
    }
    
    return { damage: finalDamage, critical: false };
  }

  static executeTurn(player, enemy, playerAction) {
    const combatLog = [];
    
    if (playerAction.type === 'attack' && player.health > 0) {
      const attackResult = this.calculateDamage(player, enemy, playerAction.technique);
      enemy.health -= attackResult.damage;
      combatLog.push({
        type: 'player_attack',
        damage: attackResult.damage,
        critical: attackResult.critical,
        message: `${player.name} ${attackResult.critical ? 'critically ' : ''}strikes for ${attackResult.damage} damage!`
      });
    }
    
    if (enemy.health > 0 && player.health > 0) {
      const enemyAttack = this.calculateDamage(enemy, player);
      player.health -= enemyAttack.damage;
      combatLog.push({
        type: 'enemy_attack', 
        damage: enemyAttack.damage,
        message: `${enemy.name} attacks for ${enemyAttack.damage} damage!`
      });
    }
    
    if (player.health <= 0) {
      combatLog.push({ type: 'defeat', message: 'You have been defeated!' });
    } else if (enemy.health <= 0) {
      combatLog.push({ type: 'victory', message: `You have defeated ${enemy.name}!` });
    }
    
    return combatLog;
  }

  static generateEnemy(playerLevel) {
    const enemies = [
      { name: 'Wild Beast', baseHealth: 30, baseDamage: 5 },
      { name: 'Bandit', baseHealth: 40, baseDamage: 8 },
      { name: 'Demonic Cultivator', baseHealth: 60, baseDamage: 12 },
      { name: 'Ancient Spirit', baseHealth: 100, baseDamage: 18 }
    ];
    
    const enemyTemplate = enemies[Math.floor(Math.random() * enemies.length)];
    const levelMultiplier = 1 + (playerLevel * 0.2);
    
    return {
      name: enemyTemplate.name,
      health: Math.floor(enemyTemplate.baseHealth * levelMultiplier),
      maxHealth: Math.floor(enemyTemplate.baseHealth * levelMultiplier),
      stats: {
        strength: Math.floor(enemyTemplate.baseDamage * levelMultiplier),
        vitality: Math.floor(enemyTemplate.baseHealth * levelMultiplier * 0.1),
        agility: 10
      }
    };
  }
}