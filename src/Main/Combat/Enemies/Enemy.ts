import { Player } from '../../../types/player'
import { format } from '../../../Utilities/Format'
import { timer } from '../../../Utilities/HelperFunctions'
import { updateElementById, updateStyleById } from '../../../Utilities/Render'
import { incrementMainBarEXP } from '../../ProgressBar/Properties'
import { enemyStats } from '../Stats/Stats'
import { combatHTMLReasons } from '../types'
import { spawnEnemy } from './SpawnEnemy'


export type EnemyTypes = 'Idle' | 'Random' | 'Aggressive' | 'Healer' | 'Defensive' | 'BOSS' | 'Null'
/*
March 11, 2022 Draft

Enemies should inherit, as the following stats:
    HP (CURR HP)
    MP (CURR MP)
    ATK (CURR ATK)
    STR
    DEF (CURR DEF)
    ARMOR (abbreviate)
    CRIT CHANCE
    CRIT DAMAGE
    Reward

This file will define the main enemy class, and then the variants will detail specific AI instances of the enemies.
*/
export abstract class Enemy {
    baseStats: enemyStats
    currStats: enemyStats
    attackRate: number
    delay: number
    level: number
    player: Player
    abstract enemyType: EnemyTypes

    constructor(stats: enemyStats, attackRate: number, player: Player) {
        this.baseStats = {...stats}
        this.currStats = {...stats}
        this.player = player
        this.attackRate = attackRate
        this.delay = this.attackRate
        this.level = this.computeGeneratedLevel();

        this.updateHTML('Initialize')
    }

    async generateAttacks(dt: number): Promise<void> {
        if (await this.checkMoveUse()) {
            this.delay -= dt
            if (this.delay < 0) {
                this.makeMove();
                this.delay = this.attackRate
            }
        }
    }

    computeGeneratedLevel(): number {
        let baseLevel = 1

        baseLevel += Math.min(25, 3 * Math.log10(1 + this.baseStats.HP))
        baseLevel += Math.min(25, 3 * Math.log10(1 + this.baseStats.ATK))
        baseLevel += Math.min(25, 3 * Math.log10(1 + this.baseStats.DEF))
        baseLevel += Math.min(10, this.baseStats.CRITCHANCE / 10)
        baseLevel += Math.min(13, 4 * Math.log10(this.baseStats.CRITDAMAGE / 100))

        return baseLevel
    }

    computeArmorDamageReduction(): number {
        const armorEffect = this.currStats.ARMOR
        return armorEffect * (this.currStats.HP / this.baseStats.HP)
    }

    computeDefenseDamageDivisor(): number {
        const defenseEffect = this.currStats.DEF
        return (1 + defenseEffect / 100)
    }

    computeActualDamageReceived(baseAmount: number): number {
        const armorReduce = this.computeArmorDamageReduction();
        const defenseDivide = this.computeDefenseDamageDivisor();

        if (this.baseStats.INVINCIBLE) {
            return 0
        }

        return Math.max(0, (baseAmount - armorReduce / defenseDivide))
    }

    async takeDamage(baseAmount: number): Promise<void> {
        if (this.currStats.HP === 0) return;
        const damageTaken = this.computeActualDamageReceived(baseAmount)

        this.currStats.HP -= damageTaken
        this.currStats.HP = Math.max(0, this.currStats.HP)
        this.updateHTML('Damage')

        if (this.currStats.HP === 0) {
            // Spawn a new enemy after 1 second
            incrementMainBarEXP(this.baseStats.REWARD, this.player, this.baseStats.CRITICAL)
            await timer(4000);
            spawnEnemy(this.player);
        }
    }

    computeStrengthModifier(): number {
        const strengthEffect = this.currStats.STR
        return (1 + strengthEffect * (1 - this.currStats.HP / this.baseStats.HP) / 100)
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

    computeHPBarWidth(): number {
        return 100 * (this.currStats.HP / this.baseStats.HP)
    }

    computeMPBarWidth(): number {
        return 100 * (this.currStats.MP / this.baseStats.MP)
    }

    makeMove(): void {
        this.enemyAI();
    }

    updateHTML(reason: combatHTMLReasons): void {
        if (reason === 'Initialize' || reason == 'StatChange') {
            updateElementById(
                'enemyATK',
                { textContent: `ATK ${this.currStats.ATK}`}
            )
            updateElementById(
                'enemySTR',
                { textContent: `STR ${this.currStats.STR}`}
            )
            updateElementById(
                'enemyDEF',
                { textContent: `DEF ${this.currStats.DEF}`}
            )
            updateElementById(
                'enemyARMOR',
                { textContent: `ARMOR ${this.currStats.ARMOR}`}
            )
            updateElementById(
                'enemyCritChance',
                { textContent: `CritChance ${this.currStats.CRITCHANCE}`}
            )
            updateElementById(
                'enemyCritDamage',
                { textContent: `CritDamage ${this.currStats.CRITDAMAGE}`}
            )
        }

        if (reason === 'Initialize' || reason === 'Damage') {
            updateElementById(
                'enemyHPText',
                { textContent: `${format(this.currStats.HP, 2)}/${format(this.baseStats.HP)}` }
            )

            const HPWidth = this.computeHPBarWidth();
            updateStyleById(
                'enemyHPProgression',
                { width: `${HPWidth}%`}
            )
        }

        if (reason === 'Initialize' || reason === 'Ability') {
            updateElementById(
                'enemyMPText',
                { textContent: `${format(this.currStats.MP, 2)}/${format(this.baseStats.MP)}`}
            )

            const MPWidth = this.computeMPBarWidth();
            updateStyleById(
                'enemyMPProgression',
                { width: `${MPWidth}%`}
            )
        }
    }

    async multiAttack(attacks: number): Promise<void> {
        updateElementById(
            'enemyMove',
            { textContent: `${format(attacks)}Hit` }
        );
        for (let i = 0; i < attacks; i++) {
            void this.attack(true);
            if (!await this.checkMoveUse()) break
            await timer(this.attackRate / Math.min(4, (1 + attacks)) * 1000);
        }
    }

    async attack(multiHit = false): Promise<void> {
        const damageSent = this.computeBaseDamageSent();
        void this.player.fighter.takeDamage(damageSent);

        if (!multiHit) {
            updateElementById(
                'enemyMove',
                { textContent: 'Attack' }
            )
        }
    }

    async doNothing(): Promise<void> {
        updateElementById(
            'enemyMove',
            { textContent: 'Nothing' }
        )
    }

    async heal(): Promise<void> {
        this.currStats.HP += this.baseStats.HP * (0.5 + 0.5 * this.level / 99)
        this.currStats.HP = Math.min(this.currStats.HP, this.baseStats.HP)
        updateElementById(
            'enemyMove',
            { textContent: 'Heal' }
        )
        this.updateHTML('Damage');
    }

    async checkMoveUse(): Promise<boolean> {
        return (this.player.fighter.currStats.HP > 0 && this.currStats.HP > 0)
    }

    abstract variantSpecificHTML(reason: combatHTMLReasons): void

    abstract enemyAI(): void

}