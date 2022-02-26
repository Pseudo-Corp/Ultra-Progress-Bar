import { getProperty } from 'dot-prop';
import { player } from '../../../Game';
import { Player } from '../../../types/player';
import { talentBaseEXP, TalentCriticalChance } from '../../Upgrades/Variants/Talents';

const path = 'talents.barCriticalChance' as const;

export const transform = (data: Partial<Player>) => {
    const value = getProperty(data, path) ?? getProperty(player, path);

    return new TalentCriticalChance(
        value?.level ?? 0,
        talentBaseEXP.talentCriticalChance,
        value?.investedFragments ?? 0,
        value?.permLevel ?? 0,
        value?.currEXP ?? 0
    );
}