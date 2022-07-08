import { loadGame, player } from '../Game'
import { Alert } from '../HTML/Popups'
import { generateEventHandlers } from '../Utilities/Eventlisteners'
import { onRefresh } from '../Utilities/UpdateHTML'

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('load', async () => {
    generateEventHandlers(player)
    await loadGame()
    onRefresh(player)

    // All versions of Chrome and Firefox supported by the game have this API,
    // but not all versions of Edge and Safari do.
    // Along with this, on Chrome there is no popup to allow/deny permission to
    // use persistent storage; it's arbitrarily determined. Use Firefox so you
    // don't have to deal with stupid shit decisions a mega-corp makes on your
    // behalf.
    // https://stackoverflow.com/a/51735357
    // https://dexie.org/docs/StorageManager
    if (
        /* eslint-disable @typescript-eslint/no-unnecessary-condition */
        typeof navigator.storage?.persist === 'function' &&
        typeof navigator.storage?.persisted === 'function'
        /* eslint-enable @typescript-eslint/no-unnecessary-condition */
    ) {
        const persistent = await navigator.storage.persisted()

        if (!persistent) {
            const isPersistentNow = await navigator.storage.persist().catch(() => false)

            if (isPersistentNow) {
                void Alert(
                    'Data on this page is now persistent! If you do not know what this means, you can safely ignore it.'
                )
            }
        } else {
            // eslint-disable-next-line no-console
            console.log(`Storage is persistent! (persistent = ${persistent})`)
        }
    }
})