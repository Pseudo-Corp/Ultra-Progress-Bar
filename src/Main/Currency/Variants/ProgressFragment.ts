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
        const level = this.player.barLevel

        let baseAmount = 100 * Math.pow(1.07, -5);
        baseAmount *= Math.pow(1.07, level);
        baseAmount *= Math.pow(3, Math.floor(level / 100));

        baseAmount *= (1 + this.player.criticalHitsThisRefresh * this.player.coinUpgrades.barAgitation.upgradeEffect());
        baseAmount *= (1 + this.player.coinUpgrades.barReinforcement.upgradeEffect() * this.player.barLevel);
        return Math.floor(baseAmount);
    }

    unspentBonus(): number {
        return (1 + 1/100 * this.amount)
    }

    updateOnGain(): void {
        // This is intentionally empty. Add something here if it seems suitable.
        // Called whenever this.gain() is called.
    }
}