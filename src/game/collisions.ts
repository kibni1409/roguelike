import type { Enemy, Bullet } from '../shared';

import { SPATIAL_CELL } from './config';

export const isColliding = (bullet: Bullet, enemy: Enemy): boolean => {
  const bulletRadius = bullet.size / 2;

  // enemy.x/y — левый верхний угол спрайта (как в DOM)
  return (
    bullet.x + bulletRadius > enemy.x
    && bullet.x - bulletRadius < enemy.x + enemy.width
    && bullet.y + bulletRadius > enemy.y
    && bullet.y - bulletRadius < enemy.y + enemy.height
  );
};

type SpatialEnemy = Enemy & { id: number };

/** Builds a coarse grid so each bullet only checks nearby enemies. */
export const buildEnemyGrid = (enemies: Iterable<SpatialEnemy>) => {
  const grid = new Map<string, SpatialEnemy[]>();

  for (const enemy of enemies) {
    const cellX = Math.floor(enemy.x / SPATIAL_CELL);
    const cellY = Math.floor(enemy.y / SPATIAL_CELL);
    const key = `${cellX},${cellY}`;
    const bucket = grid.get(key);
    if (bucket) {
      bucket.push(enemy);
    }
    else {
      grid.set(key, [enemy]);
    }
  }

  return grid;
};

export const getNearbyEnemies = (
  grid: Map<string, SpatialEnemy[]>,
  x: number,
  y: number,
): SpatialEnemy[] => {
  const cellX = Math.floor(x / SPATIAL_CELL);
  const cellY = Math.floor(y / SPATIAL_CELL);
  const result: SpatialEnemy[] = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const bucket = grid.get(`${cellX + dx},${cellY + dy}`);
      if (bucket) {
        result.push(...bucket);
      }
    }
  }

  return result;
};
