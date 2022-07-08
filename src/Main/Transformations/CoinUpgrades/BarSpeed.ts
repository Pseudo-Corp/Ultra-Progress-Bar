import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarSpeed, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barSpeed' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarSpeed(
        value?.level ?? 0,
        coinUpgradeCosts.barSpeed,
        player
    )
}