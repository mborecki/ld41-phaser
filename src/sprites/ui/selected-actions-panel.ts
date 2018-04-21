import { ACTION } from "../../action";
import ActionSprite from "./action/action-sprite";
import { ACTIONS_PER_TURN } from "../../config";

export default class SelectedActionsPanel extends Phaser.Sprite {

    confirmButton: Phaser.Text;
    actionSpriteList: Phaser.Group;
    actions: ACTION[] = [];

    onConfirmed = new Phaser.Signal();

    constructor(game: Phaser.Game) {
        super(game, 0, 0);
        this.addChild(new Phaser.Text(game,0,0,'SelectedActionsPanel'))

        this.actionSpriteList = new Phaser.Group(this.game, this);

        this.confirmButton = new Phaser.Text(this.game, 300, 50, 'OK!');
        this.confirmButton.inputEnabled = true;
        this.addChild(this.confirmButton);

        this.confirmButton.events.onInputDown.add(() => {
            if (this.confirmButton.visible) {
                this.onConfirmed.dispatch(this.actions);
            } else {
                throw 'Confirm Button invisible!';
            }
        });

        this.updateList();
    }

    clearList() {
        this.actions = [];
        this.updateList();
    }

    addAction(action: ACTION) {
        if (this.actions.length < ACTIONS_PER_TURN) {
            this.actions.push(action);
            this.updateList();
        }
    }

    updateList() {
        this.actionSpriteList.removeAll(true);

        this.actions.forEach((action, index) => {
            let sprite = new ActionSprite(this.game, 10 + index*20, 50, action);

            sprite.onSelected.add(() => {
                this.actions.splice(index, 1);
                this.updateList();
            });

            this.actionSpriteList.add(sprite);

        });

        this.confirmButton.visible = this.actions.length === ACTIONS_PER_TURN;
    }
}
