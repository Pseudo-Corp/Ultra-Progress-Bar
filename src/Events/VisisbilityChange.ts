import { player } from '../Game';
import { computeMainBarCoinWorth } from '../Main/ProgressBar/Properties';
import { format } from '../Utilities/Format';
import { updateElement } from '../Utilities/Render';
import { getElementById } from '../Utilities/UpdateHTML';

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') return;

    player.coins.updateHTML();
    player.coinUpgrades.barMomentum.updateHTML();
    player.coinUpgrades.barSpeed.updateHTML();
    player.barFragments.updateHTML();

    updateElement(
        getElementById('coinWorth'),
        { textContent: `Worth ${format(computeMainBarCoinWorth())} coins` }
    );
});