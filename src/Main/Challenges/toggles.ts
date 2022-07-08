import { Alert, Confirm } from '../../HTML/Popups'
import { Player } from '../../types/player'
import { updateStyleById } from '../../Utilities/Render'
import { updateAllCoinUpgrades } from '../../Utilities/UpdateHTML'
import { challengeReset } from '../Reset/Challenge'
import { Challenges } from './types'

export const toggleChallenge = async (type: Challenges, player: Player, exit = false) => {
    const colorToggle = [
        ['Basic Challenge', 'basic-challenge-icon'],
        ['No Refresh','no-refresh-challenge-icon'],
        ['No Coin Upgrades','no-coin-upgrade-challenge-icon'],
        ['Reduced Bar Fragments','reduced-fragments-challenge-icon']
    ]

    if (exit) {
        player.currentChallenge = 'None'
        for (const item of colorToggle) {
            updateStyleById(
                item[1],
                {
                    backgroundColor: (type !== item[0]) ? 'transparent' : 'lightgoldenrodyellow'
                }
            )
        }
        updateAllCoinUpgrades(player)
        return
    }

    if (player.currentChallenge !== 'None' && type !== 'None') {
        return Alert(`You are already in a challenge!
         Leave it using the rightmost icon if you want to start a new one.`)
    }

    let confirmation
    if (player.currentChallenge === 'None') {
        confirmation = await Confirm('Entering a challenge also resets your bar fragments. Continue?')
    } else {
        confirmation = await Confirm(`Would you like to exit ${player.currentChallenge}?`)
    }

    if (confirmation) {

        if (player.barLevel < 5 && type !== 'None') {
            return Alert('I cannot do this action until you are at bar level 5.')
        }
        if (type !== 'None') challengeReset(player)

        player.currentChallenge = type
        updateAllCoinUpgrades(player)

        for (const item of colorToggle) {
            updateStyleById(
                item[1],
                {
                    backgroundColor: (type !== item[0]) ? 'transparent' : 'lightgoldenrodyellow'
                }
            )
        }
    } else {
        return Alert('Alright, enjoy your business.')
    }
}