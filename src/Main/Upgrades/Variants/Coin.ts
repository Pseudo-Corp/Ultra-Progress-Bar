import { Player } from '../../../types/player';
import { format } from '../../../Utilities/Format';
import { updateElementById, updateStyleById } from '../../../Utilities/Render';
import { Upgrade } from '../Upgrades';

export abstract class CoinUpgrade extends Upgrade {
    abstract maxLevel: number; // -1 = infinitys

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player)
        this.updateHTML();
    }

    capLevel(): void {
        if (this.maxLevel === -1) return;

        this.level = Math.min(this.maxLevel, this.level)
    }

    purchaseLevels(amount: number, event: MouseEvent){
        if (event.shiftKey) {
            amount = -1;
            amount = Math.floor(this.player.coins.amount / this.cost);
        }

        if (this.maxLevel !== -1) {
            amount = Math.min(amount, this.maxLevel - this.level)
        }

        if (this.cost * amount <= this.player.coins.amount) {
            this.player.coins.spend(this.cost * amount)
            this.level += amount;
            this.updateHTML();
        }
    }

    public override valueOf () {
        return { level: this.level, cost: this.cost, maxLevel: this.maxLevel };
    }

    abstract upgradeEffect():number

    abstract updateHTML():void

}

export const coinUpgradeCosts = {
    barSpeed: 1,
    barMomentum: 10,
    barReverberation: 25,
    barVibration: 50,
    barAgitation: 10000,
    barAdoption: 250,
    barEmpowerment: 10000,
    barReinforcement: 20000,
    barResonance: 2000
}

export class CoinBarSpeed extends CoinUpgrade {
    maxLevel = -1;
    /**
     *
     * @returns Bar Speed to add on top of the base amount. Additive!
     */
    upgradeEffect(): number {
        return 4 * this.level / 100 + 0.06 * Math.min(90, this.level)
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-speed-effect',
            {
                textContent: `+${format(this.upgradeEffect(), 2)} Progress Per Second`
            }
        );
        updateElementById(
            'coin-bar-speed-name',
            {
                textContent: `Bar Speed ${format(this.level)}`
            }
        )
    }
}

export class CoinBarMomentum extends CoinUpgrade {
    expoDivisor = 400
    maxLevel = Math.ceil(this.expoDivisor * Math.log(1000))

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.maxLevel = 100 * Math.round(this.maxLevel / 100);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        if (this.maxLevel === this.level) return (Math.pow(100, 1/10) - 1);

        return (0.45 * (1 - Math.pow(Math.E, -this.level/this.expoDivisor))
               + 1/200 * Math.min(10, this.level)) * ((Math.pow(100, 1/10) - 1) / 0.5)
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-momentum-effect',
            {
                textContent:
                    `Up to ${format(Math.pow(1 + this.upgradeEffect(), 10), 2)}x Progress Speed based on fill%`
            }
        );

        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-momentum-name',
                {
                    textContent: 'Bar Momentum [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-momentum-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-momentum-name',
                {
                    textContent: `Bar Momentum ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }
}

export class CoinBarReverberation extends CoinUpgrade {
    expoDivisor = 100
    maxLevel = Math.ceil(this.expoDivisor * Math.log(1000));

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.maxLevel = 100 * Math.round(this.maxLevel / 100);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        if (this.level === this.maxLevel) {
            return 0.01
        } else {
            return 0.009 * (1 - Math.pow(Math.E, -this.level / this.expoDivisor)) + 0.0002 * Math.min(5, this.level);
        }
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-reverberation-effect',
            {
                textContent: `+${format(100 * this.upgradeEffect(), 2)}% chance to have a CRITICAL TICK`
            }
        )
        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-reverberation-name',
                {
                    textContent: 'Bar Reverberation [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-reverberation-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-reverberation-name',
                {
                    textContent: `Bar Reverberation ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }
}

