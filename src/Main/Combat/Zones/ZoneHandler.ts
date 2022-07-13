import { timer } from '../../../Utilities/HelperFunctions'
import { CaveZone } from './ZoneData/Cave'
import { ForestZone } from './ZoneData/Forest'
import { MeadowZone } from './ZoneData/Meadow'
import { SafetyZone } from './ZoneData/Safety'
import { UnderbrushZone } from './ZoneData/Underbrushes'

export type Zones = 'Safety Zone' | 'The Meadow' | 'The Forest' | 'The Underbrushes' | 'The Cave'
export const zoneOrder: Zones[] = ['Safety Zone', 'The Meadow', 'The Forest', 'The Underbrushes', 'The Cave']

export class ZoneHandler {
    public zoneIndex: number
    private zone: Zone
    constructor () {
        this.zone = this.createNewZone('Safety Zone')
        this.zoneIndex = 0

        this.zoneSpawn() // Remove once implemented
    }

    public switchZone(opposite = false) {
        const zoneTracker = this.zoneIndex
        if (opposite) {
            this.zoneIndex = Math.max(0, this.zoneIndex - 1)
        } else {
            this.zoneIndex = Math.min(zoneOrder.length - 1, this.zoneIndex + 1)
        }

        if (this.zoneIndex !== zoneTracker) { // Reduce unnecessary switches
            this.zone = this.createNewZone(zoneOrder[this.zoneIndex])
        }
    }

    public createNewZone(zone: Zones): Zone {
        switch (zone) {
            case 'Safety Zone':
                return new SafetyZone()

            case 'The Meadow':
                return new MeadowZone()

            case 'The Forest':
                return new ForestZone()

            case 'The Underbrushes':
                return new UnderbrushZone()

            case 'The Cave':
                return new CaveZone()

            default:
                return new SafetyZone()
        }
    }

    private zoneSpawn() {
        void this.zone.spawnInitialEnemy() // This will be replaced with the spawning of an actual enemy
    }
}

export class Zone {

    constructor(/*private enemyDistribution: (x: number) => boolean, */) {
        /* this.enemyDistribution = enemyDistribution */
        void this.spawnInitialEnemy()
    }

    public async spawnInitialEnemy() {
        await timer(5000)
        // Implement Mechanics here
    }

}