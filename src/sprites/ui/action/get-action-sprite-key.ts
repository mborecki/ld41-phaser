import { ACTION } from "../../../action";

export default function getActionSpriteKey(action: ACTION): string {

    switch (action) {
        case ACTION.FORWARD:
            return 'action-forward';

        case ACTION.BACK:
            return 'action-back';

        case ACTION.TURN_LEFT:
            return 'action-turn-left';

        case ACTION.TURN_RIGHT:
            return 'action-turn-right';

        case ACTION.TURN_AROUND:
            return 'action-around';

        case ACTION.SHOOT:
            return 'action-shoot';

        case ACTION.LEFT:
            return 'action-left';

        case ACTION.RIGHT:
            return 'action-right';

    }
}