export class CoinBarVibration extends CoinUpgrade {
    expoDivisor = 170
    maxLevel = Math.ceil(this.expoDivisor * Math.log(1000))

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.maxLevel = 100 * Math.round(this.maxLevel / 100);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        if (this.level === this.maxLevel) {
            return 2000
        } else {
            return 100 + 1700 * (1 - Math.pow(Math.E, -this.level / this.expoDivisor)) + 20 * Math.min(10, this.level)
        }
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-vibration-effect',
            {
                textContent: `CRITICAL TICKS fill up the bar ${format(this.upgradeEffect(), 2)}x faster`
            }
        )
        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-vibration-name',
                {
                    textContent: 'Bar Vibration [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-vibration-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-vibration-name',
                {
                    textContent: `Bar Vibration ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }
}

export class CoinBarAgitation extends CoinUpgrade {
    maxLevel = -1

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.updateHTML();
    }

    upgradeEffect(): number {
        return this.level / 500
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-agitation-effect',
            {
                textContent: `+${format(100 * this.upgradeEffect(), 2)}% Bar Fragments per CRIT.`
            }
        )
        updateElementById(
            'coin-bar-agitation-name',
            {
                textContent: `Bar Agitation ${format(this.level)}`
            }
        )
    }
}

export class CoinBarAdoption extends CoinUpgrade {
    maxLevel = 200;

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        return this.level / 100
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-adoption-effect',
            {
                textContent: `+${format(100 * this.upgradeEffect())}% Talent EXP`
            }
        )
        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-adoption-name',
                {
                    textContent: 'Bar Adoption [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-adoption-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-adoption-name',
                {
                    textContent: `Bar Adoption ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }
}

export class CoinBarEmpowerment extends CoinUpgrade {
    maxLevel = 100

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        return 0.02 * this.level / 100
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-empowerment-effect',
            {
                textContent: `+${format(100 * this.upgradeEffect(), 2)}% Progress Speed per bar level: (1+x)^(level)`
            }
        )
        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-empowerment-name',
                {
                    textContent: 'Bar Empowerment [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-empowerment-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-empowerment-name',
                {
                    textContent: `Bar Empowerment ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }

}

export class CoinBarReinforcement extends CoinUpgrade {
    maxLevel = -1;

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.updateHTML();
    }

    upgradeEffect(): number {
        return this.level / 1000
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-reinforcement-effect',
            {
                textContent: `+${format(100 * this.upgradeEffect(), 2)}% Bar Fragments per bar level (1 + x * level)`
            }
        )
        updateElementById(
            'coin-bar-reinforcement-name',
            {
                textContent: `Bar Reinforcement ${format(this.level)}`
            }
        )
    }
}

export class CoinBarResonance extends CoinUpgrade {
    expoDivisor = 500
    maxLevel = Math.ceil(this.expoDivisor * Math.log(1000))

    constructor(level: number, cost: number, player: Player) {
        super(level, cost, player);
        this.maxLevel = 100 * Math.round(this.maxLevel / 100);
        this.capLevel();
        this.updateHTML();
    }

    upgradeEffect(): number {
        if (this.level === this.maxLevel) {
            return 1;
        } else {
            return 1 - Math.pow(Math.E, -this.level / this.expoDivisor)
        }
    }

    updateHTML(): void {
        updateElementById(
            'coin-bar-resonance-effect',
            {
                textContent: `On CRIT, ${format(100 * this.upgradeEffect(), 2)}% chance of SUPER
                             CRIT (3x damage and earn coins)`
            }
        )
        if (this.level === this.maxLevel) {
            updateElementById(
                'coin-bar-resonance-name',
                {
                    textContent: 'Bar Resonance [MAX LEVEL]'
                }
            )
            updateStyleById(
                'coin-bar-resonance-name',
                {
                    color: 'orchid'
                }
            )
        } else {
            updateElementById(
                'coin-bar-resonance-name',
                {
                    textContent: `Bar Resonance ${format(this.level)}/${format(this.maxLevel)}`
                }
            )
        }
    }
}