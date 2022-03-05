import { setProperty } from 'dot-prop';
import localforage from 'localforage';
import { Alert, Confirm } from './HTML/Popups';
import { Coins } from './Main/Currency/Variants/Coin';
import { ProgressFragment } from './Main/Currency/Variants/ProgressFragment';
import {
    backgroundColorCreation,
    computeMainBarTNL,
    getBarWidth,
    incrementMainBarEXP,
    levelUpBar,
    updateDPS,
    updateMainBar,
    updateMainBarInformation
} from './Main/ProgressBar/Properties';
import * as Transform from './Main/Transformations/index';
import { Player } from './types/player';
import { format } from './Utilities/Format';
import { updateElementById, updateStyleById } from './Utilities/Render';
import { hideStuff } from './Utilities/UpdateHTML';

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
} as Player; // downcast on purpose

/**
 * A newly initiable save for later. 
 */
export const blankSave = Object.assign({}, player);

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
            barReinforcement: player.coinUpgrades.barReinforcement.valueOf()
        },
        talents: {
            barCriticalChance: player.talents.barCriticalChance.valueOf(),
            barSpeed: player.talents.barSpeed.valueOf(),
            coinGain: player.talents.coinGain.valueOf()
        },
        barFragments: player.barFragments.valueOf()
    };

    const save = btoa(JSON.stringify(saveObject));
    if (save !== null) {
        await localforage.setItem('UPBSave', save);
    }

}

/**
 * Map of properties on the Player object to adapt
 */
 const toAdapt = new Map<string, (data: Partial<Player>, player: Player) => unknown>([
    ['coins', (data, player) => new Coins(Number(data.coins?.amount ?? 0), player)],
    ['coinUpgrades.barSpeed', Transform.transformBarSpeed],
    ['coinUpgrades.barMomentum', Transform.transformBarMomentum],
    ['coinUpgrades.barReverberation', Transform.transformReverberation],
    ['coinUpgrades.barVibration', Transform.transformVibration],
    ['coinUpgrades.barAgitation', Transform.transformAgitation],
    ['coinUpgrades.barAdoption', Transform.transformAdoption],
    ['coinUpgrades.barEmpowerment', Transform.transformEmpowerment],
    ['coinUpgrades.barReinforcement', Transform.transformReinforcement],
    ['talents.barCriticalChance', Transform.transformTalentBarCriticalChance],
    ['talents.barSpeed', Transform.transformBarSpeedTalent],
    ['talents.coinGain', Transform.transformTalentCoinGain],
    ['barFragments', (data, player) => new ProgressFragment(Number(data.barFragments?.amount ?? 0), player)],
]);

/**
 * Loads from localforage directly
 */
const loadSavefile = async () => {
    const save = await localforage.getItem<string>('UPBSave');
    const data = save ? JSON.parse(atob(save)) as Player & Record<string, unknown> : null;

    // data is null on the first load!

    if (data !== null) { 
        const keys = Object.keys(data) as (keyof Player & string)[];

        for (const key of keys) {
            // If the property doesn't exist on the player object anymore, ignore
            if (!(key in blankSave)) continue;
            // If the property will be modified later, don't assign it here
            if (toAdapt.has(key)) continue;

            Object.defineProperty(player, key, { value: data[key] });
        }
    }

    for (const [key, adapter] of toAdapt) {
        setProperty(player, key, adapter(data ?? player, player));
    }
}

export const intervalHold = new Set<ReturnType<typeof setInterval>>();
export const interval = new Proxy(setInterval, {
    apply(target, thisArg, args: Parameters<typeof setInterval>) {
        const set = target.apply(thisArg, args);
        intervalHold.add(set);
        return set;
    }
});

export const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args: [ReturnType<typeof setInterval>]) {
        const id = args[0];
        if (intervalHold.has(id)) {
            intervalHold.delete(id);
        }

        return target.apply(thisArg, args);
    }
});

window.addEventListener('pagehide', () => {
    // This fixes a bug in Chrome (who would have guessed?) that
    // wouldn't properly load elements if the user scrolled down
    // and reloaded a page. Why is this a bug, Chrome? Why would
    // a page that is reloaded be affected by what the user did
    // beforehand? How does anyone use this buggy browser???????
    window.scrollTo(0, 0);
});


/**
 * Performance toggles
 * lastUpdate: updates every tick but is default 0 when page load
 * FPS: How many times the game is to update (tick) per second.
 */
let lastUpdate = 0;
export const FPS = 24; 
const saveRate = 5000

export const loadGame = async () => {
    for (const timer of intervalHold) {
        clearInt(timer);
    }

    intervalHold.clear();

    await loadSavefile();
    player.barTNL = computeMainBarTNL(player);

    Object.defineProperty(window, 'player', {
        value: player
    });

    updateMainBar(getBarWidth(player.barEXP, player.barTNL));
    player.barFragments.updateHTML();

    hideStuff('Main');
    
    updateStyleById(
        'progression',
        {
            backgroundColor: backgroundColorCreation(player)
        }
    );
    updateElementById(
        'coinWorth',
        {
            textContent: `Worth ${format(player.coinValueCache)} coins`
        }
    );

    if (player.coinValueCache) {
        updateStyleById(
            'coinWorth',
            {
                color: 'gold'
            }
        )
    }

    lastUpdate = performance.now();
    interval(tick, 1000 / FPS);
    interval(updateDPS, 1000, player);
    interval(saveGame, saveRate, player)
}

export const resetGame = async () => {
    const confirmed = await Confirm('Are you SURE you want to reset the game?');

    if (confirmed === false) {
        return Alert('OK, the game hasn\'t been reset!');
    }

    await localforage.removeItem('UPBSave');

    const keys = Object.keys(player) as (keyof Player)[];

    for (const key of keys) {
        if (typeof player[key] === 'object') {
            delete player[key];
            continue;
        }

        Object.defineProperty(player, key, { value: blankSave[key] });
    }

    await loadGame();
}

export const tick = () => {
    const now = performance.now();
    const delta = now - lastUpdate;

    tock(delta/1000)
    lastUpdate += delta
}

/**
 * Updates major game states (the main progress bar) per tick (about 50/sec)
 * @param delta how many seconds have elapsed since the previous tick
 */
export const tock = (delta: number) => {
    incrementMainBarEXP(delta, player);
    player.refreshTime += delta;
    updateElementById(
        'refresh-timer',
        { textContent: `${format(player.refreshTime, 2)}s` }
    );
    const width = getBarWidth(player.barEXP, player.barTNL);

    if (width < 100) {
        updateMainBar(width);
    } else {
        levelUpBar(player);
    }

    updateMainBarInformation(player);
}

/*
* Miscellaneous Game Variables
*/
export const minimumRefreshCounter = 60