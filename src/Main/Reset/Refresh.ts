import { minimumRefreshCounter, player } from "../../Game"
import { format } from "../../Utilities/Format"
import { updateElementById } from "../../Utilities/Render"
import { computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, updateMainBar } from "../ProgressBar/Properties"

export type resetTypes = "Refresh" | "Transcend"

export const reset = (variant: resetTypes) => {
    if (variant === "Refresh" && player.barLevel >= 5) {

        if (player.refreshTime < minimumRefreshCounter) {
            return alert(`Currently, refreshes have a ${format(minimumRefreshCounter)} second cooldown. Sorry!`)
        }

        player.barFragments.set(player.barFragments.getAmountOnRefresh())

        player.barEXP = 0
        player.barLevel = 0

        player.barTNL = computeMainBarTNL();
        updateMainBar(getBarWidth(player.barEXP, player.barTNL));
        updateElementById(
            'coinWorth',
            { textContent: `Worth ${format(computeMainBarCoinWorth())} coins` }
        );
        player.barFragments.updateHTML();
        player.talents.barCriticalChance.convertToPerm();
        player.talents.barCriticalChance.updateHTML("Initialize");
        player.talents.barSpeed.convertToPerm();
        player.talents.barSpeed.updateHTML("Initialize")
        player.refreshCount += 1
        player.refreshTime = 0;

        updateElementById(
            "refresh-counter",
            { textContent: format(player.refreshCount)}
        );
    }
    else {
        alert("You cannot refresh yet. Get to level 5 lol")
    }
}