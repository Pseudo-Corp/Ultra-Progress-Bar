import { getElementById } from '../Utilities/Render';

const querySelector = <
	R extends Element = HTMLElement,
	T extends Document | ParentNode = Document | ParentNode
>(item: T, args: Parameters<T['querySelector']>[0]): R => {
    return item.querySelector(args) as R;
}

const ConfirmCB = (text: string, cb: (value: boolean) => void) => {
    const conf = getElementById('confirmationBox');
    const confWrap = getElementById('confirmWrapper');
    const popup = querySelector(document, '#confirm');
    const overlay = querySelector(document, '#transparentBG');
    const ok = querySelector(popup, '#okConfirm');
    const cancel = querySelector(popup, '#cancelConfirm');

    conf.style.display = 'block';
    confWrap.style.display = 'block';
    overlay.style.display = 'block';
    querySelector(popup, 'p').textContent = text;
    popup.focus();

    // IF you clean up the typing here also clean up PromptCB
    const listener = ({ target }: MouseEvent | { target: HTMLElement }) => {
        const targetEl = target as HTMLButtonElement;
        ok.removeEventListener('click', listener);
        cancel.removeEventListener('click', listener);
        popup.removeEventListener('keyup', kbListener);

        conf.style.display = 'none';
        confWrap.style.display = 'none';
        overlay.style.display = 'none';

        return cb(targetEl === ok);
    }

    const kbListener = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            return listener({ target: ok })
        } else if (e.key === 'Escape') {
            return listener({ target: cancel })
        }

        return e.preventDefault();
    }

    ok.addEventListener('click', listener);
    cancel.addEventListener('click', listener);
    popup.addEventListener('keyup', kbListener);
}

const AlertCB = (text: string, cb: (value: undefined) => void) => {
    const conf = getElementById('confirmationBox');
    const alertWrap = getElementById('alertWrapper');
    const overlay = querySelector(document, '#transparentBG');
    const popup = querySelector(document, '#alert');
    const ok = querySelector(popup, '#okAlert');

    conf.style.display = 'block';
    alertWrap.style.display = 'block';
    overlay.style.display = 'block';
    querySelector(popup, 'p').textContent = text;
    popup.focus();

    const listener = () => {
        ok.removeEventListener('click', listener);
        popup.removeEventListener('keyup', kbListener);

        conf.style.display = 'none';
        alertWrap.style.display = 'none';
        overlay.style.display = 'none';
        cb(undefined);
    }

    const kbListener = (e: KeyboardEvent) => (e.key === 'Enter' || e.key === ' ') && listener();

    ok.addEventListener('click', listener);
    popup.addEventListener('keyup', kbListener);
}

const PromptCB = (text: string, cb: (value: string | null) => void) => {
    const conf = getElementById('confirmationBox');
    const confWrap = getElementById('promptWrapper');
    const overlay = querySelector(document, '#transparentBG');
    const popup = querySelector(document, '#prompt');
    const ok = querySelector(popup, '#okPrompt');
    const cancel = querySelector(popup, '#cancelPrompt');

    conf.style.display = 'block';
    confWrap.style.display = 'block';
    overlay.style.display = 'block';
    querySelector(popup, 'label').textContent = text;
    querySelector(popup, 'input').focus();

    // kinda disgusting types but whatever
    const listener = ({ target }: MouseEvent | { target: HTMLElement }) => {
        const targetEl = (target as HTMLElement).parentNode as HTMLInputElement;
        const el = querySelector<HTMLInputElement>(targetEl, 'input');

        ok.removeEventListener('click', listener);
        cancel.removeEventListener('click', listener);
        querySelector(popup, 'input').removeEventListener('keyup', kbListener);

        conf.style.display = 'none';
        confWrap.style.display = 'none';
        overlay.style.display = 'none';

        cb(targetEl.id === ok.id ? el.value : null);
        el.value = el.textContent = '';
    }

    const kbListener = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
            return listener({ target: ok });
        } else if (e.key === 'Escape') {
            return listener({ target: cancel });
        }

        return e.preventDefault();
    }

    ok.addEventListener('click', listener);
    cancel.addEventListener('click', listener);
    querySelector(popup, 'input').addEventListener('keyup', kbListener);
}


/*** Promisified version of the AlertCB function. */
export const Alert = (text: string): Promise<ReturnType<typeof alert>> =>
    new Promise(res => AlertCB(text, res));
/*** Promisified version of the PromptCB function. */
export const Prompt = (text: string): Promise<ReturnType<typeof prompt>> =>
    new Promise(res => PromptCB(text, res));
/*** Promisified version of the ConfirmCB function */
export const Confirm = (text: string): Promise<ReturnType<typeof confirm>> =>
    new Promise(res => ConfirmCB(text, res));