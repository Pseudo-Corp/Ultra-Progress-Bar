import { format } from '../../../../Utilities/Format';
import { timer } from '../../../../Utilities/HelperFunctions';
import { updateElementById } from '../../../../Utilities/Render';
import { testFighter } from '../../Player/Fighter';
import { combatStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class DefenseiveEnemy extends Enemy {
    enemyType:EnemyTypes = 'Defensive'

    constructor(stats: combatStats, attackRate: number) {
        super(stats, attackRate);
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {

        const RNG = Math.random();

        if ((RNG < 0.1 || (RNG < 0.25 && this.currStats.HP / this.baseStats.HP < 0.25)) && this.currStats.MP >= 2) {
            this.currStats.MP -= 2;
            this.heal();
            this.updateHTML('Damage');
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                { textContent: 'HEAL' }
            )
        } else if (RNG < 0.375 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability')
            updateElementById(
                'enemyMove',
                { textContent: 'DoubleHit' }
            )
            await this.doubleHit();
        } else if (RNG < 0.625 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                { textContent: 'DefenseUP' }
            )
            await this.defenseUp();
            this.updateHTML('StatChange')
        } else {
            updateElementById(
                'enemyMove',
                { textContent: 'Attack' }
            )
            await this.attack();
        }
    }

    heal(): void {
        this.currStats.HP += this.baseStats.HP * (0.3 + 0.4 * this.level / 99)
        this.currStats.HP = Math.min(this.currStats.HP, this.baseStats.HP)
    }

    async defenseUp(): Promise<void> {
        this.currStats.DEF += 0.01 * this.currStats.DEF + 1;
        this.currStats.DEF = Math.floor(this.currStats.DEF);
    }

    async attack(): Promise<void> {
        const damageSent = this.computeBaseDamageSent();
        await testFighter.takeDamage(damageSent);
    }

    async doubleHit(): Promise<void> {
        for (let i = 0; i < 2; i++) {
            await this.attack();
            await timer(333);
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