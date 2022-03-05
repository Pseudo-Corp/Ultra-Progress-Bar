import { FPS, minimumRefreshCounter } from '../../../Game'
import { Alert, Confirm } from '../../../HTML/Popups'
import { Player } from '../../../types/player'
import { format } from '../../../Utilities/Format'
import { computePolyCost } from '../../../Utilities/HelperFunctions'
import { updateElementById, updateStyleById } from '../../../Utilities/Render'
import { reset } from '../../Reset/Refresh'
import { Upgrade } from '../Upgrades'

export const isLevel20 = (player: Player) => player.barLevel >= 20;

export type TalentHTMLType = 'Initialize' | 'GainEXP' | 'LevelUp' | 'PermLevelUp' | 'Time' | 'Level20'

export abstract class Talent extends Upgrade {
    abstract idHTML: string
    investedFragments: number
    permLevel: number
    currEXP: number
    currTNL: number

    // In this case, "cost" refers to the base EXP requirement.
    constructor(level: number, cost: number, 
                investedFragments: number, permLevel: number, 
                currEXP: number, player: Player) {
        super(level, cost, player)
        this.investedFragments = investedFragments;
        this.permLevel = permLevel;
        this.currEXP = currEXP
        this.currTNL = this.calculateTNL();
    }

    calculateTNL(): number {
        let baseCost = computePolyCost(this.cost, this.level, this.level + 1, 2)
        const costIncreaseThresholds = [50, 100, 200, 500, 1000, 2000, 5000, 10000]
        for (const level of costIncreaseThresholds) {
            if (this.level >= level) {
                baseCost *= 2
            }
        }
        return baseCost;
    }

    setEXP(amount: number): void {
        this.currEXP = amount
        this.updateHTML('GainEXP')
    }

    /**
     * Returns the product multipliers that apply to every single talent
     * If you have a global multiplier you like to add, add it here because it
     * is a lot safer than putting it in each of the talents (and easier to change later).
     */
    globalTalentEXPMultipliers(): number {
        let globalMult = 1;
        globalMult *= (1 + 1/100 * Math.pow(Math.log2(1 + this.investedFragments / 125), 2))
        globalMult *= (1 + this.player.coinUpgrades.barAdoption.upgradeEffect());
        return globalMult
    }

    gainEXP(dt?: number): void {
        if (!isLevel20(this.player)) return;

        const amount = this.calculateEXPGain(dt);
        this.currEXP += amount
        if (this.currEXP >= this.currTNL) {
            this.levelUp();
        }
        this.updateHTML('GainEXP');
    }

    subEXP(amount: number): void {
        if (!isLevel20(this.player)) return;
        this.currEXP -= amount;
    }

    levelUp(): void {
        let counter = 0;
        while (this.currEXP >= this.currTNL) {
            if (counter >= 10) break;
            this.level += 1;
            this.subEXP(this.currTNL);
            this.currTNL = this.calculateTNL();
            counter++;
        }
        this.updateHTML('LevelUp');
    }

    computePermLevelGain(level: number): number {
        let levelsToGain = 0
        levelsToGain += Math.sqrt(level);
        levelsToGain *= Math.min(4, Math.pow(this.player.refreshTime / 300, 2))
        levelsToGain = Math.min(level, levelsToGain)
        return Math.floor(levelsToGain)
    }

    convertToPerm(): void {
        this.permLevel += this.computePermLevelGain(this.level);
        this.level = 0;
        this.setEXP(0);
        this.currTNL = this.calculateTNL();
        this.updateHTML('PermLevelUp');
    }

    getBarWidth(): number {
        return Math.min(100, 100 * this.currEXP / this.currTNL)
    }

    async sacrificeFragments (): Promise<void> {
        if (this.player.barFragments.amount < 1000) {
            return void Alert('You cannot sacrifice your bar fragments until you have at least 1,000 of them.');
        } else if (this.player.barFragments.amount <= this.investedFragments) {
            return void Alert(
                `This bar needs more fragments than you can invest. You need ${format(this.investedFragments)}.`
            );
        }

        else {
            const confirmation = await Confirm(
                `You will sacrifice ${format(this.player.barFragments.amount - this.investedFragments)} ` +
                'Bar Fragments to increase EXP gain for this bar. Will you? ' +
                '(automatically performs a refresh, setting your fragments to 0)'
            );

            if (confirmation) {
                this.investedFragments = this.player.barFragments.amount
                this.player.refreshTime += minimumRefreshCounter;
                void reset('Refresh', this.player);
                this.player.barFragments.set(0);
            }
        }
    }

