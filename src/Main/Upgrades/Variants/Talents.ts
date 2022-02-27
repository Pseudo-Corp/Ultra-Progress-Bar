import { FPS, minimumRefreshCounter, player } from '../../../Game'
import { format } from '../../../Utilities/Format'
import { computePolyCost } from '../../../Utilities/HelperFunctions'
import { updateElementById, updateStyleById } from '../../../Utilities/Render'
import { reset } from '../../Reset/Refresh'
import { Upgrade } from '../Upgrades'

export const isLevel20 = () => {
    return (player.barLevel >= 20)
}

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
                currEXP: number) {
        super(level, cost)
        this.investedFragments = investedFragments;
        this.permLevel = permLevel;
        this.currEXP = currEXP
        this.currTNL = this.calculateTNL();
    }

    calculateTNL(): number {
        return computePolyCost(this.cost, this.level, this.level + 1, 2);
    }

    setEXP(amount: number): void {
        this.currEXP = amount
        this.updateHTML('GainEXP')
    }

    gainEXP(dt?: number): void {
        if (!isLevel20())
            return

        const amount = this.calculateEXPGain(dt);
        this.currEXP += amount
        if (this.currEXP >= this.currTNL) {
            this.levelUp();
        }
        this.updateHTML('GainEXP');
    }

    levelUp(): void {
        this.level += 1
        this.setEXP(0)
        this.currTNL = this.calculateTNL();
        this.updateHTML('LevelUp')
    }

    computePermLevelGain(level: number): number {
        if (player !== undefined) {
            let levelsToGain = 0
            levelsToGain += Math.sqrt(level);
            levelsToGain *= Math.min(4, Math.pow(player.refreshTime / 300, 2))
            levelsToGain = Math.min(level, levelsToGain)
            return Math.floor(levelsToGain)
        }
        else
            return 0
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

    sacrificeFragments(): void {
        if (player !== undefined) {
            if (player.barFragments.amount < 1000)
                return alert('You cannot sacrifice your bar fragments until you have at least 1,000 of them.')
            if (player.barFragments.amount <= this.investedFragments)
                return alert(`This bar needs more fragments than you can invest. You need ${format(this.investedFragments)}.`)

            else {
                const confirmation = confirm(`You will sacrifice ${format(player.barFragments.amount - this.investedFragments)} Bar Fragments to increase EXP gain for this bar. Will you? (automatically performs a refresh, setting your fragments to 0)`)
                if (confirmation) {
                    this.investedFragments = player.barFragments.amount
                    player.refreshTime += minimumRefreshCounter;
                    reset('Refresh');
                    player.barFragments.set(0);
                }
            }
        }
    }

    updateHTML(reason: TalentHTMLType): void {
        if (this.idHTML === undefined) {return}
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

    abstract displayEffect(): string
    abstract calculateEXPGain(dt?: number): number
    abstract talentEffect(): number
}

export const talentBaseEXP = {
    talentCriticalChance: 10,
    talentProgressSpeed: 10
}

export class TalentCriticalChance extends Talent {
    idHTML = 'CriticalChance'
    constructor(level: number, cost: number, 
        investedFragments: number, permLevel: number, 
        currEXP: number) {
        super(level, cost, investedFragments, permLevel, currEXP);
        this.updateHTML('Initialize');
    }

    calculateEXPGain(dt: number): number {
        // Critical Hit by default adds 1 EXP
        let expGain = 1
        // Adjust EXP based on tick rate relative to base FPS of 24
        expGain *= (dt * 1000 / FPS)
        if (player !== undefined)
            expGain *= (player.barLevel / 10 - 1) // Is 1 at level 20
        expGain *= (1 + 1/9 * Math.pow(Math.log2(1 + this.investedFragments / 125), 2))

        return expGain
    }

    talentEffect(): number {
        if (player !== undefined) {
            if (!isLevel20())
                return 0
            return 0.025 * (1 - Math.pow(Math.E, - this.level / 2500)) 
                + 0.025 * Math.min(250, this.level) / 250
                + 0.025 * (1 - Math.pow(Math.E, - this.permLevel / 4000))
                + 0.025 * Math.min(500, this.level) / 500
        }
        else
            return 0
    }

    displayEffect(): string {
        return `+${format(100 * this.talentEffect(), 3)}% chance of CRITICAL TICK`
    }
}

export class TalentProgressSpeed extends Talent {
    idHTML = 'ProgressSpeed'
    constructor(level: number, cost: number, 
        investedFragments: number, permLevel: number, 
        currEXP: number) {
        super(level, cost, investedFragments, permLevel, currEXP);
        this.updateHTML('Initialize');
    }

    calculateEXPGain(dt: number): number {
        // Based on PPS (progress per second)
        let expGain = Math.log10(1 + dt)
        if (player !== undefined)
            expGain *= (player.barLevel / 10 - 1)
        expGain *= (1 + 1/9 * Math.pow(Math.log2(1 + this.investedFragments / 125), 2))
        return expGain
    }

    talentEffect(): number {
        if (player !== undefined) {
            if (!isLevel20)
                return 0 
            return (1 + this.level / 25) * (1 + this.permLevel / 50)
        }
        else
            return 0
    }

    displayEffect(): string {
        return `Progress Speed +${format(100 * (this.talentEffect() - 1), 2)}%`
    }


}