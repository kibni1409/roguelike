export type Orientation = 'left' | 'right';

export type EnemyType = 'bigZ' | 'littleZ' | 'middleZ';

export type Enemy = {
  x: number;
  y: number;
  hp: number;
  id?: number;
  width: number;
  speed: number;
  height: number;
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

export type Bullet = {
  x: number;
  y: number;
  id: number;
  size: number;
  speedX: number;
  speedY: number;
  zIndex: number;
};

export type Position = {
  x: number;
  y: number;
};
