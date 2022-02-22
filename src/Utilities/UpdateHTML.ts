import { updateElement } from "./Render"

export type Tabs = "Main" | "Upgrades"

export const hideStuff = (tab: Tabs) => {
    updateElement(
        getElementById("mainTab").style,
        { display: 'none' }
    );
    updateElement(
        getElementById('upgradeTab').style,
        { display: 'none' }
    );

    if (tab === "Main") {
        updateElement(
            getElementById("mainTab").style,
            { display: 'block' }
        );
    } else if (tab === "Upgrades") {
        updateElement(
            getElementById("upgradeTab").style,
            { display: 'block' }
        );
    }
}

export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement;