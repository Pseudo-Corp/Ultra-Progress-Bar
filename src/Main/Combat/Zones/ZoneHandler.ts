import { Player } from '../../../types/player'
import { updateElementById } from '../../../Utilities/Render'
import { Zone } from './Zone'
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
    private player: Player
    constructor (player: Player) {
        this.zone = this.createNewZone('Safety Zone') // initiates initial spawn as well
        this.zoneIndex = 0
        this.player = player
        this.updateHTML()
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
                return new SafetyZone(this.player, 1000)

            case 'The Meadow':
                return new MeadowZone(this.player, 5000)

            case 'The Forest':
                return new ForestZone(this.player, 4900)

            case 'The Underbrushes':
                return new UnderbrushZone(this.player, 4800)

            case 'The Cave':
                return new CaveZone(this.player, 4700)

            default:
                return new SafetyZone(this.player, 1000)
        }
    }

    public async takeDamage(baseAmount: number): Promise<void> {
        void this.zone.takeDamage(baseAmount)
    }

    public updateHTML() {
        updateElementById(
            'zone-name',
            {
                textContent: zoneOrder[this.zoneIndex]
            }
        )
    }

    get checkMoveUse() {
        return this.zone.checkMoveUse
    }
    get generateAttacks() {
        return this.zone.generateAttacks
    }
    get currStats() {
        return this.zone.currStats
    }


}