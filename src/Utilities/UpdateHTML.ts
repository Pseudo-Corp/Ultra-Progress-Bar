import { backgroundColorCreation } from "../Main/ProgressBar/Properties";
import { updateStyleById } from "./Render"

export type Tabs = "Main" | "Upgrades" | "Talents"

export const hideStuff = (tab: Tabs) => {
    updateStyleById(
        "mainTab",
        { display: 'none' }
    );
    updateStyleById(
        'upgradeTab',
        { display: 'none' }
    );
    updateStyleById(
        'talentsTab',
        { display: 'none' }
    )

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
    } else if (tab === "Talents") {
        updateStyleById(
            "talentsTab",
            { display: 'block' }
        )
    }
}

export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement;

export const onCriticalHit = () => {
    updateStyleById(
        "progression",
        { backgroundColor: "gold"}
    )

    setTimeout( function() {
        updateStyleById(
            "progression",
            {backgroundColor: backgroundColorCreation()}
        );
    }, 250)
}