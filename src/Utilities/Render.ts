export const getElementById = (id: string): HTMLElement =>
    document.getElementById(id) as HTMLElement

export const updateElement = <
    T extends HTMLElement | CSSStyleDeclaration,
    R extends keyof T
>(
        element: T,
        keys: Record<R, T[R]>
    ): boolean => {
    if (document.visibilityState === 'hidden') return false

    const entries = Object.entries(keys) as [R, T[R]][]

    for (const [prop, key] of entries) {
        element[prop] = key
    }

    return true
}

export const updateElementById = <R extends keyof HTMLElement>(
    id: string | HTMLElement,
    keys: Record<R, HTMLElement[R]>
): boolean => {
    if (document.visibilityState === 'hidden') return false

    if (typeof id === 'string') {
        return updateElement(
            getElementById(id),
            keys
        )
    } else {
        return updateElement(
            id,
            keys
        )
    }

}

export const updateStyleById = <R extends keyof CSSStyleDeclaration>(
    id: string | HTMLElement,
    keys: Record<R, CSSStyleDeclaration[R]>
): boolean => {
    if (document.visibilityState === 'hidden') return false

    if (typeof id === 'string') {
        return updateElement(
            getElementById(id).style,
            keys
        )
    } else {
        return updateElement(
            id.style,
            keys
        )
    }
}