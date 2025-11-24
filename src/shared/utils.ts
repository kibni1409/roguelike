import _ from 'lodash';

import type { Enemy, EnemyType, EnemyConfig } from './types.ts';

const enemyConfigs: Record<EnemyType, EnemyConfig> = {
  littleZ: {
    width: 70,
    zIndex: 2,
    height: 70,
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

const getSize = (type: EnemyType) => {
  return {
    width: enemyConfigs[type].width,
    height: enemyConfigs[type].height,
  };
};

export const generateEnemies = (numEnemies: number): Enemy[] => {
  const enemies: Enemy[] = [];
  const FIELD_SIZE = 2000;
  const types: EnemyType[] = ['bigZ', 'littleZ', 'middleZ'];

  for (let i = 0; i < numEnemies; i++) {
    const type = _.sample(types) || 'littleZ';
    const config = enemyConfigs[type];
    const size = getSize(type);

    const speed = randomInRange(config.speedMin, config.speedMax);

    const x = randomInRange(0, FIELD_SIZE - size.width);
    const y = randomInRange(0, FIELD_SIZE - size.height);

    enemies.push({
      x,
      y,
      type,
      speed,
      id: i + 1,
      zIndex: config.zIndex,
      orientation: config.orientation,
    });
  }

  return enemies;
};
