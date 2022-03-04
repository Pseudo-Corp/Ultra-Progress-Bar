import { Player } from '../../types/player';
import { format } from '../../Utilities/Format';
import { updateElementById, updateStyleById } from '../../Utilities/Render';
import { onCriticalHit } from '../../Utilities/UpdateHTML';
import { getElementById } from '../../Utilities/Render';

/**
 * Basic Bar Stats
 */
const baseEXPReq = 10;
let currentPerSec = 0;
let previousPerSec = 0;

export const computeMainBarTNL = (player: Player) => {
    let TNL = 0
    // Additive Component
    TNL += baseEXPReq * Math.pow(player.barLevel + 1, 2)
    // Nerf until level 20.
    TNL *= Math.min(1, (player.barLevel + 20) / 40)
    // Buff after level 20.
    TNL *= Math.max(1, 1 + (player.barLevel - 20) / 10)
    // Multiplicative Component (Bumps at 40, 100, 200)
    if (player.barLevel > 40) {
        TNL *= Math.pow(2, 1/10 * (player.barLevel - 40));
    }
    if (player.barLevel > 100) {
        TNL *= Math.pow(2, 1/10 * (player.barLevel - 100));
    }
    if (player.barLevel > 200) {
        TNL *= Math.pow(2, 1/10 * (player.barLevel - 200));
    }
    return TNL
}

export const computeBarArmor = (player: Player) => {
    // Armor is a value in [0, 1]
    // 1 indicates no progress, 0 indicates full progress.

    let baseArmor = 0
    if (player.barLevel >= 5) {
        baseArmor = 0.1
    }
    if (player.barLevel >= 10) {
        baseArmor += 0.9 * (1 - Math.pow(Math.E, -player.barLevel / 200))
    }

    if (baseArmor >= 0.9999) {
        return 10000
    }
        
    return 1 / (1 - baseArmor)
}

export const computeArmorMultiplier = (player: Player) => {
    const armor = computeBarArmor(player);
    return armor * (1 - player.barEXP / player.barTNL)
}

export const incrementMainBarEXP = (delta: number, player: Player) => {
    if (delta === undefined || delta === null) {
        return
    }
    let baseAmountPerSecond = 1
    baseAmountPerSecond += player.coinUpgrades.barSpeed.upgradeEffect();
    baseAmountPerSecond *= player.barFragments.unspentBonus();
    baseAmountPerSecond *= Math.pow(
        1 + player.coinUpgrades.barMomentum.upgradeEffect(),
        Math.sqrt(100 * Math.min(1, player.barEXP / player.barTNL))
    );
    baseAmountPerSecond /= computeArmorMultiplier(player);
    baseAmountPerSecond *= player.talents.barSpeed.talentEffect();

    const criticalRoll = Math.random();
    const total =
        player.coinUpgrades.barReverberation.upgradeEffect() + player.talents.barCriticalChance.talentEffect();
    if (criticalRoll < total) {
        baseAmountPerSecond *= player.coinUpgrades.barVibration.upgradeEffect();
        player.talents.barCriticalChance.gainEXP(delta);
        player.criticalHits += 1;
        player.criticalHitsThisRefresh += 1;
        onCriticalHit(player);
    }
    
    const actualAmount = baseAmountPerSecond * delta
    player.barEXP += actualAmount
    currentPerSec += actualAmount

    updateElementById(
        'perSecCurr',
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
    updateStyleById(
        'progression',
        { width: `${width}%` }
    );
}

export const backgroundColorCreation = (player: Player) => {
    if (player.barLevel >= 128) return '#FFFFFF';

    const R = (128 + player.barLevel).toString(16).padStart(2, '0');
    const G = (2 * player.barLevel).toString(16).padStart(2, '0');
    const B = (128 + player.barLevel).toString(16).padStart(2, '0');

    return `#${R}${G}${B}`;
}

export const levelUpBar = (player: Player) => {
    player.coins.gain(computeMainBarCoinWorth(player));
    player.barEXP -= player.barTNL
    player.barLevel += 1;

    if (player.barLevel > player.highestBarLevel) {
        player.highestBarLevel = player.barLevel
    }

    const barColor = backgroundColorCreation(player);
    updateStyleById(
        'progression',
        { backgroundColor: barColor }
    );

    player.barTNL = computeMainBarTNL(player)

    // Adjust barEXP to prevent overleveling / snowball effect on levels
    player.barEXP /= 10;
    player.barEXP = Math.min(player.barEXP, Math.floor(player.barTNL / 10));
    
    const width = getBarWidth(player.barEXP, player.barTNL);
    updateMainBar(width);

    updateElementById(
        'coinWorth',
        { textContent: `Worth ${format(computeMainBarCoinWorth(player))} coins` }
    );
    player.barFragments.updateHTML();

    if (player.barLevel === 20) {
        player.talents.barCriticalChance.updateHTML('Level20');
        player.talents.barSpeed.updateHTML('Level20');
    }
}

export const updateMainBarInformation = (player: Player) => {
    updateElementById(
        'level',
        { textContent: `Level: ${player.barLevel}` }
    );
    updateElementById(
        'exp',
        { textContent: `EXP: ${format(player.barEXP)}/${format(player.barTNL)}` }
    );
}

export const updateDPS = (player: Player) => {
    previousPerSec = currentPerSec;
    currentPerSec = 0;
    updateElementById(
        'perSecPrev',
        { textContent: `+${format(previousPerSec,2)} prev sec` }
    );

    player.talents.barCriticalChance.updateHTML('Time')
    player.talents.barSpeed.gainEXP(previousPerSec);
}

export const computeMainBarCoinWorth = (player: Player) => {
    let baseWorth = 0;

    const nextLevel = 1 + player.barLevel
    // Highest level bonus
    if (nextLevel > player.highestBarLevel) {
        baseWorth += 3;
    }

    // Every 5th bar
    if (nextLevel % 5 === 0) {
        baseWorth += Math.floor(nextLevel / 5) + 3;
    }

    // Every 10th bar, adding to the previous
    if (nextLevel % 10 === 0) {
        baseWorth += Math.floor(nextLevel / 2);
    }

    if (nextLevel % 50 === 0) {
        baseWorth += Math.floor(nextLevel / 2);
    }

    if (nextLevel % 100 === 0) {
        baseWorth += Math.floor(nextLevel);
    }

    const coinHTML = getElementById('coinWorth');
    coinHTML.style.color = (baseWorth > 0) ? 'gold' : 'grey'
    

    return baseWorth
}