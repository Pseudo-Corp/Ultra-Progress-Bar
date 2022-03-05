import type { Player } from '../../../types/player';
import { getProperty } from 'dot-prop';
import { CoinBarReinforcement, coinUpgradeCosts } from '../../Upgrades/Variants/Coin';

const path = 'coinUpgrades.barReinforcement' as const;

export const transform = (data: Partial<Player>, player: Player) => {
    const value = getProperty(data, path) ?? getProperty(player, path);

    return new CoinBarReinforcement(
        value?.level ?? 0,
        coinUpgradeCosts.barReinforcement,
        player
    )
}