import { Player } from '../../../types/player';
import { format } from '../../../Utilities/Format';
import { updateElementById } from '../../../Utilities/Render';
import { Currency } from '../Currency'

export class Coins extends Currency {
    public totalCoins: number
    constructor(amount: number, player: Player) {
        super(amount, player)
        this.totalCoins = 0
    }

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
        this.totalCoins += amount
    }
}