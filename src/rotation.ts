export enum ROTATION {
    N, E, S, W
}

export enum TURN {
    LEFT,
    RIGHT,
    AROUND
}

export function turn(rot: ROTATION, turn: TURN): ROTATION {
    switch(rot) {
        case ROTATION.N:
            switch(turn) {
                case TURN.LEFT:
                    return ROTATION.W;

                case TURN.RIGHT:
                    return ROTATION.E;

                case TURN.AROUND:
                    return ROTATION.S;
            }
        case ROTATION.E:
            switch(turn) {
                case TURN.LEFT:
                    return ROTATION.N;

                case TURN.RIGHT:
                    return ROTATION.S;

                case TURN.AROUND:
                    return ROTATION.W;
            }
        case ROTATION.S:
            switch(turn) {
                case TURN.LEFT:
                    return ROTATION.E;

                case TURN.RIGHT:
                    return ROTATION.W;

                case TURN.AROUND:
                    return ROTATION.N;
            }
        case ROTATION.W:
            switch(turn) {
                case TURN.LEFT:
                    return ROTATION.S;

                case TURN.RIGHT:
                    return ROTATION.N;

                case TURN.AROUND:
                    return ROTATION.E;
            }
    }
}
