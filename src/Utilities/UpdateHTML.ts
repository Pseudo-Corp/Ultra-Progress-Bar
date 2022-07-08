import { backgroundColorCreation } from '../Main/ProgressBar/Properties'
import { Player } from '../types/player'
import { format } from './Format'
import { updateElementById, updateStyleById } from './Render'

export type Tabs = 'Main' | 'Upgrades' | 'Talents' | 'Dueling' | 'Challenges'

export const hideStuff = (tab: Tabs) => {
    updateStyleById(
        'innerTesting',
        { border: 'none' }
    )
    updateStyleById(
        'mainTab',
        { display: 'none' }
    )
    updateStyleById(
        'upgradeTab',
        { display: 'none' }
    )
    updateStyleById(
        'talentsTab',
        { display: 'none' }
    )
    updateStyleById(
        'duelingTab',
        { display: 'none' }
    )
    updateStyleById(
        'challengeTab',
        { display: 'none' }
    )

    if (tab === 'Main') {
        updateStyleById(
            'mainTab',
            { display: 'block' }
        )
    } else if (tab === 'Upgrades') {
        updateStyleById(
            'upgradeTab',
            { display: 'block' }
        )
    } else if (tab === 'Talents') {
        updateStyleById(
            'talentsTab',
            { display: 'block' }
        )
    } else if (tab === 'Dueling') {
        updateStyleById(
            'duelingTab',
            { display: 'block' }
        )
        updateStyleById(
            'innerTesting',
            { border: '2px solid grey' }
        )
    } else if (tab === 'Challenges') {
        updateStyleById(
            'challengeTab',
            { display: 'block' }
        )
    }
}

export const unlockStuff = (player: Player) => {
    const unlockables = [
        [2, 'upgrade-tab-nav'],
        [5, 'coin-momentum'],
        [5, 'reset'],
        [20, 'talent-tab-nav'],
        [30, 'coin-reverberation'],
        [40, 'coin-vibration'],
        [50, 'dueling-tab-nav'],
        [75, 'coin-adoption'],
        [0, 'challenge-tab-nav'],
        [150, 'coin-resonance'],
        [225, 'coin-agitation'],
        [225, 'coin-empowerment'],
        [250, 'coin-reinforcement']
    ]

    for (const item of unlockables) {
        const display = (player.highestBarLevel >= item[0]) ? 'block' : 'none'
        /* Platonic: The reason why this doesn't use updateStyleById is because I absolutely
           need these display updates to occur, and this function is only called when
           one exceeds their highest bar level or on file load (both happen finitely many times)
        */
        const element = document.getElementById(`${String(item[1])}`)
        if (element) {
            element.style.display = display
        }
    }
}

export const onCriticalHit = (player: Player, superCrit: boolean) => {

    if (superCrit) {
        updateStyleById(
            'progression',
            { backgroundColor: 'gold'}
        )
    } else {
        updateStyleById(
            'progression',
            { backgroundColor: 'turquoise'}
        )
    }

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation(player)}
        )
    }, 500)

    updateElementById(
        'refresh-crit-counter',
        { textContent: format(player.criticalHitsThisRefresh) }
    )

    updateElementById(
        'refresh-crit-fragments',
        { textContent: format(100 * player.criticalHitsThisRefresh *
            player.coinUpgrades.barAgitation.upgradeEffect(), 2) }
    )
    player.barFragments.updateHTML()

}

export const onRefresh = (player: Player) => {
    updateStyleById(
        'progression',
        { backgroundColor: 'cyan' }
    )

    setTimeout(() => {
        updateStyleById(
            'progression',
            {backgroundColor: backgroundColorCreation(player)}
        )
    }, 1000)

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(player.coinValueCache)} coins` }
    )

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
    )

    updateElementById(
        'refresh-counter',
        { textContent: format(player.refreshCount)}
    )
}

export const updateAllCoinUpgrades = (player: Player) => {
    for (const item in player.coinUpgrades) {
        const k = item as keyof Player['coinUpgrades']
        player.coinUpgrades[k].updateHTML()
    }
}