import { minimumRefreshCounter } from '../../Game'
import { Alert } from '../../HTML/Popups'
import { Player } from '../../types/player'
import { format } from '../../Utilities/Format'
import { onCriticalHit, onRefresh } from '../../Utilities/UpdateHTML'
import { computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, updateMainBar } from '../ProgressBar/Properties'

export type resetTypes = 'Refresh' | 'Transcend'

export const reset = (variant: resetTypes, player: Player) => {
    if (player.currentChallenge === 'No Refresh') {
        return Alert('Hey, bub! You can\'t refresh, it\'ll be catastrophic, or something.')
    }
    if (variant === 'Refresh' && player.barLevel >= 5) {

        if (player.refreshTime < minimumRefreshCounter) {
            return void Alert(`Currently, refreshes have a ${format(minimumRefreshCounter)} second cooldown. Sorry!`);
        }

        player.barFragments.set(player.barFragments.getAmountOnRefresh())

        player.barEXP = 0
        player.barLevel = 0

        player.barTNL = computeMainBarTNL(player);
        updateMainBar(getBarWidth(player.barEXP, player.barTNL));
        player.barFragments.updateHTML();
        player.talents.barCriticalChance.convertToPerm();
        player.talents.barCriticalChance.updateHTML('Initialize');
        player.talents.barSpeed.convertToPerm();
        player.talents.barSpeed.updateHTML('Initialize')
        player.talents.coinGain.convertToPerm();
        player.talents.coinGain.updateHTML('Initialize')
        player.refreshCount += 1
        player.refreshTime = 0;
        player.criticalHitsThisRefresh = 0;
        player.coinValueCache = computeMainBarCoinWorth(player);

        onCriticalHit(player, false);
        onRefresh(player);
    } else {
        return void Alert('You cannot refresh yet. Get to level 5 lol')
    }
}