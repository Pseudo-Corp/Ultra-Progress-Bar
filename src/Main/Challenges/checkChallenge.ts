import { Player } from '../../types/player';
import { Challenges } from './types';

export const checkChallenge = (type: Challenges, player: Player) => {
    switch (type) {
        case 'Basic Challenge':
            return (player.barLevel >= 175 + 25 * player.completedChallenges.basicChallenge)
        case 'No Refresh':
            return (player.barLevel >= 100 + 15 * player.completedChallenges.noRefresh)
        case 'No Coin Upgrades':
            return (player.barLevel >= 100 + 15 * player.completedChallenges.noCoinUpgrades)
        case 'Reduced Bar Fragments':
            return (player.barLevel >= 200 + 40 * player.completedChallenges.reducedFragments)
        default:
            return true
    }
}