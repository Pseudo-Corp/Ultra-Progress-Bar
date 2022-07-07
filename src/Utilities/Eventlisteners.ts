import { resetGame, tock } from '../Game';
import { reset } from '../Main/Reset/Refresh';
import { Player } from '../types/player';
import { hideStuff } from './UpdateHTML';
import { getElementById } from './Render';
import { testFighter, toggleAuto } from '../Main/Combat/Player/Fighter';
import { challengeDetails } from '../Main/Challenges/details';
import { toggleChallenge } from '../Main/Challenges/toggles';

export const generateEventHandlers = (player: Player) => {
    getElementById('main-tab-nav').addEventListener('click', () => hideStuff('Main'));
    getElementById('upgrade-tab-nav').addEventListener('click', () => hideStuff('Upgrades'));
    getElementById('talent-tab-nav').addEventListener('click', () => hideStuff('Talents'))
    getElementById('dueling-tab-nav').addEventListener('click', () => hideStuff('Dueling'))
    getElementById('challenge-tab-nav').addEventListener('click', () => hideStuff('Challenges'))


    getElementById('buy-coin-bar-speed').addEventListener(
        'click',
        (event) => player.coinUpgrades.barSpeed.purchaseLevels(1, event)
    );
    getElementById('buy-coin-bar-momentum').addEventListener(
        'click',
        (event) => player.coinUpgrades.barMomentum.purchaseLevels(1, event)
    );
    getElementById('buy-coin-bar-reverberation').addEventListener(
        'click',
        (event) => player.coinUpgrades.barReverberation.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-vibration').addEventListener(
        'click',
        (event) => player.coinUpgrades.barVibration.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-agitation').addEventListener(
        'click',
        (event) => player.coinUpgrades.barAgitation.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-adoption').addEventListener(
        'click',
        (event) => player.coinUpgrades.barAdoption.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-empowerment').addEventListener(
        'click',
        (event) => player.coinUpgrades.barEmpowerment.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-reinforcement').addEventListener(
        'click',
        (event) => player.coinUpgrades.barReinforcement.purchaseLevels(1, event)
    )
    getElementById('buy-coin-bar-resonance').addEventListener(
        'click',
        (event) => player.coinUpgrades.barResonance.purchaseLevels(1, event)
    )
    getElementById('buy-reset').addEventListener('click', () => void reset('Refresh', player));
    getElementById('reset-game').addEventListener('click', () => void resetGame());
    getElementById('simulate-time').addEventListener('click', () => void tock(3600))

    getElementById('talentCriticalChanceSacrifice').addEventListener(
        'click',
        () => void player.talents.barCriticalChance.sacrificeFragments()
    );

    getElementById('talentProgressSpeedSacrifice').addEventListener(
        'click',
        () => void player.talents.barSpeed.sacrificeFragments()
    );

    getElementById('talentCoinGainSacrifice').addEventListener(
        'click',
        () => void player.talents.coinGain.sacrificeFragments()
    );

    getElementById('basicAttack').addEventListener(
        'click',
        () => void testFighter.attack()
    );

    getElementById('autoAttack').addEventListener(
        'click',
        () => void toggleAuto()
    );

    getElementById('enrageSkill').addEventListener(
        'click',
        () => void testFighter.enrage()
    );

    getElementById('basic-challenge-icon').addEventListener(
        'mouseover',
        () => void challengeDetails('Basic Challenge', player)
    )
    getElementById('no-refresh-challenge-icon').addEventListener(
        'mouseover',
        () => void challengeDetails('No Refresh', player)
    )
    getElementById('no-coin-upgrade-challenge-icon').addEventListener(
        'mouseover',
        () => void challengeDetails('No Coin Upgrades', player)
    )
    getElementById('reduced-fragments-challenge-icon').addEventListener(
        'mouseover',
        () => void challengeDetails('Reduced Bar Fragments', player)
    )
    getElementById('none-challenge-icon').addEventListener(
        'mouseover',
        () => void challengeDetails('None', player)
    )

    getElementById('basic-challenge-icon').addEventListener(
        'click',
        () => void toggleChallenge('Basic Challenge')
    )
    getElementById('no-refresh-challenge-icon').addEventListener(
        'click',
        () => void toggleChallenge('No Refresh')
    )
    getElementById('no-coin-upgrade-challenge-icon').addEventListener(
        'click',
        () => void toggleChallenge('No Coin Upgrades')
    )
    getElementById('reduced-fragments-challenge-icon').addEventListener(
        'click',
        () => void toggleChallenge('Reduced Bar Fragments')
    )
    getElementById('none-challenge-icon').addEventListener(
        'click',
        () => void toggleChallenge('None')
    )
}
