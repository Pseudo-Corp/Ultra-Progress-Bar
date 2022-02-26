import { player } from "../../../Game";
import { format } from "../../../Utilities/Format";
import { updateElementById } from "../../../Utilities/Render";
import { Upgrade } from "../Upgrades";

export abstract class CoinUpgrade extends Upgrade {
    
    constructor(level: number, cost: number) {
        super(level, cost)
        this.updateHTML();
    }
    purchaseLevels(amount: number, event: MouseEvent){
        if (event.shiftKey)
            amount = -1 //BUYMAX

        if (amount === -1) {
            amount = Math.floor(player.coins.amount / this.cost);
        }
        
        if (this.cost * amount <= player.coins.amount) {
            player.coins.spend(this.cost * amount)
            this.level += amount;
            this.updateHTML();
        }
    }

    abstract upgradeEffect():number

    abstract updateHTML():void

}

export const coinUpgradeCosts = {
    barSpeed: 1,
    barMomentum: 10,
    barReverberation: 25,
    barVibration: 50
}

export class CoinBarSpeed extends CoinUpgrade {
    /**
     * 
     * @returns Bar Speed to add on top of the base amount. Additive!
     */
    upgradeEffect(): number {
        return this.level / 5
    }

    updateHTML(): void {
        updateElementById(
            "coin-bar-speed-effect",
            {
                textContent: `+${format(this.upgradeEffect(), 2)} Progress Per Second`
            }
        );
    }
}

export class CoinBarMomentum extends CoinUpgrade {
    upgradeEffect(): number {
        return (1 - Math.pow(Math.E, -this.level/400))
    }

    updateHTML(): void {
        updateElementById(
            "coin-bar-momentum-effect",
            {
                textContent: `Up to ${format(Math.pow(1 + this.upgradeEffect(), 10), 2)}x Progress Speed based on fill%`,
            }
        );
    }
}

export class CoinBarReverberation extends CoinUpgrade {
    upgradeEffect(): number {
        return (1 - Math.pow(Math.E, -this.level / 200))
    }

    updateHTML(): void {
        updateElementById(
            "coin-bar-reverberation-effect",
            {
                textContent: `+${format(100 * this.upgradeEffect(), 2)}% chance to have a CRITICAL TICK`
            }
        )
    }
}

export class CoinBarVibration extends CoinUpgrade {
    upgradeEffect(): number {
        return 10 + 90 * (1 - Math.pow(Math.E, -this.level / 250))
    }

    updateHTML(): void {
        updateElementById(
            "coin-bar-vibration-effect",
            {
                textContent: `CRITICAL TICKS fill up the bar ${format(this.upgradeEffect(), 2)}x faster`
            }
        )
    }
}