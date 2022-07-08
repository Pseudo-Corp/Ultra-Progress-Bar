import { setProperty } from 'dot-prop'
import localforage from 'localforage'
import { Alert, Confirm } from './HTML/Popups'
import {
    backgroundColorCreation,
    computeMainBarTNL,
    getBarWidth,
    getCritTickChance,
    incrementMainBarEXP,
    levelUpBar,
    updateDPS,
    updateMainBar,
    updateMainBarInformation
} from './Main/ProgressBar/Properties'
import * as Transform from './Main/Transformations/index'
import { Player } from './types/player'
import { format } from './Utilities/Format'
import { updateElementById, updateStyleById } from './Utilities/Render'
import { hideStuff, unlockStuff } from './Utilities/UpdateHTML'
import { Globals } from './Main/Globals'

/**
 * This is the player variable, which is used throughout the game!
 */
export const player = {
    firstPlayed: new Date(),
    barEXP: 0,
    barTNL: 0,
    totalEXP: 0,
    barLevel: 0,
    highestBarLevel: 0,
    refreshCount: 0,
    refreshTime: 0,
    criticalHits: 0,
    criticalHitsThisRefresh: 0,
    coinValueCache: 0,
    currentChallenge: 'None',
    completedChallenges: {
        basicChallenge: 0,
        noRefresh: 0,
        noCoinUpgrades: 0,
        reducedFragments: 0
    }

} as Player // downcast on purpose

/**
 * A newly initiable save for later.
 */
export const blankSave = Object.assign({}, player)

/**
 * Saves your savefile to localstorage.
 */
export const saveGame = async (player: Player) => {
    const saveObject = {
        ...player,
        coins: player.coins.valueOf(),
        coinUpgrades: {
            barSpeed: player.coinUpgrades.barSpeed.valueOf(),
            barMomentum: player.coinUpgrades.barMomentum.valueOf(),
            barReverberation: player.coinUpgrades.barReverberation.valueOf(),
            barVibration: player.coinUpgrades.barVibration.valueOf(),
            barAgitation: player.coinUpgrades.barAgitation.valueOf(),
            barAdoption: player.coinUpgrades.barAdoption.valueOf(),
            barEmpowerment: player.coinUpgrades.barEmpowerment.valueOf(),
            barReinforcement: player.coinUpgrades.barReinforcement.valueOf(),
            barResonance: player.coinUpgrades.barResonance.valueOf()
        },
        talents: {
            barCriticalChance: player.talents.barCriticalChance.valueOf(),
            barSpeed: player.talents.barSpeed.valueOf(),
            coinGain: player.talents.coinGain.valueOf()
        },
        barFragments: player.barFragments.valueOf(),
        fighter: player.fighter.valueOf()
    }

    const save = btoa(JSON.stringify(saveObject))

    await localforage.setItem('UPBSave', save)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof navigator.storage?.estimate === 'function') {
        // TODO: can either of these really be undefined?
        const { usage, quota } = await navigator.storage.estimate()

        if (quota && usage && usage / quota * 100 > 95) {
            void Alert(
                'You are very close to running out of space on this computer which may cause your save to get' +
                'automatically deleted soon! Clear some other site\'s data (and tell Khafra that this works please)!'
            )
        }
    }
}

/**
 * Map of properties on the Player object to adapt
 */
const toAdapt = new Map<string,(data: Partial<Player>, player: Player) => unknown>([
    ['coins', Transform.transformCoins],
    ['coinUpgrades.barSpeed', Transform.transformBarSpeed],
    ['coinUpgrades.barMomentum', Transform.transformBarMomentum],
    ['coinUpgrades.barReverberation', Transform.transformReverberation],
    ['coinUpgrades.barVibration', Transform.transformVibration],
    ['coinUpgrades.barAgitation', Transform.transformAgitation],
    ['coinUpgrades.barAdoption', Transform.transformAdoption],
    ['coinUpgrades.barEmpowerment', Transform.transformEmpowerment],
    ['coinUpgrades.barReinforcement', Transform.transformReinforcement],
    ['coinUpgrades.barResonance', Transform.transformResonance],
    ['talents.barCriticalChance', Transform.transformTalentBarCriticalChance],
    ['talents.barSpeed', Transform.transformBarSpeedTalent],
    ['talents.coinGain', Transform.transformTalentCoinGain],
    ['barFragments', Transform.transformBarFragments],
    ['fighter', Transform.transformPlayerFigher]
])

/**
 * Loads from localforage directly
 */
const loadSavefile = async () => {
    const save = await localforage.getItem<string>('UPBSave')
    const data = save ? JSON.parse(atob(save)) as Player & Record<string, unknown> : null

    // data is null on the first load!

    if (data !== null) {
        const keys = Object.keys(data) as (keyof Player & string)[]

        for (const key of keys) {
            // If the property doesn't exist on the player object anymore, ignore
            if (!(key in blankSave)) continue
            // If the property will be modified later, don't assign it here
            if (toAdapt.has(key)) continue

            Object.defineProperty(player, key, { value: data[key] })
        }
    }

    for (const [key, adapter] of toAdapt) {
        setProperty(player, key, adapter(data ?? player, player))
    }

    unlockStuff(player)
}

