import { ROTATION } from "./rotation";
import { ACTION } from "./action";

export default interface Actor{
    mapX: number,
    mapY: number,
    mapRotation: ROTATION,
    mapMove([x, y]: [number, number]): void
    nextAction(shift?: boolean): ACTION;
}
