import { player } from "../Game";
import { reset } from "../Main/Reset/Refresh";
import { getElementById, hideStuff } from "./UpdateHTML";

export const generateEventHandlers = () => {
    getElementById("main-tab-nav").addEventListener('click', () => hideStuff("Main"));
    getElementById("upgrade-tab-nav").addEventListener('click', () => hideStuff("Upgrades"));

    getElementById("buy-coin-bar-speed").addEventListener(
        'click',
        (event) => player.coinUpgrades.barSpeed.purchaseLevels(1, event)
    );
    getElementById("buy-coin-bar-momentum").addEventListener(
        'click',
        (event) => player.coinUpgrades.barMomentum.purchaseLevels(1, event)
    );
    getElementById("buy-reset").addEventListener('click', () => reset('Refresh'));

}