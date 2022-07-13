import { Player } from '../../../types/player'
import { timer } from '../../../Utilities/HelperFunctions'
import { updateStyleById } from '../../../Utilities/Render'
import { Enemy } from '../Enemies/Enemy'
import { testNullStats } from '../Enemies/SpawnEnemy'
import { NullEnemy } from '../Enemies/Variants/Null'

export type ZoneHTMLReasons = 'Spawn' | 'Death' | 'Initialize'
export class Zone {

    public enemy: Enemy
    public spawnRate: number
    public player: Player
    constructor(/*private enemyDistribution: (x: number) => boolean, */player: Player, spawnRate: number) {
        this.player = player
        this.enemy = new NullEnemy(testNullStats, 10000, this.player)
        this.spawnRate = spawnRate
        void this.spawnInitialEnemy()
        this.updateHTML('Initialize')
    }

    public async spawnInitialEnemy() {
        await timer(5000)
        // Implement Mechanics here
    }

    public async spawnEnemy() {
        await timer(this.spawnRate)

        /* Implement! */
        this.updateHTML('Spawn')
    }

    public async takeDamage(baseAmount: number): Promise<void> {
        void this.enemy.takeDamage(baseAmount)
        if (this.isEnemyDead()) {
            this.updateHTML('Death')
            void this.spawnEnemy()
        }
    }

    public isEnemyDead(): boolean {
        return this.enemy.isEnemyDead()
    }

    public updateHTML(reason: ZoneHTMLReasons) {
        updateStyleById(
            'enemyCorner',
            {
                visibility: (reason === 'Initialize' || reason === 'Death')? 'hidden': 'visible'
            }
        )
    }

    get checkMoveUse() {
        return this.enemy.checkMoveUse
    }
    get generateAttacks() {
        return this.enemy.generateAttacks
    }
    get currStats() {
        return this.enemy.currStats
    }
}