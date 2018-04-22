import * as Phaser from 'phaser-ce';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#EDEEC9'
    }

    preload() {

        // here preload your assets!
        // this.load.image('testImage', './assets/images/test.jpg')

        this.game.load.spritesheet('player-n', './assets/robots/robots_04.png', 32, 32);
        this.game.load.spritesheet('player-e', './assets/robots/robots_03.png', 32, 32);
        this.game.load.spritesheet('player-s', './assets/robots/robots_05.png', 32, 32);
        this.game.load.spritesheet('player-w', './assets/robots/robots_06.png', 32, 32);


        this.game.load.spritesheet('test-dummy-n', './assets/robots/robots_07.png', 32, 32);
        this.game.load.spritesheet('test-dummy-e', './assets/robots/robots_09.png', 32, 32);
        this.game.load.spritesheet('test-dummy-s', './assets/robots/robots_08.png', 32, 32);
        this.game.load.spritesheet('test-dummy-w', './assets/robots/robots_10.png', 32, 32);


        this.game.load.spritesheet('wall', './assets/robots/robots_11.png', 32, 32);
        this.game.load.spritesheet('empty-tile-1', './assets/robots/robots_00.png', 32, 32);
        this.game.load.spritesheet('empty-tile-2', './assets/robots/robots_00.png', 32, 32);
        this.game.load.spritesheet('empty-tile-3', './assets/robots/robots_00.png', 32, 32);


        this.game.load.spritesheet('action-forward', './assets/placeholders/placeholders_12.png', 16, 16);
        this.game.load.spritesheet('action-turn-right', './assets/placeholders/placeholders_13.png', 16, 16);
        this.game.load.spritesheet('action-turn-left', './assets/placeholders/placeholders_14.png', 16, 16);
        this.game.load.spritesheet('action-back', './assets/placeholders/placeholders_15.png', 16, 16);
        this.game.load.spritesheet('action-around', './assets/placeholders/placeholders_16.png', 16, 16);
        this.game.load.spritesheet('action-shoot', './assets/placeholders/placeholders_17.png', 16, 16);
        this.game.load.spritesheet('action-left', './assets/placeholders/placeholders_18.png', 16, 16);
        this.game.load.spritesheet('action-right', './assets/placeholders/placeholders_19.png', 16, 16);

    }

    render() {
        this.game.state.start('Game')
    }
}
