export type Tabs = "Main" | "Upgrades"

export const hideStuff = (tab: Tabs) => {
    getElementById("mainTab").style.display = "none"
    getElementById("upgradeTab").style.display = "none"

    if (tab === "Main") {
        getElementById("mainTab").style.display = "block"
    }
    if (tab === "Upgrades") {
        getElementById("upgradeTab").style.display = "block"
    }
}

export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement;