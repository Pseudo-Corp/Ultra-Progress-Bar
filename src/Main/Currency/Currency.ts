export type Currencies = 'Coins'

export abstract class Currency {
    amount: number;
    
    constructor(amount = 0) {
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

    abstract updateHTML(): void;

}