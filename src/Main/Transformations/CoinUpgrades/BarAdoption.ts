import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarAdoption, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barAdoption' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarAdoption(
        value?.level ?? 0,
        coinUpgradeCosts.barAdoption,
        player
    )
}