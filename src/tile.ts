export type Tile = {
    x: number,
    y: number,
    type: TILE,
}

export enum TILE {
    WALL
}

export function isBlocker(t: Tile) {
    switch(t.type) {
        case TILE.WALL:
            return true;

        default:
            return false;
    }
}
