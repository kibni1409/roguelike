export type Orientation = 'left' | 'right';

export type EnemyType = 'bigZ' | 'littleZ' | 'middleZ';

export type Enemy = {
  x: number;
  y: number;
  id?: number;
  speed: number;
  zIndex: number;
  type: EnemyType;
  orientation: Orientation;
};

export type EnemyConfig = {
  width: number;
  height: number;
  zIndex: number;
  speedMin: number;
  speedMax: number;
  orientation: Orientation;
};
