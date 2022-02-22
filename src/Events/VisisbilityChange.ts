import { player } from '../Game';

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') return;

    player.coins.updateHTML();
    player.coinUpgrades.barMomentum.updateHTML();
    player.coinUpgrades.barSpeed.updateHTML();
    player.barFragments.updateHTML();
});