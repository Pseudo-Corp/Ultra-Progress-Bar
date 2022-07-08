import { Player } from '../../types/player'
import { format } from '../../Utilities/Format'
import { updateElementById } from '../../Utilities/Render'
import { Challenges } from './types'

export const challengeDetails = async (type: Challenges, player: Player) => {
    const name = (type === 'Basic Challenge') ? 'Basic Challenge' : `${type} Challenge`
    const completionMax = 25 // to be expanded upon later.

    updateElementById(
        'challenge-name',
        {
            textContent: name
        }
    )

    switch (type) {
        case 'Basic Challenge':
            updateElementById(
                'challenge-description',
                {
                    textContent: `The challenge is simple: Get to level
                                    ${format(175 + 25 * player.completedChallenges.basicChallenge)}! 
                                    Your bar fragments are reset on challenges, however.`
                }
            )
            updateElementById(
                'challenge-completions',
                {
                    textContent: `${name} has been completed
                                 ${player.completedChallenges.basicChallenge} / ${completionMax} times`
                }
            )
            updateElementById(
                'challenge-reward',
                {
                    textContent: `First Completion: +1 Base Coin Worth to all levels above 100! \r\n
                    Each Completion: +1% Coins, +2% Chance for levels
                     ending in 5 to be worth more coins. \r\n
                    Final Completion: Another +15% Coins!`
                }
            )
            break
        case 'No Refresh':
            updateElementById(
                'challenge-description',
                {
                    textContent: `Refreshing is so out of style! Get to level 
                                    ${format(100 + 15 * player.completedChallenges.noRefresh)}
                                     without once refreshing!`
                }
            )
            updateElementById(
                'challenge-completions',
                {
                    textContent: `${name} has been completed 
                                    ${player.completedChallenges.noRefresh} / ${completionMax} times`
                }
            )
            updateElementById(
                'challenge-reward',
                {
                    textContent: `First Completion: +3% Bar Fragments every 10 Bar Levels!
                            Each Completion: Reduce the threshold 
                            for 3x fragments by 1 level (from 100)
                            Final Completion: 3x Bar Fragments!`
                }
            )
            break
        case 'No Coin Upgrades':
            updateElementById(
                'challenge-description',
                {
                    textContent: `Even in this game, deflation hurts. Get to level
                                 ${format(100 + 15 * player.completedChallenges.noRefresh)}
                                  without the effects of coin upgrades!`
                }
            )
            updateElementById(
                'challenge-completions',
                {
                    textContent: `${name} has been completed 
                    ${player.completedChallenges.noRefresh} / ${completionMax} times`
                }
            )
            updateElementById(
                'challenge-reward',
                {
                    textContent: 'WIP REWARD! I doubt this is possible, anyway...'
                }
            )
            break
        case 'Reduced Bar Fragments':
            updateElementById(
                'challenge-description',
                {
                    textContent: `Get to level ${format(200 + 40 * player.completedChallenges.reducedFragments)}, 
                                but Bar Fragments are substantially reduced!.`
                }
            )
            updateElementById(
                'challenge-completions',
                {
                    textContent: `${name} has been completed 
                                ${player.completedChallenges.reducedFragments} / ${completionMax}
                                 times`
                }
            )
            updateElementById(
                'challenge-reward',
                {
                    textContent: 'WIP! I doubt this is possible, anyway...'
                }
            )
            break
        case 'None':
            updateElementById(
                'challenge-description',
                {
                    textContent: `Exit your challenge, if you want. 
                                Otherwise resets your bar fragments, for some reason.`
                }
            )
            updateElementById(
                'challenge-completions',
                {
                    textContent: ''
                }
            )
            updateElementById(
                'challenge-reward',
                {
                    textContent: ''
                }
            )
            break
    }

}