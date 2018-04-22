import * as Phaser from 'phaser-ce';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#000'
    }

    preload() {

        // here preload your assets!
        // this.load.image('testImage', './assets/images/test.jpg')

        this.game.load.spritesheet('player-n', './assets/robots/robots_06.png', 32, 32);
        this.game.load.spritesheet('player-e', './assets/robots/robots_03.png', 32, 32);
        this.game.load.spritesheet('player-s', './assets/robots/robots_05.png', 32, 32);
        this.game.load.spritesheet('player-w', './assets/robots/robots_04.png', 32, 32);


        this.game.load.spritesheet('test-dummy-n', './assets/robots/robots_07.png', 32, 32);
        this.game.load.spritesheet('test-dummy-e', './assets/robots/robots_09.png', 32, 32);
        this.game.load.spritesheet('test-dummy-s', './assets/robots/robots_08.png', 32, 32);
        this.game.load.spritesheet('test-dummy-w', './assets/robots/robots_10.png', 32, 32);


        this.game.load.spritesheet('wall', './assets/robots/robots_11.png', 32, 32);
        this.game.load.spritesheet('empty-tile-1', './assets/robots/robots_00.png', 32, 32);
        this.game.load.spritesheet('empty-tile-2', './assets/robots/robots_00.png', 32, 32);
        this.game.load.spritesheet('empty-tile-0', './assets/robots/robots_00.png', 32, 32);


        this.game.load.spritesheet('action-forward', './assets/robots/robots_12.png', 32, 32);
        this.game.load.spritesheet('action-turn-right', './assets/robots/robots_17.png', 32, 32);
        this.game.load.spritesheet('action-turn-left', './assets/robots/robots_16.png', 32, 32);
        this.game.load.spritesheet('action-back', './assets/robots/robots_15.png', 32, 32);
        this.game.load.spritesheet('action-around', './assets/robots/robots_18.png', 32, 32);
        this.game.load.spritesheet('action-shoot', './assets/robots/robots_19.png', 32, 32);
        this.game.load.spritesheet('action-left', './assets/robots/robots_13.png', 32, 32);
        this.game.load.spritesheet('action-right', './assets/robots/robots_14.png', 32, 32);


        this.game.load.spritesheet('ui-frame', './assets/ui/frame.png', GAME_WIDTH, GAME_HEIGHT);
        this.game.load.spritesheet('confirm-button', './assets/ui/confirm.png', 77, 28);
        this.game.load.spritesheet('reroll-button', './assets/ui/reroll.png', 77, 28);

    }

    render() {
        this.game.state.start('Game')
    }
}
