import type { Player } from '../../../types/player'
import { getProperty } from 'dot-prop'
import { CoinBarEmpowerment, coinUpgradeCosts } from '../../Upgrades/Variants/Coin'

const path = 'coinUpgrades.barEmpowerment' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new CoinBarEmpowerment(
        value?.level ?? 0,
        coinUpgradeCosts.barEmpowerment,
        player
    )
}