import { ZoneHandler } from './Combat/Zones/ZoneHandler'

export class Globals {
    static zoneHandler: ZoneHandler

    public static setGlobalZoneHandler (zoneHandler: ZoneHandler): void {
        Globals.zoneHandler = zoneHandler
    }

    public static getGlobalZoneHandler (): ZoneHandler | undefined {
        return Globals.zoneHandler
    }
}