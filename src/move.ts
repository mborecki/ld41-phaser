import { ROTATION } from "./rotation";

export function moveForward([x,y]: [number, number], rotation: ROTATION) : [number, number] {
    switch(rotation) {
        case ROTATION.N:
            return [x, y-1];

        case ROTATION.E:
            return [x+1, y];

        case ROTATION.S:
            return [x, y+1];

        case ROTATION.W:
            return [x-1, y];
    }
}

export function moveBack([x,y]: [number, number], rotation: ROTATION) : [number, number] {
    switch(rotation) {
        case ROTATION.N:
            return [x, y+1];

        case ROTATION.E:
            return [x-1, y];

        case ROTATION.S:
            return [x, y-1];

        case ROTATION.W:
            return [x+1, y];
    }
}

export function moveLeft([x,y]: [number, number], rotation: ROTATION) : [number, number] {
    switch(rotation) {
        case ROTATION.N:
            return [x-1, y];

        case ROTATION.E:
            return [x, y-1];

        case ROTATION.S:
            return [x+1, y];

        case ROTATION.W:
            return [x, y+1];
    }
}

export function moveRight([x,y]: [number, number], rotation: ROTATION) : [number, number] {
    switch(rotation) {
        case ROTATION.N:
            return [x+1, y];

        case ROTATION.E:
            return [x, y+1];

        case ROTATION.S:
            return [x-1, y];

        case ROTATION.W:
            return [x, y-1];
    }
}
