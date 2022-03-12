import { format } from '../../../../Utilities/Format';
import { timer } from '../../../../Utilities/HelperFunctions';
import { updateElementById } from '../../../../Utilities/Render';
import { testFighter } from '../../Player/Fighter';
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
            this.heal();
            this.currStats.MP -= 2;
            this.updateHTML('Damage');
            this.updateHTML('Ability');
            updateElementById(
                'enemyMove',
                { textContent: 'HEAL' }
            )
        } else if (RNG < 0.33 && this.currStats.MP >= 1) {
            this.currStats.MP -= 1;
            this.updateHTML('Ability')
            updateElementById(
                'enemyMove',
                { textContent: 'DoubleHit' }
            )
            await this.doubleHit();
        } else if (RNG < 0.5 && this.currStats.MP >= 2) {
            this.currStats.MP -= 2;
            this.updateHTML('Ability')
            updateElementById(
                'enemyMove',
                { textContent: 'TripleHit' }
            )
            await this.tripleHit();
        } else {
            updateElementById(
                'enemyMove',
                { textContent: 'Attack' }
            )
            await this.attack();
        }
    }

    heal(): void {
        this.currStats.HP += this.baseStats.HP * (0.3 + 0.5 * this.level / 99)
        this.currStats.HP = Math.min(this.currStats.HP, this.baseStats.HP)
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

    async tripleHit(): Promise<void> {
        for (let i = 0; i < 3; i++) {
            await this.attack();
            await timer(250);
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