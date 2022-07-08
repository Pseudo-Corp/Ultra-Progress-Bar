import { getProperty } from 'dot-prop'
import { Player } from '../../../types/player'
import { talentBaseEXP, TalentCoinGain } from '../../Upgrades/Variants/Talents'

const path = 'talents.coinGain' as const

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path)

    return new TalentCoinGain(
        value?.level ?? 0,
        talentBaseEXP.talentCoinGain,
        value?.investedFragments ?? 0,
        value?.permLevel ?? 0,
        value?.currEXP ?? 0,
        player
    )
}