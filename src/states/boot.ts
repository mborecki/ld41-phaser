import * as Phaser from 'phaser-ce';

export class BootState extends Phaser.State {
    stage: Phaser.Stage

    init() {
        this.stage.backgroundColor = '#EDEEC9'
    }

    preload() {

        // here preload your assets!
        // this.load.image('testImage', './assets/images/test.jpg')

        this.game.load.spritesheet('player-n', './assets/placeholders/placeholders_01.png', 16, 16);
        this.game.load.spritesheet('player-e', './assets/placeholders/placeholders_02.png', 16, 16);
        this.game.load.spritesheet('player-s', './assets/placeholders/placeholders_03.png', 16, 16);
        this.game.load.spritesheet('player-w', './assets/placeholders/placeholders_04.png', 16, 16);


        this.game.load.spritesheet('test-dummy-n', './assets/placeholders/placeholders_05.png', 16, 16);
        this.game.load.spritesheet('test-dummy-e', './assets/placeholders/placeholders_06.png', 16, 16);
        this.game.load.spritesheet('test-dummy-s', './assets/placeholders/placeholders_07.png', 16, 16);
        this.game.load.spritesheet('test-dummy-w', './assets/placeholders/placeholders_08.png', 16, 16);


        this.game.load.spritesheet('wall', './assets/placeholders/placeholders_09.png', 16, 16);
        this.game.load.spritesheet('empty-tile', './assets/placeholders/placeholders_10.png', 16, 16);


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
