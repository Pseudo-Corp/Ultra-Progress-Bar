import type { Coins } from '../Main/Currency/Variants/Coin';
import type { ProgressFragment } from '../Main/Currency/Variants/ProgressFragment';
import type { CoinBarSpeed, CoinBarMomentum } from '../Main/Upgrades/Variants/Coin';

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
    }
    barFragments: ProgressFragment
    refreshCount: number
    refreshTime: number
}