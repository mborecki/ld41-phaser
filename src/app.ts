import * as Phaser from 'phaser-ce'

import { BootState } from './states/boot'
import { GameState } from './states/game'
import { GAME_HEIGHT, MAX_GAME_WIDTH, GAME_WIDTH } from './config';

export default class App extends Phaser.Game {

    constructor() {
        // let width = document.documentElement.clientWidth > GAME_WIDTH ? GAME_WIDTH : document.documentElement.clientWidth
        // let height = document.documentElement.clientHeight > GAME_HEIGHT ? GAME_HEIGHT : document.documentElement.clientHeight

        // let width = height * 15/9;

        super(GAME_WIDTH, GAME_HEIGHT)

        this.state.add('Boot', BootState, false)
        this.state.add('Game', GameState, false)

        this.state.start('Boot')
    }
}
