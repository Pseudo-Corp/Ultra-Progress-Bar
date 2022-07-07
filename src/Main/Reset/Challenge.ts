import { player } from '../../Game';
import { reset } from './Refresh';

export const challengeReset = () => {
    void reset('Refresh', player);
    player.barFragments.set(0);
}