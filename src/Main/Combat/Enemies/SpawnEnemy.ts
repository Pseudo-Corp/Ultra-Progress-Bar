import { combatStats } from '../Stats/Stats';
import { Enemy } from './Enemy';
import { AggressiveEnemy } from './Variants/Aggressive';
import { BossEnemy } from './Variants/Boss';
import { DefenseiveEnemy } from './Variants/Defensive';
import { HealerEnemy } from './Variants/Healer';
import { IdleEnemy } from './Variants/Idle';
import { RandomEnemy } from './Variants/Random';

export const testAggressiveStats: combatStats = {
    HP: 20,
    MP: 99,
    ATK: 2,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 5,
    CRITDAMAGE: 144
}

export const testBossStats: combatStats = {
    HP: 200,
    MP: 120,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 25,
    CRITDAMAGE: 150
}

export const testDefensiveStats: combatStats = {
    HP: 50,
    MP: 12,
    ATK: 1,
    STR: 0,
    DEF: 30,
    ARMOR: 1,
    CRITCHANCE: 5,
    CRITDAMAGE: 125
}

export const testHealerStats: combatStats = {
    HP: 35,
    MP: 24,
    ATK: 1,
    STR: 0,
    DEF: 10,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export const testIdleStats: combatStats = {
    HP: 50,
    MP: 1,
    ATK: 0,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export const testRandomStats: combatStats = {
    HP: 30,
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

    if (RNG <= 0.1) {
        testEnemy = new IdleEnemy(testIdleStats, 1)
    } else if (RNG <= 0.3) {
        testEnemy = new AggressiveEnemy(testAggressiveStats, 0.75)
    } else if (RNG <= 0.5) {
        testEnemy = new DefenseiveEnemy(testDefensiveStats, 1)
    } else if (RNG <= 0.7) {
        testEnemy = new HealerEnemy(testHealerStats, 1)
    } else if (RNG <= 0.9) {
        testEnemy = new RandomEnemy(testRandomStats, 1)
    } else {
        testEnemy = new BossEnemy(testBossStats, 1.5)
    }
}