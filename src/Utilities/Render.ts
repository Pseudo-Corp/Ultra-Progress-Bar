export const updateElement = <
    T extends HTMLElement | CSSStyleDeclaration,
    R extends keyof T
>(
    element: T,
    keys: Record<R, T[R]>
) => {
    if (document.visibilityState === 'hidden') return;

    const entries = Object.entries(keys) as [R, T[R]][];

    for (const [prop, key] of entries) {
        element[prop] = key;
    }

    return element;
}