import { player } from "../Game";
import { reset } from "../Main/Reset/Refresh";
import { hideStuff } from "./UpdateHTML";

export const generateEventHandlers = () => {
    document.getElementById("main-tab-nav").addEventListener('click', () => hideStuff("Main"));
    document.getElementById("upgrade-tab-nav").addEventListener('click', () => hideStuff("Upgrades"));

    document.getElementById("buy-coin-bar-speed").addEventListener(
        'click',
        (event) => player.coinUpgrades.barSpeed.purchaseLevels(1, event)
    );
    document.getElementById("buy-coin-bar-momentum").addEventListener(
        'click',
        (event) => player.coinUpgrades.barMomentum.purchaseLevels(1, event)
    );
    document.getElementById("buy-reset").addEventListener('click', () => reset('Refresh'));

}