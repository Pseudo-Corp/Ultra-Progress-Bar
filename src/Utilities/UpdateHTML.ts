import { backgroundColorCreation } from '../Main/ProgressBar/Properties';
import { Player } from '../types/player';
import { format } from './Format';
import { updateElementById, updateStyleById } from './Render'

export type Tabs = 'Main' | 'Upgrades' | 'Talents' | 'Dueling'

export const hideStuff = (tab: Tabs) => {
    updateStyleById(
        'innerTesting',
        { border: 'none' }
    )
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
    updateStyleById(
        'duelingTab',
        { display: 'none' }
    )

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
    } else if (tab === 'Dueling') {
        updateStyleById(
            'duelingTab',
            { display: 'block' }
        )
        updateStyleById(
            'innerTesting',
            { border: '2px solid grey' }
        )
    }
}

export const onCriticalHit = (player: Player, superCrit: boolean) => {

    if (superCrit) {
        updateStyleById(
            'progression',
            { backgroundColor: 'gold'}
        );
    } else {
        updateStyleById(
            'progression',
            { backgroundColor: 'turquoise'}
        );
    }

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation(player)}
        );
    }, 500);

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

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    );

    updateElementById(
        'refresh-counter',
        { textContent: format(player.refreshCount)}
    );
}