import { player } from "../../../Game";
import { format } from "../../../Utilities/Format";
import { updateElementById } from "../../../Utilities/Render";
import { Currency } from "../Currency";

export class ProgressFragment extends Currency {
    updateHTML(): void {
        updateElementById(
            "fragment-amount",
            { textContent: format(this.amount) }
        );
        updateElementById(
            "fragment-bonus",
            { textContent: format(this.amount) }
        );
        updateElementById(
            "fragment-gain",
            { textContent: format(this.getAmountOnRefresh()) }
        );
    }

    getAmountOnRefresh(level = 0):number {
        if (player !== undefined)
            level = player.barLevel

        let baseAmount = 100 * Math.pow(1.07, -5);
        baseAmount *= Math.pow(1.07, level);
        baseAmount *= Math.pow(1.07, Math.floor(level / 5));

        return Math.floor(baseAmount);
    }

    unspentBonus(): number {
        return (1 + 1/100 * this.amount)
    }
}