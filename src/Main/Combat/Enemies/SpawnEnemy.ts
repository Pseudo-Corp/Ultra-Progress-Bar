import { Player } from '../../../types/player'
import { enemyStats } from '../Stats/Stats'
import { AggressiveEnemy } from './Variants/Aggressive'
import { BossEnemy } from './Variants/Boss'
import { DefenseiveEnemy } from './Variants/Defensive'
import { HealerEnemy } from './Variants/Healer'
import { IdleEnemy } from './Variants/Idle'
import { NullEnemy } from './Variants/Null'
import { RandomEnemy } from './Variants/Random'
import { Globals } from '../../Globals'

export const testNullStats: enemyStats = {
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
    HP: 50,
    MP: 25,
    ATK: 2,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 5,
    CRITDAMAGE: 144,
    REWARD: 0.5,
    CRITICAL: true

}

export const testBossStats: enemyStats = {
    HP: 130,
    MP: 30,
    ATK: 1,
    STR: 1,
    DEF: 1,
    ARMOR: 1,
    CRITCHANCE: 25,
    CRITDAMAGE: 150,
    REWARD: 2,
    CRITICAL: true
}

export const testDefensiveStats: enemyStats = {
    HP: 90,
    MP: 12,
    ATK: 1,
    STR: 0,
    DEF: 30,
    ARMOR: 1,
    CRITCHANCE: 5,
    CRITDAMAGE: 125,
    REWARD: 0.5,
    CRITICAL: true
}

export const testHealerStats: enemyStats = {
    HP: 60,
    MP: 24,
    ATK: 1,
    STR: 0,
    DEF: 10,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100,
    REWARD: 0.5,
    CRITICAL: true
}

export const testIdleStats: enemyStats = {
    HP: 200,
    MP: 0,
    ATK: 0,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100,
    REWARD: 0.25,
    CRITICAL: false
}

export const testRandomStats: enemyStats = {
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

export const spawnEnemy = (player: Player, nullified = false) => {
    if (nullified) {
        return Globals.setGlobalEnemy(
            new NullEnemy(testNullStats, 5000, player)
        )
    }

    const RNG = Math.random()

    if (RNG <= 0.05) {
        Globals.setGlobalEnemy(new IdleEnemy(testIdleStats, 0.666, player))
    } else if (RNG <= 0.6) {
        Globals.setGlobalEnemy(new AggressiveEnemy(testAggressiveStats, 0.5, player))
    } else if (RNG <= 0.625) {
        Globals.setGlobalEnemy(new DefenseiveEnemy(testDefensiveStats, 0.66, player))
    } else if (RNG <= 0.65) {
        Globals.setGlobalEnemy(new HealerEnemy(testHealerStats, 0.66, player))
    } else if (RNG <= 0.7) {
        Globals.setGlobalEnemy(new RandomEnemy(testRandomStats, 0.66, player))
    } else {
        Globals.setGlobalEnemy(new BossEnemy(testBossStats, 1, player))
    }
}