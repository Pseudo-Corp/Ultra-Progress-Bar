import { enemyStats } from '../Stats/Stats'

export const testNullStats: enemyStats = {
    ENEMYTYPE: 'Null',
    HP: 1,
    MP: 1,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 1,
    CRITDAMAGE: 1,
    REWARD: 0,
    CRITICAL: false,
    INVINCIBLE: true
}

export const testAggressiveStats: enemyStats = {
    ENEMYTYPE: 'Aggressive',
    HP: 50,
    MP: 25,
    ATK: 2,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 5,
    CRITDAMAGE: 144,
    REWARD: 0.1,
    CRITICAL: true

}

export const testBossStats: enemyStats = {
    ENEMYTYPE: 'BOSS',
    HP: 130,
    MP: 30,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 25,
    CRITDAMAGE: 150,
    REWARD: 0.4,
    CRITICAL: true
}

export const testDefensiveStats: enemyStats = {
    ENEMYTYPE: 'Defensive',
    HP: 90,
    MP: 12,
    ATK: 1,
    STR: 0,
    DEF: 30,
    ARMOR: 1,
    CRITCHANCE: 5,
    CRITDAMAGE: 125,
    REWARD: 0.1,
    CRITICAL: true
}

export const testHealerStats: enemyStats = {
    ENEMYTYPE: 'Healer',
    HP: 60,
    MP: 24,
    ATK: 1,
    STR: 0,
    DEF: 10,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100,
    REWARD: 0.1,
    CRITICAL: true
}

export const testIdleStats: enemyStats = {
    ENEMYTYPE: 'Idle',
    HP: 200,
    MP: 0,
    ATK: 0,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100,
    REWARD: 1,
    CRITICAL: false
}

export const testRandomStats: enemyStats = {
    ENEMYTYPE: 'Random',
    HP: 50,
    MP: 25,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 30,
    CRITDAMAGE: 125,
    REWARD: 0.5,
    CRITICAL: true
}