import { format } from '../../../../Utilities/Format';
import { updateElementById } from '../../../../Utilities/Render';
import { combatStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class IdleEnemy extends Enemy {
    enemyType:EnemyTypes = 'Idle'

    constructor(stats: combatStats, attackRate: number) {
        super(stats, attackRate);
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {
        await this.doNothing();
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