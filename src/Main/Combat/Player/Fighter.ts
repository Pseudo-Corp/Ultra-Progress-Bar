// TESTING! March 11, 2022

// do NOT attach this to the player variable until the combat system is (mostly) implemented!

import { Player } from '../../../types/player';
import { format } from '../../../Utilities/Format';
import { timer } from '../../../Utilities/HelperFunctions';
import { updateElementById, updateStyleById } from '../../../Utilities/Render';
import { spawnEnemy, testEnemy } from '../Enemies/SpawnEnemy';
import { combatStats } from '../Stats/Stats';
import { combatHTMLReasons } from '../types';

export const baseFighterStats: combatStats = {
    HP: 150,
    MP: 25,
    ATK: 15,
    STR: 0,
    DEF: 15,
    ARMOR: 0,
    CRITCHANCE: 0,
    CRITDAMAGE: 100
}

export const baseAttackRate = 0.666

export class PlayerFighter {
    baseStats: combatStats
    currStats: combatStats
    attackRate: number
    delay: number
    player: Player

    constructor(stats: combatStats, attackRate: number, player: Player) {
        this.baseStats = {...stats}
        this.currStats = {...stats}
        this.attackRate = attackRate
        this.delay = attackRate
        this.player = player

        this.updateHTML('Initialize')
        spawnEnemy(this.player, true)
        void this.spawnInitialEnemy()
    }

    async spawnInitialEnemy(): Promise<void> {
        await timer(5000)
        spawnEnemy(this.player)
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
        if (this.currStats.HP === 0) return; // This is AWFUL, please fix this Future Platonic
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
            spawnEnemy(this.player);
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
        if (this.delay > 0 || this.currStats.HP === 0 || testEnemy.currStats.HP === 0) {
            return
        }

        const damageSent = this.computeBaseDamageSent();
        void testEnemy.takeDamage(damageSent);

        this.currStats.HP += this.baseStats.HP / 60 + damageSent / 40
        this.currStats.HP = Math.min(this.currStats.HP, this.baseStats.HP)
        this.updateHTML('Damage')

        this.delay = this.attackRate;
    }

    async enrage(): Promise<void> {
        if (this.delay > 0 || this.currStats.HP === 0 || this.currStats.MP < 10) {
            return
        }
        this.currStats.ATK = Math.floor(1.1 * this.currStats.ATK + 2)
        this.currStats.STR = Math.floor(1.1 * this.currStats.STR + 2)
        this.currStats.CRITCHANCE += 5
        this.currStats.CRITDAMAGE = Math.floor(1.2 * this.currStats.CRITDAMAGE)
        this.currStats.MP -= 10
        this.updateHTML('StatChange')
        this.updateHTML('Ability')
        this.delay = this.attackRate
    }

    computeHPBarWidth(): number {
        return 100 * (this.currStats.HP / this.baseStats.HP)
    }

    computeMPBarWidth(): number {
        return 100 * (this.currStats.MP / this.baseStats.MP)
    }

    updateHTML(reason: combatHTMLReasons):void {
        if (reason === 'Initialize' || reason === 'StatChange') {

            updateElementById(
                'playerATK',
                { textContent: `ATK ${this.currStats.ATK}`}
            )
            updateElementById(
                'playerSTR',
                { textContent: `STR ${this.currStats.STR}`}
            )
            updateElementById(
                'playerDEF',
                { textContent: `DEF ${this.currStats.DEF}`}
            )
            updateElementById(
                'playerARMOR',
                { textContent: `ARMOR ${this.currStats.ARMOR}`}
            )
            updateElementById(
                'playerCritChance',
                { textContent: `CritChance ${this.currStats.CRITCHANCE}`}
            )
            updateElementById(
                'playerCritDamage',
                { textContent: `CritDamage ${this.currStats.CRITDAMAGE}`}
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

    public valueof () {
        return {
            baseStats: this.baseStats,
            attackRate: this.attackRate
        }
    }
}

export let autoFight = false

export const toggleAuto = () => {

    autoFight = !autoFight;
    updateElementById(
        'autoAttack',
        {textContent: `Auto Fight: ${autoFight}`}
    )
}