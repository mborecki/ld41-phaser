import { ROTATION } from "./rotation";
import { ACTION } from "./action";

export default interface Actor{
    mapX: number,
    mapY: number,
    mapRotation: ROTATION,
    mapMove([x, y]: [number, number]): void;
    mapMoveDirection(ROTATION);
    nextAction(shift?: boolean): ACTION;

    hasTag(tag: TAG) : boolean;
}


export enum TAG {
    PLAYER,
    ENEMY,
    ROOTED
}
