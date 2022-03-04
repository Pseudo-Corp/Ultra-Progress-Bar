import { Player } from '../../types/player';

export type Currencies = 'Coins'

export abstract class Currency {
    constructor(
        public amount = 0,
        public player: Player
    ) {
        this.amount = amount;
        this.updateHTML();
    }

    spend(amount: number):void {
        if (this.amount >= amount) {
            this.amount -= amount;
            this.updateHTML();
        }
    }

    gain(amount: number):void {
        this.amount += amount;
        this.updateHTML();
    }

    set(amount: number):void {
        this.amount = amount;
        this.updateHTML();
    }

    public valueOf () {
        return { amount: this.amount };
    }

    abstract updateHTML(): void;

}