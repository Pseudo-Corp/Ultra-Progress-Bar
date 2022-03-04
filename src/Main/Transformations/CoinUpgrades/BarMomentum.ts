import type { Player } from '../../../types/player';
import { getProperty } from 'dot-prop';
import { CoinBarMomentum, coinUpgradeCosts } from '../../Upgrades/Variants/Coin';

const path = 'coinUpgrades.barMomentum' as const;

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path);

    return new CoinBarMomentum(
        value?.level ?? 0,
        coinUpgradeCosts.barMomentum,
        player
    );
}