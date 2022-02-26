import { player } from '../Game';
import { computeMainBarCoinWorth } from '../Main/ProgressBar/Properties';
import { format } from '../Utilities/Format';
import { updateElementById } from '../Utilities/Render';

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') return;

    player.coins.updateHTML();
    player.coinUpgrades.barMomentum.updateHTML();
    player.coinUpgrades.barSpeed.updateHTML();
    player.barFragments.updateHTML();

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(computeMainBarCoinWorth())} coins` }
    );
});