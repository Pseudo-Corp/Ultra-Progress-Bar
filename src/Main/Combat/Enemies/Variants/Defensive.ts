import { format } from '../../../../Utilities/Format';
import { updateElementById } from '../../../../Utilities/Render';
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
            await this.heal();
            this.updateHTML('Damage');
            this.updateHTML('Ability');
        } else if (RNG < 0.375 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability')
            await this.multiAttack(2);
        } else if (RNG < 0.625 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability');
            await this.defenseUp();
            this.updateHTML('StatChange')
        } else {
            await this.attack();
        }
    }

    async defenseUp(): Promise<void> {
        this.currStats.DEF += 0.01 * this.currStats.DEF + 1;
        this.currStats.DEF = Math.floor(this.currStats.DEF);
        updateElementById(
            'enemyMove',
            { textContent: 'DefenseUP' }
        )
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