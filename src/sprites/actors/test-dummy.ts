import Enemy from "./enemy";
import { ACTION } from "../../action";

export default class TestDummy extends Enemy {
    constructor(game, x, y, rotation) {
        super(game, x, y, rotation, 'test-dummy');

        this.tags.push(...[]);
    }

    nextAction(shift?: boolean): ACTION {
        return ACTION.FORWARD;
    }
}
