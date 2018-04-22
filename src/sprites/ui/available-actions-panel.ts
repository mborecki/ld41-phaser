import { ACTION } from "../../action";
import getActionSpriteKey from "./action/get-action-sprite-key";
import ActionSprite from "./action/action-sprite";

export default class AvailableActionsPanel extends Phaser.Sprite {
    actions: Phaser.Group;
    onSelected = new Phaser.Signal();

    posibleMoves = [
        ACTION.FORWARD,
        ACTION.BACK,
        ACTION.LEFT,
        ACTION.RIGHT,
        ACTION.TURN_LEFT,
        ACTION.TURN_RIGHT,
        ACTION.TURN_AROUND,
        ACTION.SHOOT
    ]

    list : ACTION[];

    constructor(game: Phaser.Game) {
        super(game, 0, 0);

        this.actions = new Phaser.Group(this.game);
        this.addChild(this.actions);

        this.reroll()
    }

    reroll() {

        this.list = this.getActions();
        this.updateIcons();
    }

    getActions() : ACTION[] {

        let result = []


        while (result.length < 4) {
            let random = Math.floor((Math.random() * 8));

            if (result.indexOf(this.posibleMoves[random]) === -1) {
                result.push(this.posibleMoves[random])
            }
        }

        return result;


        // return [
        //     ACTION.FORWARD,
        //     ACTION.BACK,
        //     ACTION.LEFT,
        //     ACTION.RIGHT];
    }

    updateIcons() {
        this.actions.removeAll();

        this.list.forEach((action, index) => {
            let sprite = new ActionSprite(this.game, 11 + index * 40, 0, action);

            sprite.onSelected.add(() => {
                this.onSelected.dispatch(action)
            });

            this.actions.add(sprite);

        });
    }
}
