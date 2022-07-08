import { Player } from '../../../types/player'
import { format } from '../../../Utilities/Format'
import { updateElementById } from '../../../Utilities/Render'
import { Currency } from '../Currency'

export class Coins extends Currency {
    public totalCoins: number
    constructor(amount: number, player: Player, totalCoins: number) {
        super(amount, player)
        this.totalCoins = totalCoins
        this.updateHTML()
    }

    updateHTML(): void {
        updateElementById(
            'gold-amount',
            {
                textContent: format(this.amount)
            }
        )
        updateElementById(
            'gold-total-amount',
            {
                textContent: format(this.totalCoins)
            }
        )
    }

    updateOnGain(amount: number): void {
        if (amount > 0) {
            this.player.talents.coinGain.gainEXP(amount)
        }
        this.totalCoins += amount
    }

    public override valueOf () {
        return { amount: this.amount, totalCoins: this.totalCoins }
    }
}