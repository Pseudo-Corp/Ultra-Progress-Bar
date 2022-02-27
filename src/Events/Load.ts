import { loadGame } from '../Game';
import { generateEventHandlers } from '../Utilities/Eventlisteners';
import { onRefresh } from '../Utilities/UpdateHTML';

// eslint-disable-next-line @typescript-eslint/no-misused-promises
window.addEventListener('load', async () => {
	generateEventHandlers();
    await loadGame();
	onRefresh();
});