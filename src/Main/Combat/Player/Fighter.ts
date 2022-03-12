// TESTING! March 11, 2022

// do NOT attach this to the player variable until the combat system is (mostly) implemented!

import { format } from '../../../Utilities/Format';
import { timer } from '../../../Utilities/HelperFunctions';
import { updateElementById, updateStyleById } from '../../../Utilities/Render';
import { spawnEnemy, testEnemy } from '../Enemies/SpawnEnemy';
import { combatStats } from '../Stats/Stats';
import { combatHTMLReasons } from '../types';

const testFighterStats:combatStats = {
    HP: 120,
    MP: 10,
    ATK: 15,
    STR: 0,
    DEF: 15,
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

    async decreaseDelay(dt: number): Promise<void> {
        this.delay -= dt

        if (autoFight && this.delay < 0) {
            await this.attack();
        }
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

    async takeDamage(baseAmount: number): Promise<void> {
        const damageTaken = this.computeActualDamageReceived(baseAmount)

        this.currStats.HP -= damageTaken;
        this.currStats.HP = Math.max(0, this.currStats.HP);
        this.updateHTML('Damage')

        if (this.currStats.HP === 0) {
            // Reset Player Statistical
            await timer(1000);
            this.currStats = {...this.baseStats};
            this.delay = this.attackRate;
            this.updateHTML('Initialize');
            spawnEnemy();
        }
    }

    computeStrengthModifier(): number {
        const strengthEffect = this.currStats.STR
        return (1 + strengthEffect / 100)
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

    async attack(): Promise<void> {
        if (this.delay > 0 || this.currStats.HP === 0) {
            return
        }

        const damageSent = this.computeBaseDamageSent();
        await testEnemy.takeDamage(damageSent);

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

export const testFighter = new PlayerFighter(testFighterStats, 0.666)
export let autoFight = false

export const toggleAuto = () => {

    autoFight = !autoFight;
    updateElementById(
        'autoAttack',
        {textContent: `Auto Fight: ${autoFight}`}
    )
}