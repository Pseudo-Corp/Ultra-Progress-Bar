import { setProperty } from 'dot-prop';
import localforage from 'localforage';
import './Events/Load';
import './Events/VisisbilityChange';
import { Coins } from './Main/Currency/Variants/Coin';
import { ProgressFragment } from './Main/Currency/Variants/ProgressFragment';
import {
    backgroundColorCreation,
    computeMainBarCoinWorth,
    computeMainBarTNL,
    getBarWidth,
    incrementMainBarEXP,
    levelUpBar,
    updateDPS,
    updateMainBar,
    updateMainBarInformation
} from './Main/ProgressBar/Properties';
import * as Transform from './Main/Transformations/index';
import {
    CoinBarAgitation,
    CoinBarMomentum,
    CoinBarReverberation,
    CoinBarSpeed,
    CoinBarVibration,
    coinUpgradeCosts
} from './Main/Upgrades/Variants/Coin';
import { talentBaseEXP, TalentCriticalChance, TalentProgressSpeed } from './Main/Upgrades/Variants/Talents';
import { Player } from './types/player';
import { format } from './Utilities/Format';
import { updateElementById, updateStyleById } from './Utilities/Render';
import { hideStuff } from './Utilities/UpdateHTML';


/*
* This is the player variable, which is used throughout the game!
*/

export const player: Player = {
    firstPlayed: new Date(),
    barEXP: 0,
    barTNL: 0,
    totalEXP: 0,
    barLevel: 0,
    highestBarLevel: 0,
    coins: new Coins(),
    coinUpgrades: {} as Player['coinUpgrades'],
    talents: {} as Player['talents'],
    barFragments: {} as Player['barFragments'],
    refreshCount: 0,
    refreshTime: 0,
    criticalHits: 0,
    criticalHitsThisRefresh: 0,
};

player.coinUpgrades = {
    barSpeed: new CoinBarSpeed(0, coinUpgradeCosts.barSpeed),
    barMomentum: new CoinBarMomentum(0, coinUpgradeCosts.barMomentum),
    barReverberation: new CoinBarReverberation(0, coinUpgradeCosts.barReverberation),
    barVibration: new CoinBarVibration(0, coinUpgradeCosts.barVibration),
    barAgitation: new CoinBarAgitation(0, coinUpgradeCosts.barAgitation)
};

player.talents = {
    barCriticalChance: new TalentCriticalChance(0, talentBaseEXP.talentCriticalChance, 0, 0, 0),
    barSpeed: new TalentProgressSpeed(0, talentBaseEXP.talentProgressSpeed, 0, 0, 0)
};

player.barFragments = new ProgressFragment();

/**
 * A newly initiable save for later. 
 */
export const blankSave = Object.assign({}, player);

/**
 * Saves your savefile to localstorage.
 */
export const saveGame = async () => {
    const saveString = Object.assign({}, player, {}); 

    await localforage.removeItem('UPBSave');

    const save = btoa(JSON.stringify(saveString));
    if (save !== null) {
        await localforage.setItem('UPBSave', save);
    }
}

/**
 * Map of properties on the Player object to adapt
 */
 const toAdapt = new Map<string, (data: Player) => unknown>([
    ['coins', data => new Coins(Number(data.coins.amount))],
    ['coinUpgrades.barSpeed', Transform.transformBarSpeed],
    ['coinUpgrades.barMomentum', Transform.transformBarMomentum],
    ['coinUpgrades.barReverberation', Transform.transformReverberation],
    ['coinUpgrades.barVibration', Transform.transformVibration],
    ['coinUpgrades.barAgitation', Transform.transformAgitation],
    ['talents.barCriticalChance', Transform.transformTalentBarCriticalChance],
    ['talents.barSpeed', Transform.transformBarSpeedTalent],
    ['barFragments', data => new ProgressFragment(Number(data.barFragments.amount))],
]);

/**
 * Loads from localforage directly
 */
const loadSavefile = async () => {
    console.log('load attempted')
    const save = await localforage.getItem<string>('UPBSave');
    const data = save ? JSON.parse(atob(save)) as Player & Record<string, unknown> : null;

    // TODO: better error message
    if (!data) return;

    const keys = Object.keys(data) as (keyof Player & string)[];

    for (const key of keys) {
        // If the property doesn't exist on the player object anymore, ignore
        if (!(key in blankSave)) continue;
        // If the property will be modified later, don't assign it here
        if (toAdapt.has(key)) continue;

        Object.defineProperty(player, key, { value: data[key] });
    }

    for (const [key, adapter] of toAdapt) {    
        setProperty(player, key, adapter(data));
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
    player.barTNL = computeMainBarTNL();

    Object.defineProperty(window, 'player', {
        value: player
    });

    updateMainBar(getBarWidth(player.barEXP, player.barTNL));
    player.barFragments.updateHTML();

    hideStuff('Main');
    
    updateStyleById(
        'progression',
        {
            backgroundColor: backgroundColorCreation()
        }
    );
    updateElementById(
        'coinWorth',
        {
            textContent: `Worth ${format(computeMainBarCoinWorth())} coins`
        }
    );

    lastUpdate = performance.now();
    interval(tick, 1000 / FPS);
    interval(updateDPS, 1000);
    interval(saveGame, saveRate)
}

export const resetGame = async () => {

    await localforage.removeItem('UPBSave');
    const emptySave = btoa(JSON.stringify(blankSave))

    await localforage.setItem('UPBSave', emptySave)
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
    incrementMainBarEXP(delta);
    player.refreshTime += delta;
    updateElementById(
        'refresh-timer',
        { textContent: `${format(player.refreshTime, 2)}s` }
    );
    const width = getBarWidth(player.barEXP, player.barTNL);

    if (width < 100) {
        updateMainBar(width);
    } else {
        levelUpBar();
    }

    updateMainBarInformation();
}

/*
* Miscellaneous Game Variables
*/
export const minimumRefreshCounter = 60