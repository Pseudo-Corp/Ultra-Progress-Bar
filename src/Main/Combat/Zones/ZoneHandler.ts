import { timer } from '../../../Utilities/HelperFunctions'

export type Zones = 'Safety Zone' | 'The Meadow' | 'The Forest' | 'The Underbrushes' | 'The Cave'
export const zoneOrder: Zones[] = ['Safety Zone', 'The Meadow', 'The Forest', 'The Underbrushes', 'The Cave']

const zoneCache = new Map<string, typeof Zone>()

export class ZoneHandler {
    public zoneIndex: number
    private zone: Zone | null = null

    constructor () {
        this.zoneIndex = 0

        this.zoneSpawn() // Remove once implemented
    }

    public async switchZone (opposite = false) {
        const zoneTracker = this.zoneIndex
        if (opposite) {
            this.zoneIndex = Math.max(0, this.zoneIndex - 1)
        } else {
            this.zoneIndex = Math.min(zoneOrder.length - 1, this.zoneIndex + 1)
        }

        if (this.zoneIndex !== zoneTracker) { // Reduce unnecessary switches
            this.zone = await this.createNewZone(zoneOrder[this.zoneIndex])
        }
    }

    public async createNewZone (zone: Zones) {
        const ctor = await this.fetch(zone)
        return new ctor()
    }

    async fetch (zoneFileName: Zones): Promise<typeof Zone> {
        const zoneCached = zoneCache.get(zoneFileName)

        if (zoneCached) {
            return zoneCached
        }

        let zoneImport: typeof Zone

        switch (zoneFileName) {
            default:
            case 'Safety Zone':
                zoneImport = (await import('./ZoneData/Safety')).SafetyZone
                break
            case 'The Meadow':
                zoneImport = (await import('./ZoneData/Meadow')).MeadowZone
                break
            case 'The Forest':
                zoneImport = (await import('./ZoneData/Forest')).ForestZone
                break
            case 'The Cave':
                zoneImport = (await import('./ZoneData/Cave')).CaveZone
                break
            case 'The Underbrushes':
                zoneImport = (await import('./ZoneData/Underbrush')).UnderbrushZone
                break
        }

        zoneCache.set(zoneFileName, zoneImport)
        return zoneImport
    }

    private zoneSpawn() {
        void this.zone?.spawnInitialEnemy() // This will be replaced with the spawning of an actual enemy
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