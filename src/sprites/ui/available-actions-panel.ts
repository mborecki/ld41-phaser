import { ACTION } from "../../action";
import getActionSpriteKey from "./action/get-action-sprite-key";
import ActionSprite from "./action/action-sprite";

export default class AvailableActionsPanel extends Phaser.Sprite {
    onSelected = new Phaser.Signal();

    constructor(game: Phaser.Game) {
        super(game, 0, 0);

        this.addChild(new Phaser.Text(game, 0, 0, 'AvailableActionsPanel'))

        this.initActionsList();
    }

    initActionsList() {

        let list = [
            ACTION.FORWARD,
            ACTION.BACK,
            ACTION.LEFT,
            ACTION.RIGHT,
            ACTION.TURN_LEFT,
            ACTION.TURN_RIGHT,
            ACTION.TURN_AROUND,
            ACTION.SHOOT
        ]

        list.forEach((action, index) => {
            let sprite = new ActionSprite(this.game, 10 + index*20, 50, action);

            sprite.onSelected.add(() => {
                this.onSelected.dispatch(action)
            });

            this.addChild(sprite);

        });
    }
}
