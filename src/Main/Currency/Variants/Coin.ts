import { format } from "../../../Utilities/Format";
import { getElementById } from "../../../Utilities/UpdateHTML";
import { Currency } from "../Currency"

export class Coins extends Currency {
    updateHTML(): void {
        getElementById("gold-amount").textContent = format(this.amount);
    }
}