import { player } from '../Game';
import { backgroundColorCreation, computeMainBarCoinWorth } from '../Main/ProgressBar/Properties';
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

export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement;

export const onCriticalHit = () => {
    updateStyleById(
        'progression',
        { backgroundColor: 'gold'}
    );

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation()}
        );
    }, 250);

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    )
    player.barFragments.updateHTML();

}

export const onRefresh = () => {
    updateStyleById(
        'progression',
         { backgroundColor: 'cyan' }
    )

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation()}
        );
    }, 1000);

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(computeMainBarCoinWorth())} coins` }
    );

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    )

    updateElementById(
        'refresh-counter',
        { textContent: format(player.refreshCount)}
    );
}