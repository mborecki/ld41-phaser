import { ACTION } from "../../../action";

export default function getActionSpriteKey(action: ACTION) : string {

    switch(action) {
        case ACTION.FORWARD:
            return 'action-forward';

        case ACTION.BACK:
            return 'action-back';

        case ACTION.TURN_LEFT:
            return 'action-left';

        case ACTION.TURN_RIGHT:
            return 'action-right';

        case ACTION.TURN_AROUND:
            return 'action-around';

    }
}
