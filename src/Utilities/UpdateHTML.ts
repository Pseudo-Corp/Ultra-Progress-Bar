import { backgroundColorCreation, computeMainBarCoinWorth } from '../Main/ProgressBar/Properties';
import { Player } from '../types/player';
import { format } from './Format';
import { updateElementById, updateStyleById } from './Render'

export type Tabs = 'Main' | 'Upgrades' | 'Talents'

export const hideStuff = (tab: Tabs) => {
    updateStyleById(
        'mainTab',
        { display: 'none' }
    );
    updateStyleById(
        'upgradeTab',
        { display: 'none' }
    );
    updateStyleById(
        'talentsTab',
        { display: 'none' }
    );

    if (tab === 'Main') {
        updateStyleById(
            'mainTab',
            { display: 'block' }
        );
    } else if (tab === 'Upgrades') {
        updateStyleById(
            'upgradeTab',
            { display: 'block' }
        );
    } else if (tab === 'Talents') {
        updateStyleById(
            'talentsTab',
            { display: 'block' }
        );
    }
}

export const onCriticalHit = (player: Player) => {
    updateStyleById(
        'progression',
        { backgroundColor: 'gold'}
    );

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation(player)}
        );
    }, 250);

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    )

    updateElementById(
        'refresh-crit-fragments',
        { textContent: format(100 * player.criticalHitsThisRefresh * 
            player.coinUpgrades.barAgitation.upgradeEffect(), 2) }
    )
    player.barFragments.updateHTML();

}

export const onRefresh = (player: Player) => {
    updateStyleById(
        'progression',
         { backgroundColor: 'cyan' }
    );

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation(player)}
        );
    }, 1000);

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(computeMainBarCoinWorth(player))} coins` }
    );

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    );

    updateElementById(
        'refresh-counter',
        { textContent: format(player.refreshCount)}
    );
}