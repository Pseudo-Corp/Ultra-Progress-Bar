import localforage from 'localforage';
import { Coins } from './Main/Currency/Variants/Coin';
import { ProgressFragment } from './Main/Currency/Variants/ProgressFragment';
import './Events/VisisbilityChange';

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
    coinUpgrades: {
        barSpeed: new CoinBarSpeed(0, coinUpgradeCosts.barSpeed),
        barMomentum: new CoinBarMomentum(0, coinUpgradeCosts.barMomentum)
    },
    barFragments: new ProgressFragment(),
    refreshCount: 0,
    refreshTime: 0,
}

/**
 * A newly initiable save for later. 
 */
export const blankSave = Object.assign({}, player, {
});

/**
 * Saves your savefile to localstorage.
 * @param button Whether the save pulse was forced by button
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
 const toAdapt = new Map<keyof Player, (data: Player) => unknown>([
    ['coins', data => new Coins(Number(data.coins.amount))],
    ['barFragments', data => new ProgressFragment(Number(data.barFragments.amount))]
]);

/**
 * Loads from localforage directly
 */
const loadSavefile = async () => {
    console.log('load attempted')
    const save = await localforage.getItem<string>('UPBSave');

    const data = save ? JSON.parse(atob(save)) as Player & Record<string, unknown> : null
    if (data) {
        Object.keys(data).forEach((stringProp) => {
            const prop = stringProp as keyof Player
            if (!(prop in player)) {
                return;
            }
            else if (toAdapt.has(prop)) {
                return ((player[prop] as unknown) = toAdapt.get(prop)!(data));
            }
            return ((player[prop] as unknown) = data[prop])
        }
    )
    player.coinUpgrades.barSpeed = new CoinBarSpeed(data.coinUpgrades.barSpeed.level, coinUpgradeCosts.barSpeed);
    player.coinUpgrades.barMomentum = new CoinBarMomentum(data.coinUpgrades.barMomentum.level, coinUpgradeCosts.barMomentum);
}
}


/*
* These are fundamental functions for intervals, which are used
* to create the basic game loop at 50fps without jarring effects.
*/

import { backgroundColorCreation, computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, incrementMainBarEXP, levelUpBar, updateDPS, updateMainBar, updateMainBarInformation } from "./Main/ProgressBar/Properties";
import { CoinBarMomentum, CoinBarSpeed, coinUpgradeCosts } from './Main/Upgrades/Variants/Coin';
import { Player } from "./types/player";
import { generateEventHandlers } from './Utilities/Eventlisteners';
import { format } from './Utilities/Format';
import { updateElement } from './Utilities/Render';
import { getElementById, hideStuff } from './Utilities/UpdateHTML';

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
        if (intervalHold.has(id))
            intervalHold.delete(id);

        return target.apply(thisArg, args);
    }
});

window.addEventListener('load', () => {
    generateEventHandlers();
    void loadGame();
});

window.addEventListener('unload', () => {
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
const FPS = 50; 
const saveRate = 5000

export const loadGame = async () => {
    for (const timer of intervalHold)
        clearInt(timer);

    intervalHold.clear();

    await loadSavefile();
    player.barTNL = computeMainBarTNL();

    Object.defineProperty(window, 'player', {
        value: player
    });

    updateMainBar(getBarWidth(player.barEXP, player.barTNL));
    player.barFragments.updateHTML();

    hideStuff("Main");
    
    updateElement(
        getElementById("progression").style,
        {
            backgroundColor: backgroundColorCreation()
        }
    );
    updateElement(
        getElementById('coinWorth'),
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

    await localforage.removeItem("UPBSave");
    const emptySave = btoa(JSON.stringify(blankSave))

    await localforage.setItem("UPBSave", emptySave)
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
    updateElement(
        getElementById("refresh-timer"),
        {textContent: `${format(player.refreshTime, 2)}s`}
    )
    const width = getBarWidth(player.barEXP, player.barTNL);

    if (width < 100)
        updateMainBar(width)
    else {
        levelUpBar();
    }

    updateMainBarInformation();
}