export const intervalHold = new Set<ReturnType<typeof setInterval>>()
export const interval = new Proxy(setInterval, {
    apply(target, thisArg, args: Parameters<typeof setInterval>) {
        const set = target.apply(thisArg, args)
        intervalHold.add(set)
        return set
    }
})

export const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args: [ReturnType<typeof setInterval>]) {
        const id = args[0]
        if (intervalHold.has(id)) {
            intervalHold.delete(id)
        }

        return target.apply(thisArg, args)
    }
})

window.addEventListener('pagehide', () => {
    // This fixes a bug in Chrome (who would have guessed?) that
    // wouldn't properly load elements if the user scrolled down
    // and reloaded a page. Why is this a bug, Chrome? Why would
    // a page that is reloaded be affected by what the user did
    // beforehand? How does anyone use this buggy browser???????
    window.scrollTo(0, 0)
})


/**
 * Performance toggles
 * lastUpdate: updates every tick but is default 0 when page load
 * FPS: How many times the game is to update (tick) per second.
 */
let lastUpdate = 0
let lastFightUpdate = 0
export const FPS = 24
const saveRate = 60_000

export const loadGame = async () => {
    for (const timer of intervalHold) {
        clearInt(timer)
    }

    intervalHold.clear()

    await loadSavefile()
    player.barTNL = computeMainBarTNL(player)

    Object.defineProperty(window, 'player', {
        value: player
    })

    updateMainBar(getBarWidth(player.barEXP, player.barTNL))
    player.barFragments.updateHTML()

    hideStuff('Main')

    updateStyleById(
        'progression',
        {
            backgroundColor: backgroundColorCreation(player)
        }
    )
    updateElementById(
        'coinWorth',
        {
            textContent: `Worth ${format(player.coinValueCache)} coins`
        }
    )

    if (player.coinValueCache) {
        updateStyleById(
            'coinWorth',
            {
                color: 'gold'
            }
        )
    }

    lastUpdate = performance.now()
    lastFightUpdate = performance.now()
    interval(tick, 1000 / FPS)
    interval(fightUpdate, 1000/FPS)
    interval(updateDPS, 1000, player)
    interval(saveGame, saveRate, player)
}

export const resetGame = async () => {
    const confirmed = await Confirm('Are you SURE you want to reset the game?')

    if (confirmed === false) {
        return Alert('OK, the game hasn\'t been reset!')
    }

    await localforage.removeItem('UPBSave')

    const keys = Object.keys(player) as (keyof Player)[]

    for (const key of keys) {
        if (typeof player[key] === 'object') {
            delete player[key]
            continue
        }

        Object.defineProperty(player, key, { value: blankSave[key] })
    }

    await loadGame()
}

export const tick = () => {
    const now = performance.now()
    const delta = now - lastUpdate

    tock(delta/1000)
    lastUpdate += delta
}

export const fightUpdate = async () => {
    const now = performance.now()
    const delta = now - lastFightUpdate

    lastFightUpdate += delta

    void Globals.getGlobalEnemy()?.generateAttacks(delta/1000)
    void player.fighter.decreaseDelay(delta/1000)
}

/**
 * Updates major game states (the main progress bar) per tick (about 24/sec)
 * @param delta how many seconds have elapsed since the previous tick
 */
export const tock = (delta: number) => {
    let remainingDelta = delta

    if (remainingDelta > 5) {
        const criticalHitChance = getCritTickChance(player)
        const simulatedCriticalHits = FPS * criticalHitChance * 5
        const floorCriticalHits = Math.floor(simulatedCriticalHits)
        const decimalCrit = simulatedCriticalHits - floorCriticalHits

        const simulatedSuperCrit = simulatedCriticalHits * player.coinUpgrades.barResonance.upgradeEffect()
        const floorSuper = Math.floor(simulatedSuperCrit)
        const decimalSuper = simulatedSuperCrit - floorSuper

        while (remainingDelta > 5) {

            const random = Math.random()
            let extraCrits = 0
            if (random < decimalCrit) {
                extraCrits = 1
            }

            const actualCriticalHits = floorCriticalHits + extraCrits
            player.criticalHitsThisRefresh += actualCriticalHits


            const superRandom = Math.random()
            let extraSuper = 0
            if (superRandom < decimalSuper) {
                extraSuper += 1
            }

            let actualSuper = floorSuper + extraSuper

            while (actualSuper > 0) {
                player.coins.gain(Math.floor(player.barLevel/5) + 3)
                actualSuper -= 1
            }

            incrementMainBarEXP(5, player)
            remainingDelta -= 5

            const width = getBarWidth(player.barEXP, player.barTNL)

            if (width >= 100) {
                void levelUpBar(player)
            }

            updateMainBarInformation(player)
        }
    }

    incrementMainBarEXP(remainingDelta, player)
    player.refreshTime += delta
    updateElementById(
        'refresh-timer',
        { textContent: `${format(player.refreshTime, 2)}s` }
    )
    const width = getBarWidth(player.barEXP, player.barTNL)

    if (width < 100) {
        updateMainBar(width)
    } else {
        void levelUpBar(player)
    }

    updateMainBarInformation(player)
}

/*
* Miscellaneous Game Variables
*/
export const minimumRefreshCounter = 60