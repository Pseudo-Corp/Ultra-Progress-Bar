//import assert from 'assert'

/**
 *
 * @param multiplier Static coefficient for upgrade
 * @param baseLevel Level provided as already obtained
 * @param toLevel Level desired to buy, must be at least as much as baseLevel
 * @param power Levels are raised to this number to tabulate final cost
 * @returns Final cost, based on the fact n-th level costs mult * n^power total.
 */
export const computePolyCost = (multiplier: number, baseLevel: number, toLevel: number, power = 1) => {
//    assert(baseLevel <= toLevel, "Must compute cost for weakly greater level than baseLevel!")
    return Math.ceil(multiplier * (Math.pow(toLevel, power) - Math.pow(baseLevel, power)))
}

/**
 *
 * @param multiplier Static coefficient for upgrade
 * @param baseLevel Level provided as already obtained
 * @param toLevel Level desired to buy, must be at least as much as baseLevel
 * @param ratio Levels are raised to this number to tabulate final cost, must be greater than 1
 * @returns Final Cost, based on the fact n-th level follows geometric formulae.
 */
export const computeExponentialCost = (multiplier: number, baseLevel: number, toLevel: number, ratio = 2) => {
//    assert(baseLevel <= toLevel, "Must compute cost for weakly greater level than baseLevel!")
//    assert(ratio > 1, "Must provide a ratio greater than one!")
    const baseLevelCost = multiplier * (1 - Math.pow(ratio, baseLevel)) / (1 - ratio)
    const toLevelCost = multiplier * (1 - Math.pow(ratio, toLevel)) / (1 - ratio)

    return toLevelCost - baseLevelCost
}