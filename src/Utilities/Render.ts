import { getElementById } from "./UpdateHTML";

export const updateElement = <
    T extends HTMLElement | CSSStyleDeclaration,
    R extends keyof T
>(
    element: T,
    keys: Record<R, T[R]>
): boolean => {
    if (document.visibilityState === 'hidden') return false;

    const entries = Object.entries(keys) as [R, T[R]][];

    for (const [prop, key] of entries) {
        element[prop] = key;
    }

    return true;
}

export const updateElementById = <R extends keyof HTMLElement>(
    id: string,
    keys: Record<R, HTMLElement[R]>
): boolean => {
    if (document.visibilityState === 'hidden') return false;

    return updateElement(
        getElementById(id),
        keys
    );
}

export const updateStyleById = <R extends keyof CSSStyleDeclaration>(
    id: string,
    keys: Record<R, CSSStyleDeclaration[R]>
): boolean => {
    if (document.visibilityState === 'hidden') return false;

    return updateElement(
        getElementById(id).style,
        keys
    );
}