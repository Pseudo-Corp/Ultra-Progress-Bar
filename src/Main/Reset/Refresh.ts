import { player } from "../../Game"
import { format } from "../../Utilities/Format"
import { getElementById } from "../../Utilities/UpdateHTML"
import { computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, updateMainBar } from "../ProgressBar/Properties"

export type resetTypes = "Refresh" | "Transcend"

export const reset = (variant: resetTypes) => {
    if (variant === "Refresh" && player.barLevel >= 5) {
        player.barFragments.set(player.barFragments.getAmountOnRefresh())

        player.barEXP = 0
        player.barLevel = 0

        player.barTNL = computeMainBarTNL();
        updateMainBar(getBarWidth(player.barEXP, player.barTNL))
        getElementById("coinWorth").textContent =  `Worth ${format(computeMainBarCoinWorth())} coins`;
        player.barFragments.updateHTML();
    }
    else {
        alert("You cannot refresh yet. Get to level 5 lol")
    }
}