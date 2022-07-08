import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarAgitation, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barAgitation' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarAgitation(
        value?.level ?? 0,
        coinUpgradeCosts.barAgitation,
        player
    )
}