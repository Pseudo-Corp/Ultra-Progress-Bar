import { format } from '../../../../Utilities/Format';
import { updateElementById } from '../../../../Utilities/Render';
import { combatStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class AggressiveEnemy extends Enemy {
    enemyType:EnemyTypes = 'Aggressive'

    constructor(stats: combatStats, attackRate: number) {
        super(stats, attackRate);
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {

        const RNG = Math.random();

        if (RNG < 0.25 && this.currStats.HP / this.baseStats.HP < 0.22 && this.currStats.MP >= 2) {
            await this.heal();
            this.currStats.MP -= 2;
            this.updateHTML('Damage');
            this.updateHTML('Ability');
        } else if (RNG < 0.33 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability')
            await this.multiAttack(2);
        } else if (RNG < 0.5 && this.currStats.MP >= 2) {
            this.currStats.MP -= 2;
            this.updateHTML('Ability')
            await this.multiAttack(5);
        } else {
            await this.attack();
        }
    }

    variantSpecificHTML(reason: combatHTMLReasons): void {
        if (reason === 'Initialize') {
            updateElementById(
                'enemyName',
                { textContent: `${this.enemyType} Testing Dummy Lv${format(this.level)}` }
            )
        }
    }

}