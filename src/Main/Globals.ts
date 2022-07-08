import type { Enemy } from './Combat/Enemies/Enemy'

export class Globals {
    static testEnemy: Enemy

    public static setGlobalEnemy (newEnemy: Enemy): void {
        Globals.testEnemy = newEnemy
    }

    public static getGlobalEnemy (): Enemy | undefined {
        return Globals.testEnemy
    }
}