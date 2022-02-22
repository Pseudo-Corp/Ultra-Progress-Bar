import { format } from "../../../Utilities/Format";
import { updateElement } from "../../../Utilities/Render";
import { getElementById } from "../../../Utilities/UpdateHTML";
import { Currency } from "../Currency"

export class Coins extends Currency {
    updateHTML(): void {
        updateElement(
            getElementById("gold-amount"),
            {
                textContent: format(this.amount)
            }
        );
    }
}