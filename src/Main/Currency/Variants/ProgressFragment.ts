import { player } from "../../../Game";
import { format } from "../../../Utilities/Format";
import { getElementById } from "../../../Utilities/UpdateHTML";
import { Currency } from "../Currency";

export class ProgressFragment extends Currency {
    updateHTML(): void {
        getElementById("fragment-amount").textContent = format(this.amount);
        getElementById("fragment-bonus").textContent = format(this.amount);
        getElementById("fragment-gain").textContent = format(this.getAmountOnRefresh());
    }

    getAmountOnRefresh(level = 0):number {
        if (player !== undefined)
            level = player.barLevel

        let baseAmount = 33;
        baseAmount *= Math.pow(1.03, level);

        return Math.floor(baseAmount);
    }

    unspentBonus(): number {
        return (1 + 1/100 * this.amount)
    }
}