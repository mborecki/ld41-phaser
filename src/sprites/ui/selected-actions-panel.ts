import { ACTION } from "../../action";
import ActionSprite from "./action/action-sprite";
import { ACTIONS_PER_TURN } from "../../config";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export default class SelectedActionsPanel extends Phaser.Sprite {

    confirmButton: Phaser.Sprite;
    actionSpriteList: Phaser.Group;
    actions: ACTION[] = [];

    readyToConfirm = new BehaviorSubject<boolean>(false);

    onConfirmed = new Phaser.Signal();

    constructor(game: Phaser.Game) {
        super(game, 0, 0);

        this.actionSpriteList = new Phaser.Group(this.game, this);

        this.confirmButton = new Phaser.Sprite(this.game, -79, 2, 'confirm-button');
        this.confirmButton.inputEnabled = true;
        this.addChild(this.confirmButton);

        this.confirmButton.events.onInputDown.add(() => {
            if (this.readyToConfirm.getValue()) {
                this.onConfirmed.dispatch(this.actions);
            }
        });

        this.readyToConfirm.subscribe(ready => {
            if (ready) {
                this.confirmButton.frame = 0;
                this.confirmButton.input.useHandCursor = true;
            } else {
                this.confirmButton.frame = 2;
                this.confirmButton.input.useHandCursor = false;
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
            let sprite = new ActionSprite(this.game, 10 + index * 40, 0, action);

            sprite.onSelected.add(() => {
                this.actions.splice(index, 1);
                this.updateList();
            });

            this.actionSpriteList.add(sprite);

        });

        this.readyToConfirm.next(this.actions.length === ACTIONS_PER_TURN);
    }
}
