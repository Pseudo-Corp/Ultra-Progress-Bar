import { combatStats } from '../Stats/Stats';
import { Enemy } from './Enemy';
import { AggressiveEnemy } from './Variants/Aggressive';
import { BossEnemy } from './Variants/Boss';
import { DefenseiveEnemy } from './Variants/Defensive';
import { HealerEnemy } from './Variants/Healer';
import { IdleEnemy } from './Variants/Idle';
import { RandomEnemy } from './Variants/Random';

export const testAggressiveStats: combatStats = {
    HP: 50,
    MP: 25,
    ATK: 2,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 5,
    CRITDAMAGE: 144
}

export const testBossStats: combatStats = {
    HP: 130,
    MP: 30,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 25,
    CRITDAMAGE: 150
}

export const testDefensiveStats: combatStats = {
    HP: 90,
    MP: 12,
    ATK: 1,
    STR: 0,
    DEF: 30,
    ARMOR: 1,
    CRITCHANCE: 5,
    CRITDAMAGE: 125
}

export const testHealerStats: combatStats = {
    HP: 60,
    MP: 24,
    ATK: 1,
    STR: 0,
    DEF: 10,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export const testIdleStats: combatStats = {
    HP: 200,
    MP: 0,
    ATK: 0,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export const testRandomStats: combatStats = {
    HP: 50,
    MP: 25,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 30,
    CRITDAMAGE: 125
}

export let testEnemy: Enemy

export const spawnEnemy = () => {
    const RNG = Math.random();

    if (RNG <= 0.05) {
        testEnemy = new IdleEnemy(testIdleStats, 0.666)
    } else if (RNG <= 0.6) {
        testEnemy = new AggressiveEnemy(testAggressiveStats, 0.5)
    } else if (RNG <= 0.625) {
        testEnemy = new DefenseiveEnemy(testDefensiveStats, 0.66)
    } else if (RNG <= 0.65) {
        testEnemy = new HealerEnemy(testHealerStats, 0.66)
    } else if (RNG <= 0.7) {
        testEnemy = new RandomEnemy(testRandomStats, 0.66)
    } else {
        testEnemy = new BossEnemy(testBossStats, 1)
    }
}