import tileToCanvas from "../../tileToCanvas";

export default class EmptyTile extends Phaser.Sprite {
    constructor(game: Phaser.Game, x: number, y: number) {
        super(game, tileToCanvas(x, y).x, tileToCanvas(x, y).y, 'empty-tile')
    }
}
