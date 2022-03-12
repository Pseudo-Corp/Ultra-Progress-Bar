import { format } from '../../../../Utilities/Format';
import { timer } from '../../../../Utilities/HelperFunctions';
import { updateElementById } from '../../../../Utilities/Render';
import { testFighter } from '../../Player/Fighter';
import { combatStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class BossEnemy extends Enemy {
    enemyType:EnemyTypes = 'BOSS'
    usedRage: boolean
    usedEmpowerment: boolean
    firstAttack: boolean

    constructor(stats: combatStats, attackRate: number) {
        super(stats, attackRate);
        this.firstAttack = true;
        this.usedRage = false;
        this.usedEmpowerment = false;
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {

        const RNG = Math.random();

        if (this.firstAttack) {
            this.empower();
            this.updateHTML('StatChange');
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                {textContent: 'EMPOWER'}
            )
            this.firstAttack = false;
            this.usedEmpowerment = true;
            return
        }

        if (!this.usedRage && this.currStats.HP / this.baseStats.HP < 0.5) {
            this.rage();
            this.updateHTML('StatChange');
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                {textContent: 'RAGE'}
            )
            this.usedRage = true;
            return
        }

        if ((RNG < 0.05 || (RNG < 0.3 && this.currStats.HP / this.baseStats.HP < 0.05)) && this.currStats.MP >= 2) {
            this.heal();
            this.currStats.MP -= 2;
            this.updateHTML('Damage');
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                { textContent: 'HEAL' }
            )
        } else if (RNG < 0.25 && this.currStats.MP >= 4) {
            this.currStats.MP -= 4;
            this.updateHTML('Ability')
            updateElementById(
                'enemyMove',
                { textContent: 'QuadrupleHit' }
            )
            await this.quadrupleHit();
        } else {
            updateElementById(
                'enemyMove',
                { textContent: 'Attack' }
            )
            await this.attack();
        }
    }

    empower(): void {
        this.currStats.ATK = Math.floor(1.3 * this.currStats.ATK + 2)
        this.currStats.STR = Math.floor(1.5 * this.currStats.STR + 2)
        this.currStats.CRITCHANCE += 25
        this.currStats.CRITDAMAGE = Math.floor(1.4 * this.currStats.CRITDAMAGE)
    }

    rage(): void {
        this.currStats.ATK = Math.floor(1.5 * this.currStats.ATK)
        this.currStats.STR = Math.floor(1.8 * this.currStats.STR)
        this.currStats.CRITCHANCE += 75
        this.currStats.CRITDAMAGE = Math.floor(1.5 * this.currStats.CRITDAMAGE)
        this.currStats.HP = this.baseStats.HP * (0.75 + 0.25 * this.level/99)
    }

    heal(): void {
        this.currStats.HP += this.baseStats.HP * (0.3 + 0.4 * this.level / 99)
        this.currStats.HP = Math.min(this.currStats.HP, this.baseStats.HP)
    }

    async attack(): Promise<void> {
        const damageSent = this.computeBaseDamageSent();
        await testFighter.takeDamage(damageSent);
    }

    async quadrupleHit(): Promise<void> {
        for (let i = 0; i < 2; i++) {
            await this.attack();
            await timer(200);
        }
    }

    variantSpecificHTML(reason: combatHTMLReasons): void {
        if (reason === 'Initialize') {
            updateElementById(
                'enemyName',
                { textContent: `${this.enemyType} Training Dummy Lv${format(this.level)}` }
            )
        }
    }

}