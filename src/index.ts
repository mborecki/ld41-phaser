import 'pixi';
import 'p2';

import App from './app';
import { turn } from './rotation';

new App()

window['DEV'] = {
    turn
}
