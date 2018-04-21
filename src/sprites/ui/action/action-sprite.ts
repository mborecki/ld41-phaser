import { ACTION } from "../../../action";
import getActionSpriteKey from "./get-action-sprite-key";

export default class ActionSprite extends Phaser.Sprite {

    onSelected = new Phaser.Signal();

    constructor(game: Phaser.Game, x: number, y: number, action: ACTION) {
        super(game, x, y, getActionSpriteKey(action));

        this.inputEnabled = true;

        this.events.onInputDown.add(() => {
            this.onSelected.dispatch(action);
        });
    }
}
