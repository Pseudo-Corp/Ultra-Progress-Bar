import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarResonance, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barResonance' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarResonance(
        value?.level ?? 0,
        coinUpgradeCosts.barResonance,
        player
    )
}