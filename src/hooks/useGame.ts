import { useEffect, useSyncExternalStore } from 'react';

import {
  world,
  addBullet,
  getEnemyIds,
  getBulletIds,
  getProgress,
  getReloadMs,
  subscribeHud,
  subscribeWorld,
  startGameLoop,
  stopGameLoop,
  getPlayerFieldPosition,
  BULLET_SIZE,
  BULLET_SPEED,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  type ProgressState,
} from '../game';
import { useSpecifications } from '../model/specifications';

const subscribeEntities = (onStoreChange: () => void) => subscribeWorld(onStoreChange);
const subscribeProgress = (onStoreChange: () => void) => subscribeHud(onStoreChange);

let cachedEnemyIds = getEnemyIds();
let cachedBulletIds = getBulletIds();
let cachedEnemyKey = cachedEnemyIds.join(',');
let cachedBulletKey = cachedBulletIds.join(',');

let cachedHud: ProgressState = { ...getProgress() };
let cachedHudKey = '';

const getHudKey = (progress: ProgressState) => {
  return [
    progress.hp,
    progress.maxHp,
    progress.score,
    progress.wave,
    progress.skillPoints,
    progress.phase,
    progress.breakEndsAt ?? 0,
  ].join(':');
};

cachedHudKey = getHudKey(cachedHud);

const getCachedEnemyIds = () => {
  const next = getEnemyIds();
  const key = next.join(',');
  if (key !== cachedEnemyKey) {
    cachedEnemyIds = next;
    cachedEnemyKey = key;
  }
  return cachedEnemyIds;
};

const getCachedBulletIds = () => {
  const next = getBulletIds();
  const key = next.join(',');
  if (key !== cachedBulletKey) {
    cachedBulletIds = next;
    cachedBulletKey = key;
  }
  return cachedBulletIds;
};

const getCachedHud = () => {
  const next = getProgress();
  const key = getHudKey(next);
  if (key !== cachedHudKey) {
    cachedHud = { ...next };
    cachedHudKey = key;
  }
  return cachedHud;
};

export const shoot = (targetX: number, targetY: number) => {
  if (world.progress.phase === 'gameover') return;

  const specs = useSpecifications.getState();
  const now = performance.now();
  const reloadMs = getReloadMs(specs.reload);

  if (now - world.progress.lastShotAt < reloadMs) return;

  const { x: fieldX, y: fieldY } = world.fieldPosition;
  const player = getPlayerFieldPosition(SCREEN_WIDTH, SCREEN_HEIGHT);
  const speed = BULLET_SPEED + specs.range * 0.5;

  const fieldTargetX = targetX - fieldX;
  const fieldTargetY = targetY - fieldY;
  const dx = fieldTargetX - player.x;
  const dy = fieldTargetY - player.y;
  const angle = Math.atan2(dy, dx);

  const id = addBullet({
    size: BULLET_SIZE,
    zIndex: 1000,
    x: player.x,
    y: player.y,
    speedX: Math.cos(angle) * speed,
    speedY: Math.sin(angle) * speed,
  });

  if (id !== null) {
    world.progress.lastShotAt = now;
  }
};

export const useGameLoop = () => {
  useEffect(() => {
    startGameLoop();
    return () => stopGameLoop();
  }, []);
};

export const useEnemyIds = () => {
  return useSyncExternalStore(subscribeEntities, getCachedEnemyIds, getCachedEnemyIds);
};

export const useBulletIds = () => {
  return useSyncExternalStore(subscribeEntities, getCachedBulletIds, getCachedBulletIds);
};

export const useHud = () => {
  return useSyncExternalStore(subscribeProgress, getCachedHud, getCachedHud);
};

/** Break countdown in whole seconds remaining (for UI). */
export const useBreakCountdown = () => {
  return useSyncExternalStore(
    (onStoreChange) => {
      const unsubHud = subscribeHud(onStoreChange);
      const id = window.setInterval(onStoreChange, 200);
      return () => {
        unsubHud();
        window.clearInterval(id);
      };
    },
    () => {
      const { phase, breakEndsAt } = getProgress();
      if (phase !== 'break' || breakEndsAt === null) return 0;
      return Math.max(0, Math.ceil((breakEndsAt - performance.now()) / 1000));
    },
    () => 0,
  );
};
