import { Player } from '../../../../types/player';
import { format } from '../../../../Utilities/Format';
import { updateElementById } from '../../../../Utilities/Render';
import { enemyStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class HealerEnemy extends Enemy {
    enemyType:EnemyTypes = 'Healer'

    constructor(stats: enemyStats, attackRate: number, player: Player) {
        super(stats, attackRate, player);
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {
        const RNG = Math.random();

        if ((RNG < 0.333 || (RNG < 0.5 && this.currStats.HP / this.baseStats.HP < 0.25)) && this.currStats.MP >= 2) {
            await this.heal();
            this.currStats.MP -= 2;
            this.updateHTML('Ability');
        } else if (RNG < 0.375 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability')
            await this.multiAttack(2);
        } else {
            await this.attack();
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