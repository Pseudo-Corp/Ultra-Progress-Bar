import { Challenges } from '../Main/Challenges/types';
import type { Coins } from '../Main/Currency/Variants/Coin';
import type { ProgressFragment } from '../Main/Currency/Variants/ProgressFragment';
import type {
    CoinBarSpeed,
    CoinBarMomentum,
    CoinBarReverberation,
    CoinBarVibration,
    CoinBarAgitation,
    CoinBarAdoption,
    CoinBarEmpowerment,
    CoinBarReinforcement,
    CoinBarResonance
} from '../Main/Upgrades/Variants/Coin';
import type { TalentCoinGain, TalentCriticalChance, TalentProgressSpeed } from '../Main/Upgrades/Variants/Talents';

export interface Player {
    firstPlayed: Date,
    barEXP: number,
    barTNL: number,
    totalEXP: number,
    barLevel: number,
    highestBarLevel: number,
    coins: Coins
    coinUpgrades: {
        barSpeed: CoinBarSpeed
        barMomentum: CoinBarMomentum
        barReverberation: CoinBarReverberation
        barVibration: CoinBarVibration
        barAgitation: CoinBarAgitation
        barAdoption: CoinBarAdoption
        barEmpowerment: CoinBarEmpowerment
        barReinforcement: CoinBarReinforcement
        barResonance: CoinBarResonance
    }
    talents: {
        barCriticalChance: TalentCriticalChance
        barSpeed: TalentProgressSpeed
        coinGain: TalentCoinGain
    }
    barFragments: ProgressFragment
    refreshCount: number
    refreshTime: number
    criticalHits: number
    criticalHitsThisRefresh: number
    coinValueCache: number
    currentChallenge: Challenges
    completedChallenges: {
        basicChallenge: number
        noRefresh: number
        noCoinUpgrades: number
        reducedFragments: number
    }
}