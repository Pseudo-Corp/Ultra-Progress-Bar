import type { Coins } from '../Main/Currency/Variants/Coin';
import type { ProgressFragment } from '../Main/Currency/Variants/ProgressFragment';
import type { CoinBarSpeed, CoinBarMomentum, CoinBarReverberation, CoinBarVibration } from '../Main/Upgrades/Variants/Coin';
import { TalentCriticalChance, TalentProgressSpeed } from '../Main/Upgrades/Variants/Talents';

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
    }
    talents: {
        barCriticalChance: TalentCriticalChance
        barSpeed: TalentProgressSpeed
    }
    barFragments: ProgressFragment
    refreshCount: number
    refreshTime: number
}