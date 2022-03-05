import { format } from '../../../Utilities/Format';
import { updateElementById } from '../../../Utilities/Render';
import { Currency } from '../Currency'

export class Coins extends Currency {
    updateHTML(): void {
        updateElementById(
            'gold-amount',
            {
                textContent: format(this.amount)
            }
        );
    }

    updateOnGain(amount: number): void {
        if (amount > 0) {
            this.player.talents.coinGain.gainEXP(amount)
        }
    }
}