import { player } from "../../Game"
import { format } from "../../Utilities/Format"
import { updateElementById } from "../../Utilities/Render"
import { computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, updateMainBar } from "../ProgressBar/Properties"

export type resetTypes = "Refresh" | "Transcend"

export const reset = (variant: resetTypes) => {
    if (variant === "Refresh" && player.barLevel >= 5) {

        if (player.refreshTime < 60) {
            return alert('currently, refreshes have a 60 second cooldown. Sorry!')
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