import _ from 'lodash';

import type { Enemy, Bullet, EnemyType, EnemyConfig } from './types.ts';

const enemyConfigs: Record<EnemyType, EnemyConfig> = {
  littleZ: {
    width: 45,
    zIndex: 2,
    height: 45,
    speedMin: 2,
    speedMax: 2.5,
    orientation: 'left',
  },
  bigZ: {
    zIndex: 2,
    width: 100,
    height: 100,
    speedMin: 0.8,
    speedMax: 1.1,
    orientation: 'left',
  },
  middleZ: {
    width: 75,
    zIndex: 2,
    height: 75,
    speedMin: 1.2,
    speedMax: 1.5,
    orientation: 'left',
  },
};

const randomInRange = (min: number, max: number) => _.random() * (max - min) + min;

const spawnPoints = [
  { x: 0, y: 0 },
  { y: 0, x: 500 },
  { y: 0, x: 1000 },
  { y: 0, x: 1500 },
  { y: 0, x: 2000 },
  { y: 500, x: 2000 },
  { x: 2000, y: 1000 },
  { x: 2000, y: 1500 },
  { x: 1500, y: 2000 },
  { x: 1000, y: 2000 },
  { x: 500, y: 2000 },
  { x: 0, y: 2000 },
  { x: 0, y: 1500 },
  { x: 0, y: 1000 },
  { x: 0, y: 500 },
];

export const getSize = (type: EnemyType) => {
  return {
    width: enemyConfigs[type].width,
    height: enemyConfigs[type].height,
  };
};

type GenerateOptions = {
  startId?: number;
  getHp?: (type: EnemyType) => number;
};

export const generateEnemies = (
  numEnemies: number,
  options: GenerateOptions = {},
): Enemy[] => {
  const { startId = 1, getHp = () => 20 } = options;
  const enemies: Enemy[] = [];
  const FIELD_SIZE = 2000;
  const types: EnemyType[] = ['littleZ', 'middleZ', 'bigZ'];

  for (let i = 0; i < numEnemies; i++) {
    const type = _.sample(types) || 'littleZ';
    const config = enemyConfigs[type];
    const size = getSize(type);
    const speed = randomInRange(config.speedMin, config.speedMax);

    const spawnPoint = _.sample(spawnPoints)!;
    const x = Math.max(0, Math.min(spawnPoint.x, FIELD_SIZE - size.width));
    const y = Math.max(0, Math.min(spawnPoint.y, FIELD_SIZE - size.height));

    enemies.push({
      ...getSize(type),
      x,
      y,
      type,
      speed,
      hp: getHp(type),
      id: startId + i,
      zIndex: config.zIndex,
      orientation: config.orientation,
    });
  }

  return enemies;
};

export const isColliding = (bullet: Bullet, enemy: Enemy): boolean => {
  const bulletRadius = bullet.size / 2;

  return (
    bullet.x + bulletRadius > enemy.x
    && bullet.x - bulletRadius < enemy.x + enemy.width
    && bullet.y + bulletRadius > enemy.y
    && bullet.y - bulletRadius < enemy.y + enemy.height
  );
};
