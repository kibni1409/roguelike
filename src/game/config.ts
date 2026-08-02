export const FIELD_WIDTH = 2000;
export const FIELD_HEIGHT = 2000;
export const SCREEN_WIDTH = 900;
export const SCREEN_HEIGHT = 800;
export const MOVE_STEP = 1;
export const BULLET_SPEED = 5;
export const BULLET_DAMAGE = 10;
export const BULLET_SIZE = 8;
export const SPATIAL_CELL = 100;

export const BASE_RELOAD_MS = 450;
export const RELOAD_REDUCTION_PER_LEVEL = 50;
export const MIN_RELOAD_MS = 120;

export const PLAYER_MAX_HP = 100;
export const PLAYER_HIT_DAMAGE = 10;
export const PLAYER_HIT_COOLDOWN_MS = 1000;
export const PLAYER_HITBOX = 40;
export const ENEMY_KNOCKBACK = 110;

export const WAVE_BREAK_MS = 10_000;
export const INITIAL_ENEMY_COUNT = 5;
export const ENEMIES_PER_WAVE_GROWTH = 3;

export const ENEMY_BASE_HP: Record<'littleZ' | 'middleZ' | 'bigZ', number> = {
  littleZ: 20,
  middleZ: 40,
  bigZ: 70,
};

/** Extra HP added per wave after the first */
export const ENEMY_HP_PER_WAVE = 10;

export const ENEMY_SCORE: Record<'littleZ' | 'middleZ' | 'bigZ', number> = {
  littleZ: 10,
  middleZ: 25,
  bigZ: 50,
};

export const INITIAL_FIELD_POSITION = { x: -100, y: -100 };

export const FIELD_MAX_X = -20;
export const FIELD_MIN_X = -(FIELD_WIDTH - SCREEN_WIDTH) - FIELD_MAX_X;
export const FIELD_MAX_Y = -20;
export const FIELD_MIN_Y = -(FIELD_HEIGHT - SCREEN_HEIGHT) - FIELD_MAX_Y;

export const getEnemyCountForWave = (wave: number) => {
  return INITIAL_ENEMY_COUNT + (wave - 1) * ENEMIES_PER_WAVE_GROWTH;
};

export const getEnemyHpForWave = (
  type: keyof typeof ENEMY_BASE_HP,
  wave: number,
) => {
  return ENEMY_BASE_HP[type] + (wave - 1) * ENEMY_HP_PER_WAVE;
};

export const getReloadMs = (reloadLevel: number) => {
  return Math.max(
    MIN_RELOAD_MS,
    BASE_RELOAD_MS - reloadLevel * RELOAD_REDUCTION_PER_LEVEL,
  );
};