    updateHTML(reason: TalentHTMLType): void {
        if (this.idHTML === undefined) return;

        if (reason === 'Initialize' || reason === 'GainEXP' || reason === 'LevelUp' || reason === 'PermLevelUp') {
            updateElementById(
                `talent${this.idHTML}EXP`,
                { textContent: `EXP: ${format(this.currEXP)}/${format(this.currTNL)}` }
            )
            const width = `${this.getBarWidth()}%`
            updateStyleById(
                `talent${this.idHTML}Progression`,
                { width: width }
            )

        }
        if (reason === 'Initialize' || reason === 'LevelUp' || reason === 'PermLevelUp') {
            updateElementById(
                `talent${this.idHTML}TempLevel`,
                { textContent: `Level this run: ${format(this.level)}`}
            )
        }
        if (reason === 'Initialize' || reason === 'PermLevelUp') {
            updateElementById(
                `talent${this.idHTML}PermLevel`,
                { textContent: `Banked levels: ${format(this.permLevel)}`}
            )
        }
        if (reason === 'Initialize' || reason === 'Time' || reason === 'LevelUp') {
            updateElementById(
                `talent${this.idHTML}PermGain`,
                { textContent: `Banked on reset: +${format(this.computePermLevelGain(this.level))}`}
            )
        }
        if (reason === 'Initialize' || reason === 'LevelUp' || reason === 'PermLevelUp' || reason === 'Level20') {
            updateElementById(
                `talent${this.idHTML}Effect`,
                { textContent: this.displayEffect()}
            )
        }
    }

    public override valueOf () {
        return {
            level: this.level,
            cost: this.cost,
            investedFragments: this.investedFragments,
            permLevel: this.permLevel,
            currEXP: this.currEXP,
            idHTML: this.idHTML
        }
    }

    abstract displayEffect(): string
    abstract calculateEXPGain(dt?: number): number
    abstract talentEffect(): number
}

export const talentBaseEXP = {
    talentCriticalChance: 10,
    talentProgressSpeed: 10,
    talentCoinGain: 1000,
}

export class TalentCriticalChance extends Talent {
    idHTML = 'CriticalChance'
    constructor(level: number, cost: number, 
        investedFragments: number, permLevel: number, 
        currEXP: number, player: Player) {
        super(level, cost, investedFragments, permLevel, currEXP, player);
        this.updateHTML('Initialize');
    }

    calculateEXPGain(dt: number): number {
        // Critical Hit by default adds 1 EXP
        let expGain = 1
        // Adjust EXP based on tick rate relative to base FPS of 24
        expGain *= (dt * 1000 / FPS)
        expGain *= (this.player.barLevel / 10 - 1) // Is 1 at level 20
        expGain *= this.globalTalentEXPMultipliers();
        return expGain
    }

    talentEffect(): number {
        if (!isLevel20(this.player)) return 0;

        return 0.025 * (1 - Math.pow(Math.E, - this.level / 2500)) 
            + 0.025 * Math.min(250, this.level) / 250
            + 0.025 * (1 - Math.pow(Math.E, - this.permLevel / 4000))
            + 0.025 * Math.min(500, this.level) / 500
    }

    displayEffect(): string {
        return `+${format(100 * this.talentEffect(), 3)}% chance of CRITICAL TICK`
    }
}

export class TalentProgressSpeed extends Talent {
    idHTML = 'ProgressSpeed'
    constructor(level: number, cost: number, 
        investedFragments: number, permLevel: number, 
        currEXP: number, player: Player) {
        super(level, cost, investedFragments, permLevel, currEXP, player);
        this.updateHTML('Initialize');
    }

    calculateEXPGain(dt: number): number {
        // Based on PPS (progress per second)
        let expGain = Math.log10(1 + dt)
        expGain *= (this.player.barLevel / 10 - 1)
        expGain *= this.globalTalentEXPMultipliers();
        return expGain
    }

    talentEffect(): number {
        if (!isLevel20) return 0;

        return (1 + this.level / 25) * (1 + this.permLevel / 50)
    }

    displayEffect(): string {
        return `Progress Speed +${format(100 * (this.talentEffect() - 1), 2)}%`
    }


}

export class TalentCoinGain extends Talent {
    idHTML = 'CoinGain'

    constructor(level: number, cost: number, 
        investedFragments: number, permLevel: number, 
        currEXP: number, player: Player) {
        super(level, cost, investedFragments, permLevel, currEXP, player);
        this.updateHTML('Initialize');
    }

    calculateEXPGain(coin: number): number {
        // Based on coin gains
        let expGain = 10 + Math.floor(Math.pow(coin, 2) / 100 + 3 * coin);
        expGain *= this.globalTalentEXPMultipliers();
        return expGain;
    }

    talentEffect(): number {
        if (!isLevel20) return 0;

        // Max +50% coins from the progress bar
        return Math.min(0.4, this.level / 1000 ) + 
        Math.min(0.4, this.permLevel / 2000) + 
        0.2 * (this.level * 25 + this.permLevel) / (2500 + this.level * 25 + this.permLevel) +
        1 * (this.level * 25 + this.permLevel) / (50000 + this.level * 25 + this.permLevel)
    }

    displayEffect(): string {
        return `Progress bar grants +${format(100 * this.talentEffect(), 2)}% coins!`
    }
}