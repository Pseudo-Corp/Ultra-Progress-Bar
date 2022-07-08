import { getProperty } from 'dot-prop'
import { Player } from '../../../types/player'
import { Coins } from '../../Currency/Variants/Coin'

const path = 'coins' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new Coins(
        value?.amount ?? 0,
        player,
        value?.totalCoins ?? 0
    )
}