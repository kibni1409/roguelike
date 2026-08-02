import {
  MOVE_STEP,
  FIELD_WIDTH,
  FIELD_HEIGHT,
  FIELD_MIN_X,
  FIELD_MAX_X,
  FIELD_MIN_Y,
  FIELD_MAX_Y,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  INITIAL_FIELD_POSITION,
} from '../game/config';

/** @deprecated Prefer importing constants from `game/config`. */
export const useScreenParams = () => {
  return {
    maxY: FIELD_MAX_Y,
    minY: FIELD_MIN_Y,
    maxX: FIELD_MAX_X,
    minX: FIELD_MIN_X,
    moveStep: MOVE_STEP,
    fieldWidth: FIELD_WIDTH,
    fieldHeight: FIELD_HEIGHT,
    screenWidth: SCREEN_WIDTH,
    screenHeight: SCREEN_HEIGHT,
    initialPosition: INITIAL_FIELD_POSITION,
  };
};
