import { getProperty } from 'dot-prop'
import { Player } from '../../../types/player'
import { baseAttackRate, baseFighterStats, PlayerFighter } from '../../Combat/Player/Fighter'

const path = 'fighter' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new PlayerFighter(
        value?.baseStats ?? baseFighterStats,
        value?.attackRate ?? baseAttackRate,
        player
    )
}