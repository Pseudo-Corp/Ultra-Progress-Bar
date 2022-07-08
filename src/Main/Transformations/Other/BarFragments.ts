import { getProperty } from 'dot-prop'
import { Player } from '../../../types/player'
import { ProgressFragment } from '../../Currency/Variants/ProgressFragment'

const path = 'barFragments' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new ProgressFragment(
        value?.amount ?? 0,
        player
    )
}