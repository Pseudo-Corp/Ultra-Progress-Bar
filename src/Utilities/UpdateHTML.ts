import { updateStyleById } from "./Render"

export type Tabs = "Main" | "Upgrades"

export const hideStuff = (tab: Tabs) => {
    updateStyleById(
        "mainTab",
        { display: 'none' }
    );
    updateStyleById(
        'upgradeTab',
        { display: 'none' }
    );

    if (tab === "Main") {
        updateStyleById(
            "mainTab",
            { display: 'block' }
        );
    } else if (tab === "Upgrades") {
        updateStyleById(
            "upgradeTab",
            { display: 'block' }
        );
    }
}

export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement;