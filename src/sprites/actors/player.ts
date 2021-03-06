import tileToCanvas from "../../tileToCanvas";
import { ROTATION } from "../../rotation";
import { ACTION } from "../../action";
import Actor, { TAG } from "../../actor";

export default class Player extends Phaser.Sprite implements Actor {


    _mapX: number;

    get mapX() {
        return this._mapX;
    }

    set mapX(v: number) {
        this._mapX = v;
        this.x = tileToCanvas(this._mapX, this._mapY).x;
    }
    _mapY: number;

    get mapY() {
        return this._mapY;
    }

    set mapY(v: number) {
        this._mapY = v;
        this.y = tileToCanvas(this._mapY, this._mapY).y;
    }

    private _mapRotation;

    actions: ACTION[];

    tags: TAG[] = [
        TAG.PLAYER
    ]

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

    mapMove([x, y]) {
        this.mapX = x;
        this.mapY = y;
        this.x = tileToCanvas(x, y).x;
        this.y = tileToCanvas(x, y).y;
    }

    mapMoveDirection(direction: ROTATION) {
        switch (direction) {
            case ROTATION.N:
                this.mapY = this.mapY - 1;
                break;
            case ROTATION.E:
                this.mapX = this.mapX + 1;
                break;
            case ROTATION.S:
                this.mapY = this.mapY + 1;
                break;
            case ROTATION.W:
                this.mapX = this.mapX - 1;
                break;
        }
    }

    nextAction(shift = true): ACTION {
        if (shift) {
            return this.actions.shift();
        } else {
            return this.actions[0];
        }
    }

    hasTag(tag) {
        return this.tags.indexOf(tag) > -1;
    }
}
