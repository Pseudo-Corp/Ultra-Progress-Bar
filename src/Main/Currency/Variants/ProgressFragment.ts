import { player } from "../../../Game";
import { format } from "../../../Utilities/Format";
import { updateElement } from "../../../Utilities/Render";
import { getElementById } from "../../../Utilities/UpdateHTML";
import { Currency } from "../Currency";

export class ProgressFragment extends Currency {
    updateHTML(): void {
        updateElement(
            getElementById("fragment-amount"),
            { textContent: format(this.amount) }
        );
        updateElement(
            getElementById("fragment-bonus"),
            { textContent: format(this.amount) }
        );
        updateElement(
            getElementById("fragment-gain"),
            { textContent: format(this.getAmountOnRefresh()) }
        );
    }

    getAmountOnRefresh(level = 0):number {
        if (player !== undefined)
            level = player.barLevel

        let baseAmount = 25;
        baseAmount *= Math.pow(1.04, level);
        baseAmount *= Math.pow(1.05, Math.floor(level / 5));

        return Math.floor(baseAmount);
    }

    unspentBonus(): number {
        return (1 + 1/100 * this.amount)
    }
}