import { EnemyTypes } from '../Enemies/Enemy'

export interface combatStats {
    HP: number
    MP: number
    ATK: number
    STR: number
    DEF: number
    ARMOR: number
    CRITCHANCE: number
    CRITDAMAGE: number
}

export interface enemyStats extends combatStats {
    ENEMYTYPE: EnemyTypes
    REWARD: number
    CRITICAL: boolean
    INVINCIBLE?: boolean
}