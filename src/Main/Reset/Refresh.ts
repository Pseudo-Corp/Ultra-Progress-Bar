import { minimumRefreshCounter } from '../../Game'
import { Alert } from '../../HTML/Popups'
import { Player } from '../../types/player'
import { format } from '../../Utilities/Format'
import { onCriticalHit, onRefresh } from '../../Utilities/UpdateHTML'
import { computeMainBarTNL, getBarWidth, updateMainBar } from '../ProgressBar/Properties'

export type resetTypes = 'Refresh' | 'Transcend'

export const reset = (variant: resetTypes, player: Player) => {
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
        player.refreshCount += 1
        player.refreshTime = 0;
        player.criticalHitsThisRefresh = 0;

        onCriticalHit(player);
        onRefresh(player);
    } else {
        return void Alert('You cannot refresh yet. Get to level 5 lol')
    }
}