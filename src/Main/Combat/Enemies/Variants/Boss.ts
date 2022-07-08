import { Player } from '../../../../types/player';
import { format } from '../../../../Utilities/Format';
import { updateElementById } from '../../../../Utilities/Render';
import { enemyStats } from '../../Stats/Stats';
import { combatHTMLReasons } from '../../types';
import { Enemy, EnemyTypes } from '../Enemy';

export class BossEnemy extends Enemy {
    enemyType:EnemyTypes = 'BOSS'
    usedRage: boolean
    usedEmpowerment: boolean
    firstAttack: boolean

    constructor(stats: enemyStats, attackRate: number, player: Player) {
        super(stats, attackRate, player);
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
            await this.heal();
            this.currStats.MP -= 2;
            this.updateHTML('Damage');
            this.updateHTML('Ability');
        } else if (RNG < 0.75 && this.currStats.MP >= 4) {
            this.currStats.MP -= 4;
            this.updateHTML('Ability')
            await this.multiAttack(3);
        } else {
            await this.attack();
        }
    }

    empower(): void {
        this.currStats.ATK = Math.floor(1.3 * this.currStats.ATK + 2)
        this.currStats.STR = Math.floor(1.5 * this.currStats.STR + 2)
        this.currStats.CRITCHANCE += 25
        this.currStats.CRITDAMAGE = Math.floor(1.4 * this.currStats.CRITDAMAGE)
        this.updateHTML('StatChange')
    }

    rage(): void {
        this.currStats.ATK = Math.floor(1.5 * this.currStats.ATK)
        this.currStats.STR = Math.floor(1.8 * this.currStats.STR)
        this.currStats.CRITCHANCE += 75
        this.currStats.CRITDAMAGE = Math.floor(1.5 * this.currStats.CRITDAMAGE)
        this.currStats.HP = this.baseStats.HP * (0.75 + 0.25 * this.level/99)

        this.updateHTML('Ability')
        this.updateHTML('Damage')
        this.updateHTML('StatChange')
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