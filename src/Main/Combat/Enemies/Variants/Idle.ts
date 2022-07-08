import { Player } from '../../../../types/player'
import { format } from '../../../../Utilities/Format'
import { updateElementById } from '../../../../Utilities/Render'
import { enemyStats } from '../../Stats/Stats'
import { combatHTMLReasons } from '../../types'
import { Enemy, EnemyTypes } from '../Enemy'

export class IdleEnemy extends Enemy {
    enemyType:EnemyTypes = 'Idle'

    constructor(stats: enemyStats, attackRate: number, player: Player) {
        super(stats, attackRate, player)
        this.variantSpecificHTML('Initialize')
    }

    async enemyAI(): Promise<void> {
        await this.doNothing()
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