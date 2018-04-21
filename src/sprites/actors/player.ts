import tileToCanvas from "../../tileToCanvas";
import { ROTATION } from "../../rotation";

export default class Player extends Phaser.Sprite {

    mapX: number;
    mapY: number;
    private _mapRotation;

    set mapRotation(v: ROTATION) {
        if (v !== this._mapRotation) {
            switch (v) {
                case ROTATION.N:
                    this.loadTexture('player-n', 0);
                    break;

                case ROTATION.E:
                    this.loadTexture('player-e', 0);
                    break;

                case ROTATION.S:
                    this.loadTexture('player-s', 0);
                    break;

                case ROTATION.W:
                    this.loadTexture('player-w', 0);
                    break;
            }

            this._mapRotation = v;
        }
    }

    get mapRotation() {
        return this._mapRotation;
    }

    constructor(game: Phaser.Game, x: number, y: number, rotation: ROTATION = ROTATION.N) {
        super(game, tileToCanvas(x, y).x, tileToCanvas(x, y).y);

        this.mapX = x;
        this.mapY = y;
        this.mapRotation = rotation
    }

    mapMove([x,y]) {
        this.x = tileToCanvas(x, y).x;
        this.y = tileToCanvas(x, y).y;
    }
}