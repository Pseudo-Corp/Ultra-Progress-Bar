//import assert from 'assert'

import { player } from "../../Game";
import { format } from "../../Utilities/Format";
import { updateElement } from "../../Utilities/Render";
import { getElementById } from "../../Utilities/UpdateHTML";

/**
 * Basic Bar Stats
 */
const baseEXPReq = 10;
let currentPerSec = 0;
let previousPerSec = 0;

export const computeMainBarTNL = () => {
    let TNL = 0
    // Additive Component
    TNL += baseEXPReq * Math.pow(player.barLevel + 1, 2)
    // Nerf until level 20.
    TNL *= Math.min(1, (player.barLevel + 20) / 40)
    // Multiplicative Component (Bumps at 50, 100, 200)
    if (player.barLevel > 50)
        TNL *= Math.pow(2, 1/10 * (player.barLevel - 50))
    if (player.barLevel > 100)
        TNL *= Math.pow(2, 1/50 * (player.barLevel - 100))
    if (player.barLevel > 200)
        TNL *= Math.pow(2, 1/200 * (player.barLevel - 200))
    return TNL
}

export const computeBarArmor = () => {
    // Armor is a value in [0, 1]
    // 1 indicates no progress, 0 indicates full progress.

    let baseArmor = 0
    if (player.barLevel >= 5) {
        baseArmor = 0.2
    }
    if (player.barLevel >= 10) {
        baseArmor += 0.8 * (1 - Math.pow(Math.E, -(player.barLevel - 10) / 90))
    }
    return baseArmor
}

export const computeArmorMultiplier = () => {
    const armor = computeBarArmor();
    return 1 - (armor * (1 - player.barEXP / player.barTNL))
}

export const incrementMainBarEXP = (delta: number) => {
    if (delta === undefined || delta === null) {
        return
    }
    let baseAmountPerSecond = 1
    baseAmountPerSecond += player.coinUpgrades.barSpeed.upgradeEffect();
    baseAmountPerSecond *= player.barFragments.unspentBonus();
    baseAmountPerSecond *= 1 + 100 * Math.min(1, player.barEXP / player.barTNL) * player.coinUpgrades.barMomentum.upgradeEffect();
    baseAmountPerSecond *= computeArmorMultiplier();
    const actualAmount = baseAmountPerSecond * delta
    player.barEXP += actualAmount
    currentPerSec += actualAmount

    updateElement(
        getElementById("perSecCurr"),
        { textContent: `+${format(currentPerSec,2)} this sec` }
    );
}

/**
 * Obtain the width of a progress bar given current progress and required progress
 * @param currScore The amount of progress (number) the player has toward something
 * @param targetScore How much progress is needed to fill the progress bar
 * @returns a Number [0, 100] indicating how wide the bar should be, with precision 0.1
 */
export const getBarWidth = (currScore: number, targetScore: number) => {
    // Only return increments of 0.1%
    return Math.min(100, 0.1 * Math.floor(1000 * currScore / targetScore))
}

export const updateMainBar = (width: number) => {
    updateElement(
        getElementById("progression").style,
        { width: `${width}%` }
    );
}

export function backgroundColorCreation() {
    const R = (128 + player.barLevel).toString(16)
    const G = (2 * player.barLevel).toString(16)
    const B = (128 + player.barLevel).toString(16)

    if (player.barLevel < 128)
        return `#${R}${G}${B}`
    else
        return `#ffffff`
}

export const levelUpBar = () => {
    player.coins.gain(computeMainBarCoinWorth());
    player.barEXP -= player.barTNL
    player.barLevel += 1;

    if (player.barLevel > player.highestBarLevel) {
        player.highestBarLevel = player.barLevel
    }

    updateElement(
        getElementById('progression').style,
        { backgroundColor: backgroundColorCreation() }
    );

    player.barTNL = computeMainBarTNL()
    const width = getBarWidth(player.barEXP, player.barTNL);
    updateMainBar(width);

    updateElement(
        getElementById("coinWorth"),
        { textContent: `Worth ${format(computeMainBarCoinWorth())} coins` }
    );
    player.barFragments.updateHTML();
}

export const updateMainBarInformation = () => {
    updateElement(
        getElementById('level'),
        { textContent: `Level: ${player.barLevel}` }
    );
    updateElement(
        getElementById('exp'),
        { textContent: `EXP: ${format(player.barEXP)}/${format(player.barTNL)}` }
    );
}

export const updateDPS = () => {
    previousPerSec = currentPerSec;
    currentPerSec = 0;
    updateElement(
        getElementById('perSecPrev'),
        { textContent: `+${format(previousPerSec,2)} prev sec` }
    );
}

export const computeMainBarCoinWorth = () => {
    let baseWorth = 0;

    const nextLevel = player.barLevel + 1
    baseWorth += Math.floor((nextLevel + 7) / 10)
    // Highest level bonus
    if (nextLevel > player.highestBarLevel)
        baseWorth += 3;
    if (nextLevel % 10 === 0)
        baseWorth += Math.floor(nextLevel / 10)

    return baseWorth
}