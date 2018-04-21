import Actor, { TAG } from "../../actor";
import { ROTATION } from "../../rotation";
import { ACTION } from "../../action";
import tileToCanvas from "../../tileToCanvas";

export default abstract class Enemy extends Phaser.Sprite implements Actor {
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

    spriteKey: string;

    tags: TAG[] = [
        TAG.ENEMY
    ]

    private _mapRotation;
    set mapRotation(v: ROTATION) {
        if (v !== this._mapRotation) {
            switch (v) {
                case ROTATION.N:
                    this.loadTexture(`${this.spriteKey}-n`, 0);
                    break;

                case ROTATION.E:
                    this.loadTexture(`${this.spriteKey}-e`, 0);
                    break;

                case ROTATION.S:
                    this.loadTexture(`${this.spriteKey}-s`, 0);
                    break;

                case ROTATION.W:
                    this.loadTexture(`${this.spriteKey}-w`, 0);
                    break;
            }

            this._mapRotation = v;
        }
    }

    constructor(game: Phaser.Game, x: number, y: number, rotation: ROTATION = ROTATION.N, key: string) {
        super(game, tileToCanvas(x, y).x, tileToCanvas(x, y).y);

        this.spriteKey = key;
        this.mapX = x;
        this.mapY = y;
        this.mapRotation = rotation;
    }

    get mapRotation() {
        return this._mapRotation;
    }

    mapMove([x, y]) {
        this.mapX = x;
        this.mapY = y;
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

    abstract nextAction(shift?: boolean): ACTION

    hasTag(tag) {
        return this.tags.indexOf(tag) > -1;
    }
}
