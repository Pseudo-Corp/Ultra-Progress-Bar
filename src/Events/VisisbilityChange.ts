import { player } from '../Game';
import { format } from '../Utilities/Format';
import { updateElementById, updateStyleById } from '../Utilities/Render';

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') return;

    player.coins.updateHTML();
    player.coinUpgrades.barMomentum.updateHTML();
    player.coinUpgrades.barSpeed.updateHTML();
    player.coinUpgrades.barReverberation.updateHTML();
    player.coinUpgrades.barVibration.updateHTML();
    player.coinUpgrades.barAgitation.updateHTML();
    player.barFragments.updateHTML();
    player.talents.barCriticalChance.updateHTML('Initialize')
    player.talents.barSpeed.updateHTML('Initialize')

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(player.coinValueCache)} coins` }
    );

    if (player.coinValueCache > 0) {
        updateStyleById(
            'coinWorth',
            { color: 'gold' }
        )
    } else {
        updateStyleById(
            'coinWorth',
            { color: 'grey' }
        )
    }
});