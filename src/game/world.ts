import type { Enemy, Bullet, Orientation, EnemyType } from '../shared';
import { generateEnemies } from '../shared';

import {
  PLAYER_MAX_HP,
  WAVE_BREAK_MS,
  INITIAL_FIELD_POSITION,
  getEnemyCountForWave,
  getEnemyHpForWave,
  FIELD_WIDTH,
  FIELD_HEIGHT,
} from './config';

export type GamePhase = 'fighting' | 'break' | 'gameover';

export type RuntimeEnemy = Enemy & {
  id: number;
  el: HTMLElement | null;
  imgEl: HTMLImageElement | null;
  flashUntil: number;
};

export type RuntimeBullet = Bullet & {
  el: HTMLElement | null;
};

export type PlayerRuntime = {
  isStep: boolean;
  orientation: Orientation;
  visualKey: string;
  el: HTMLElement | null;
  imgEl: HTMLImageElement | null;
};

export type ProgressState = {
  hp: number;
  maxHp: number;
  score: number;
  wave: number;
  skillPoints: number;
  phase: GamePhase;
  breakEndsAt: number | null;
  lastHitAt: number;
  lastShotAt: number;
};

type WorldListener = () => void;

type World = {
  enemies: Map<number, RuntimeEnemy>;
  bullets: Map<number, RuntimeBullet>;
  fieldPosition: { x: number; y: number };
  fieldEl: HTMLElement | null;
  player: PlayerRuntime;
  progress: ProgressState;
  nextBulletId: number;
  nextEnemyId: number;
};

const listeners = new Set<WorldListener>();
const playerListeners = new Set<WorldListener>();
const hudListeners = new Set<WorldListener>();

const createProgress = (): ProgressState => ({
  hp: PLAYER_MAX_HP,
  maxHp: PLAYER_MAX_HP,
  score: 0,
  wave: 1,
  skillPoints: 0,
  phase: 'fighting',
  breakEndsAt: null,
  lastHitAt: 0,
  lastShotAt: 0,
});

const spawnWaveEnemies = (wave: number, startId: number): Map<number, RuntimeEnemy> => {
  const map = new Map<number, RuntimeEnemy>();
  const count = getEnemyCountForWave(wave);
  const generated = generateEnemies(count, {
    startId,
    getHp: (type: EnemyType) => getEnemyHpForWave(type, wave),
  });

  for (const enemy of generated) {
    const id = enemy.id ?? startId + map.size;
    map.set(id, {
      ...enemy,
      id,
      el: null,
      imgEl: null,
      flashUntil: 0,
    });
  }

  return map;
};

export const world: World = {
  enemies: spawnWaveEnemies(1, 1),
  bullets: new Map(),
  fieldPosition: { ...INITIAL_FIELD_POSITION },
  fieldEl: null,
  player: {
    isStep: false,
    orientation: 'left',
    visualKey: 'left-stay',
    el: null,
    imgEl: null,
  },
  progress: createProgress(),
  nextBulletId: 1,
  nextEnemyId: getEnemyCountForWave(1) + 1,
};

export const subscribeWorld = (listener: WorldListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const subscribePlayer = (listener: WorldListener) => {
  playerListeners.add(listener);
  return () => {
    playerListeners.delete(listener);
  };
};

export const subscribeHud = (listener: WorldListener) => {
  hudListeners.add(listener);
  return () => {
    hudListeners.delete(listener);
  };
};

export const notifyWorld = () => {
  listeners.forEach(listener => listener());
};

export const notifyPlayer = () => {
  playerListeners.forEach(listener => listener());
};

export const notifyHud = () => {
  hudListeners.forEach(listener => listener());
};

export const getEnemyIds = (): number[] => {
  return Array.from(world.enemies.keys());
};

export const getBulletIds = (): number[] => {
  return Array.from(world.bullets.keys());
};

export const getEnemy = (id: number) => world.enemies.get(id);

export const getBullet = (id: number) => world.bullets.get(id);

export const getProgress = () => world.progress;

export const registerEnemyDom = (
  id: number,
  el: HTMLElement | null,
  imgEl: HTMLImageElement | null,
) => {
  const enemy = world.enemies.get(id);
  if (!enemy) return;
  enemy.el = el;
  enemy.imgEl = imgEl;
};

export const registerBulletDom = (id: number, el: HTMLElement | null) => {
  const bullet = world.bullets.get(id);
  if (!bullet) return;
  bullet.el = el;
};

export const registerFieldDom = (el: HTMLElement | null) => {
  world.fieldEl = el;
};

export const registerPlayerDom = (
  el: HTMLElement | null,
  imgEl: HTMLImageElement | null,
) => {
  world.player.el = el;
  world.player.imgEl = imgEl;
};

export const addBullet = (bullet: Omit<Bullet, 'id'> & { id?: number }) => {
  if (world.progress.phase === 'gameover') return null;

  const id = bullet.id ?? world.nextBulletId++;
  world.bullets.set(id, {
    ...bullet,
    id,
    el: null,
  });
  notifyWorld();
  return id;
};

export const removeBullet = (id: number) => {
  if (!world.bullets.delete(id)) return;
  notifyWorld();
};

export const removeEnemy = (id: number) => {
  if (!world.enemies.delete(id)) return;
  notifyWorld();
};

export const isBulletOutOfField = (bullet: Bullet) => {
  const margin = 50;
  return (
    bullet.x < -margin
    || bullet.y < -margin
    || bullet.x > FIELD_WIDTH + margin
    || bullet.y > FIELD_HEIGHT + margin
  );
};

export const getPlayerFieldPosition = (screenWidth: number, screenHeight: number) => {
  return {
    x: screenWidth / 2 - world.fieldPosition.x,
    y: screenHeight / 2 - world.fieldPosition.y,
  };
};

export const spendSkillPoint = (): boolean => {
  if (world.progress.skillPoints <= 0) return false;
  world.progress.skillPoints -= 1;
  notifyHud();
  return true;
};

export const startBreak = () => {
  world.progress.phase = 'break';
  world.progress.skillPoints += 1;
  world.progress.breakEndsAt = performance.now() + WAVE_BREAK_MS;
  notifyHud();
};

export const startNextWave = () => {
  world.progress.wave += 1;
  world.progress.phase = 'fighting';
  world.progress.breakEndsAt = null;

  const spawned = spawnWaveEnemies(world.progress.wave, world.nextEnemyId);
  world.nextEnemyId += spawned.size;

  for (const [id, enemy] of spawned) {
    world.enemies.set(id, enemy);
  }

  notifyWorld();
  notifyHud();
};

export const setGameOver = () => {
  world.progress.phase = 'gameover';
  world.progress.breakEndsAt = null;
  world.bullets.clear();
  notifyWorld();
  notifyHud();
};

export const resetGame = () => {
  world.enemies = spawnWaveEnemies(1, 1);
  world.bullets.clear();
  world.fieldPosition = { ...INITIAL_FIELD_POSITION };
  world.player.isStep = false;
  world.player.orientation = 'left';
  world.player.visualKey = 'left-stay';
  world.progress = createProgress();
  world.nextBulletId = 1;
  world.nextEnemyId = getEnemyCountForWave(1) + 1;

  if (world.fieldEl) {
    world.fieldEl.style.transform
      = `translate(${world.fieldPosition.x}px, ${world.fieldPosition.y}px)`;
  }

  if (world.player.el) {
    world.player.el.style.opacity = '1';
    world.player.el.style.filter = '';
  }

  notifyWorld();
  notifyHud();
  notifyPlayer();
};
