import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarReverberation, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barReverberation' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarReverberation(
        value?.level ?? 0,
        coinUpgradeCosts.barReverberation,
        player
    )
}