import { player } from '../../../Game';
import { format } from '../../../Utilities/Format';
import { updateElementById } from '../../../Utilities/Render';
import { Currency } from '../Currency';

export class ProgressFragment extends Currency {
    updateHTML(): void {
        updateElementById(
            'fragment-amount',
            { textContent: format(this.amount) }
        );
        updateElementById(
            'fragment-bonus',
            { textContent: format(this.amount) }
        );
        updateElementById(
            'fragment-gain',
            { textContent: format(this.getAmountOnRefresh()) }
        );
    }

    getAmountOnRefresh(): number {
        if (player !== undefined) {
        const level = player.barLevel

        let baseAmount = 100 * Math.pow(1.07, -5);
        baseAmount *= Math.pow(1.07, level);
        baseAmount *= Math.pow(3, Math.floor(level / 100));

        baseAmount *= (1 + player.criticalHitsThisRefresh * player.coinUpgrades.barAgitation.upgradeEffect());
        
        return Math.floor(baseAmount);
        }
        else
            return 0
    }

    unspentBonus(): number {
        return (1 + 1/100 * this.amount)
    }
}