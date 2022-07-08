import { Player } from '../../types/player';
import { reset } from './Refresh';

export const challengeReset = (player: Player) => {
    void reset('Refresh', player);
    player.barFragments.set(0);
}