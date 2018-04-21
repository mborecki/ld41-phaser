import { MAP_OFFSET_X, TILE_WIDTH, MAP_OFFSET_Y, TILE_HEIGHT } from "./config";

export default function tileToCanvas(x: number, y: number) : {x: number, y: number}{
    return {
        x: MAP_OFFSET_X + x * TILE_WIDTH,
        y: MAP_OFFSET_Y + y * TILE_HEIGHT
    }
}
