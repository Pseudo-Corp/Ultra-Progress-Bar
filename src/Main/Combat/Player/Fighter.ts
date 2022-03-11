// TESTING! March 11, 2022

// do NOT attach this to the player variable until the combat system is (mostly) implemented!

import { format } from '../../../Utilities/Format';
import { updateElementById, updateStyleById } from '../../../Utilities/Render';
import { testEnemy } from '../Enemies/Variants/Aggressive';
import { combatStats } from '../Stats/Stats';
import { combatHTMLReasons } from '../types';

const testFighterStats:combatStats = {
    HP: 80,
    MP: 10,
    ATK: 5,
    STR: 0,
    DEF: 0,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export class PlayerFighter {
    baseStats: combatStats
    currStats: combatStats
    attackRate: number
    delay: number

    constructor(stats: combatStats, attackRate: number) {
        this.baseStats = {...stats}
        this.currStats = {...stats}
        this.attackRate = attackRate
        this.delay = 0

        this.updateHTML('Initialize')
    }

    decreaseDelay(dt: number): void {
        this.delay -= dt
    }

    computeArmorDamageReduction(): number {
        return this.currStats.ARMOR
    }

    computeDefenseDamageDivisor(): number {
        const defenseEffect = this.baseStats.DEF
        return (1 + defenseEffect / 100)
    }

    computeActualDamageReceived(baseAmount: number): number {
        const armorReduce = this.computeArmorDamageReduction();
        const defenseDivide = this.computeDefenseDamageDivisor();

        return Math.max(0, (baseAmount - armorReduce / defenseDivide))
    }

    takeDamage(baseAmount: number): void {
        const damageTaken = this.computeActualDamageReceived(baseAmount)

        this.currStats.HP -= damageTaken

        if (this.currStats.HP < 0) {
            // Reset Player Statistical
            this.currStats = {...this.baseStats}
        }

        // Update HTML
        this.updateHTML('Damage')
    }

    computeStrengthModifier(): number {
        const strengthEffect = this.currStats.STR
        return (1 + strengthEffect * (1 - this.currStats.HP / this.currStats.HP) / 100)
    }

    computeDamageBase(): number {
        return (1 + this.currStats.ATK)
    }

    computeCriticalDamage(): number {
        return (this.currStats.CRITDAMAGE / 100)
    }

    computeBaseDamageSent(): number {
        const damageBase = this.computeDamageBase();
        const strengthMod = this.computeStrengthModifier();
        let critMultiplier = 1
        const critRandom = Math.random();
        if (critRandom < this.currStats.CRITCHANCE) {
            critMultiplier = this.computeCriticalDamage();
        }
        return damageBase * strengthMod * critMultiplier
    }

    attack(): void {
        if (this.delay > 0) {
            return
        }

        const damageSent = this.computeBaseDamageSent();
        testEnemy.takeDamage(damageSent);

        this.delay = this.attackRate;
    }

    computeHPBarWidth(): number {
        return 100 * (this.currStats.HP / this.baseStats.HP)
    }

    computeMPBarWidth(): number {
        return 100 * (this.currStats.MP / this.baseStats.MP)
    }

    updateHTML(reason: combatHTMLReasons):void {
        if (reason === 'Initialize') {

            updateElementById(
                'playerATK',
                { textContent: `ATK ${this.baseStats.ATK}`}
            )
            updateElementById(
                'playerSTR',
                { textContent: `STR ${this.baseStats.STR}`}
            )
            updateElementById(
                'playerDEF',
                { textContent: `DEF ${this.baseStats.DEF}`}
            )
            updateElementById(
                'playerARMOR',
                { textContent: `ARMOR ${this.baseStats.ARMOR}`}
            )
            updateElementById(
                'playerCritChance',
                { textContent: `CritChance ${this.baseStats.CRITCHANCE}`}
            )
            updateElementById(
                'playerCritDamage',
                { textContent: `CritDamage ${this.baseStats.CRITDAMAGE}`}
            )
        }

        if (reason === 'Initialize' || reason === 'Damage') {
            updateElementById(
                'playerHPText',
                { textContent: `${format(this.currStats.HP, 2)}/${format(this.baseStats.HP)}` }
            )

            const HPWidth = this.computeHPBarWidth();
            updateStyleById(
                'playerHPProgression',
                { width: `${HPWidth}%`}
            )
        }

        if (reason === 'Initialize' || reason === 'Ability') {
            updateElementById(
                'playerMPText',
                { textContent: `${format(this.currStats.MP, 2)}/${format(this.baseStats.MP)}`}
            )

            const MPWidth = this.computeMPBarWidth();
            updateStyleById(
                'playerMPProgression',
                { width: `${MPWidth}%`}
            )
        }
    }

}

export const testFighter = new PlayerFighter(testFighterStats, 1)
