import { giftsBigZ, gifsPlayer, giftsLittleZ, giftsMiddleZ } from '../assets';
import { useSpecifications } from '../model/specifications/useSpecifications';
import type { EnemyType, Orientation } from '../shared';

import {
  MOVE_STEP,
  FIELD_MIN_X,
  FIELD_MAX_X,
  FIELD_MIN_Y,
  FIELD_MAX_Y,
  SCREEN_WIDTH,
  BULLET_DAMAGE,
  SCREEN_HEIGHT,
  PLAYER_HITBOX,
  PLAYER_HIT_DAMAGE,
  PLAYER_HIT_COOLDOWN_MS,
  ENEMY_KNOCKBACK,
  ENEMY_SCORE,
  FIELD_WIDTH,
  FIELD_HEIGHT,
} from './config';
import { isColliding, buildEnemyGrid, getNearbyEnemies } from './collisions';
import { attachInput, detachInput, getPressedKeys, hasPressedMovementKeys } from './input';
import {
  world,
  notifyHud,
  notifyWorld,
  notifyPlayer,
  startBreak,
  setGameOver,
  startNextWave,
  isBulletOutOfField,
  getPlayerFieldPosition,
  type RuntimeEnemy,
  type RuntimeBullet,
} from './world';

const enemyGifs: Record<EnemyType, typeof giftsLittleZ> = {
  bigZ: giftsBigZ,
  littleZ: giftsLittleZ,
  middleZ: giftsMiddleZ,
};

let rafId: number | null = null;
let running = false;

const syncFieldDom = () => {
  if (world.fieldEl) {
    world.fieldEl.style.transform
      = `translate(${world.fieldPosition.x}px, ${world.fieldPosition.y}px)`;
  }
};

const syncEnemyDom = (enemy: RuntimeEnemy, now: number) => {
  if (enemy.el) {
    enemy.el.style.left = `${enemy.x}px`;
    enemy.el.style.top = `${enemy.y}px`;
    enemy.el.style.zIndex = String(enemy.zIndex);
  }
  if (enemy.imgEl) {
    enemy.imgEl.style.filter = now < enemy.flashUntil
      ? 'brightness(2.8) saturate(0.2)'
      : '';
  }
};

const syncBulletDom = (bullet: RuntimeBullet) => {
  if (bullet.el) {
    bullet.el.style.left = `${bullet.x - bullet.size / 2}px`;
    bullet.el.style.top = `${bullet.y - bullet.size / 2}px`;
  }
};

const spawnHitFlash = (x: number, y: number) => {
  if (!world.fieldEl) return;

  const flash = document.createElement('div');
  flash.style.position = 'absolute';
  flash.style.left = `${x - 6}px`;
  flash.style.top = `${y - 6}px`;
  flash.style.width = '12px';
  flash.style.height = '12px';
  flash.style.background = '#fff8a8';
  flash.style.border = '2px solid #ffcf33';
  flash.style.borderRadius = '0';
  flash.style.pointerEvents = 'none';
  flash.style.zIndex = '2000';
  flash.style.imageRendering = 'pixelated';
  flash.style.opacity = '1';
  flash.style.transition = 'opacity 120ms linear, transform 120ms linear';
  flash.style.transform = 'scale(1)';

  world.fieldEl.appendChild(flash);

  requestAnimationFrame(() => {
    flash.style.opacity = '0';
    flash.style.transform = 'scale(1.8)';
  });

  window.setTimeout(() => {
    flash.remove();
  }, 140);
};

const updatePlayerVisual = () => {
  const { player } = world;
  if (!player.imgEl) return;
  const pose = player.isStep ? 'run' : 'stay';
  const visualKey = `${player.orientation}-${pose}`;
  if (player.visualKey === visualKey) return;
  player.visualKey = visualKey;
  player.imgEl.src = gifsPlayer[player.orientation][pose];
};

const syncPlayerHurtFlash = (now: number) => {
  const { player, progress } = world;
  if (!player.el) return;

  const inCooldown = progress.lastHitAt > 0
    && now - progress.lastHitAt < PLAYER_HIT_COOLDOWN_MS
    && progress.phase !== 'gameover';

  if (!inCooldown) {
    player.el.style.opacity = '1';
    player.el.style.filter = '';
    return;
  }

  const blinkOff = Math.floor(now / 80) % 2 === 0;
  player.el.style.opacity = blinkOff ? '0.25' : '1';
  player.el.style.filter = blinkOff ? '' : 'brightness(1.4)';
};

const updateEnemyOrientationVisual = (enemy: RuntimeEnemy, orientation: Orientation) => {
  if (enemy.orientation === orientation) return;
  enemy.orientation = orientation;
  if (enemy.imgEl) {
    enemy.imgEl.src = enemyGifs[enemy.type][orientation].run;
  }
};

const isEnemyTouchingPlayer = (
  enemy: RuntimeEnemy,
  playerX: number,
  playerY: number,
) => {
  return (
    enemy.x < playerX + PLAYER_HITBOX
    && enemy.x + enemy.width > playerX - PLAYER_HITBOX
    && enemy.y < playerY + PLAYER_HITBOX
    && enemy.y + enemy.height > playerY - PLAYER_HITBOX
  );
};

const knockbackTouchingEnemies = (
  playerX: number,
  playerY: number,
  now: number,
) => {
  for (const enemy of world.enemies.values()) {
    if (!isEnemyTouchingPlayer(enemy, playerX, playerY)) continue;

    const cx = enemy.x + enemy.width / 2;
    const cy = enemy.y + enemy.height / 2;
    let dx = cx - playerX;
    let dy = cy - playerY;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.001) {
      const angle = Math.random() * Math.PI * 2;
      dx = Math.cos(angle);
      dy = Math.sin(angle);
      dist = 1;
    }

    enemy.x += (dx / dist) * ENEMY_KNOCKBACK;
    enemy.y += (dy / dist) * ENEMY_KNOCKBACK;
    enemy.x = Math.max(0, Math.min(FIELD_WIDTH - enemy.width, enemy.x));
    enemy.y = Math.max(0, Math.min(FIELD_HEIGHT - enemy.height, enemy.y));
    enemy.flashUntil = now + 120;
    syncEnemyDom(enemy, now);
  }
};

const tickFieldMovement = () => {
  if (world.progress.phase === 'gameover') return;

  const keys = getPressedKeys();
  const speed = useSpecifications.getState().speed;
  const step = MOVE_STEP + speed / 2;
  let { x, y } = world.fieldPosition;
  let moved = false;
  let orientationChanged = false;
  let stepChanged = false;

  if (keys.KeyS) {
    y -= step;
    moved = true;
  }
  if (keys.KeyW) {
    y += step;
    moved = true;
  }
  if (keys.KeyD) {
    x -= step;
    moved = true;
    if (world.player.orientation !== 'right') {
      world.player.orientation = 'right';
      orientationChanged = true;
    }
  }
  if (keys.KeyA) {
    x += step;
    moved = true;
    if (world.player.orientation !== 'left') {
      world.player.orientation = 'left';
      orientationChanged = true;
    }
  }

  x = Math.max(FIELD_MIN_X, Math.min(FIELD_MAX_X, x));
  y = Math.max(FIELD_MIN_Y, Math.min(FIELD_MAX_Y, y));

  world.fieldPosition.x = x;
  world.fieldPosition.y = y;

  const isStep = hasPressedMovementKeys();
  if (world.player.isStep !== isStep) {
    world.player.isStep = isStep;
    stepChanged = true;
  }

  if (moved) {
    syncFieldDom();
  }

  if (orientationChanged || stepChanged) {
    updatePlayerVisual();
    notifyPlayer();
  }
};

const tickEnemies = (now: number) => {
  if (world.progress.phase === 'gameover') return;

  const { x: playerX, y: playerY } = getPlayerFieldPosition(SCREEN_WIDTH, SCREEN_HEIGHT);
  let touchedPlayer = false;

  for (const enemy of world.enemies.values()) {
    const enemyCenterX = enemy.x + enemy.width / 2;
    const enemyCenterY = enemy.y + enemy.height / 2;
    const dx = playerX - enemyCenterX;
    const dy = playerY - enemyCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const orientation: Orientation = enemyCenterX < playerX ? 'right' : 'left';

    updateEnemyOrientationVisual(enemy, orientation);

    if (distance > 1) {
      enemy.x += (dx / distance) * enemy.speed;
      enemy.y += (dy / distance) * enemy.speed;
    }

    enemy.zIndex = Math.floor(enemy.y + enemy.height) + 2;
    syncEnemyDom(enemy, now);

    if (
      world.progress.phase === 'fighting'
      && isEnemyTouchingPlayer(enemy, playerX, playerY)
    ) {
      touchedPlayer = true;
    }
  }

  if (
    touchedPlayer
    && world.progress.phase === 'fighting'
    && now - world.progress.lastHitAt >= PLAYER_HIT_COOLDOWN_MS
  ) {
    world.progress.lastHitAt = now;
    world.progress.hp = Math.max(0, world.progress.hp - PLAYER_HIT_DAMAGE);
    knockbackTouchingEnemies(playerX, playerY, now);
    notifyHud();

    if (world.progress.hp <= 0) {
      setGameOver();
    }
  }
};

const tickBulletsAndCollisions = (now: number) => {
  if (world.progress.phase === 'gameover') {
    if (world.bullets.size > 0) {
      world.bullets.clear();
      notifyWorld();
    }
    return;
  }

  if (world.bullets.size === 0) return;

  const attack = useSpecifications.getState().attack;
  const damage = BULLET_DAMAGE + attack * 5;
  const grid = buildEnemyGrid(world.enemies.values());
  const deadBulletIds: number[] = [];
  const deadEnemyIds: Set<number> = new Set();
  let scoreGained = 0;

  for (const bullet of world.bullets.values()) {
    bullet.x += bullet.speedX;
    bullet.y += bullet.speedY;

    if (isBulletOutOfField(bullet)) {
      deadBulletIds.push(bullet.id);
      continue;
    }

    let hit = false;
    const nearby = getNearbyEnemies(grid, bullet.x, bullet.y);

    for (const nearbyEnemy of nearby) {
      if (deadEnemyIds.has(nearbyEnemy.id)) continue;
      if (!isColliding(bullet, nearbyEnemy)) continue;

      const enemy = world.enemies.get(nearbyEnemy.id);
      if (!enemy) continue;

      enemy.hp -= damage;
      enemy.flashUntil = now + 140;
      spawnHitFlash(bullet.x, bullet.y);
      hit = true;

      if (enemy.hp <= 0) {
        deadEnemyIds.add(enemy.id);
        scoreGained += ENEMY_SCORE[enemy.type];
      }
      break;
    }

    if (hit) {
      deadBulletIds.push(bullet.id);
    }
    else {
      syncBulletDom(bullet);
    }
  }

  for (const id of deadBulletIds) {
    world.bullets.delete(id);
  }
  for (const id of deadEnemyIds) {
    world.enemies.delete(id);
  }

  if (scoreGained > 0) {
    world.progress.score += scoreGained;
    notifyHud();
  }

  if (deadBulletIds.length > 0 || deadEnemyIds.size > 0) {
    notifyWorld();
  }
};

const tickWaveFlow = () => {
  const { progress } = world;

  if (progress.phase === 'fighting' && world.enemies.size === 0) {
    startBreak();
    return;
  }

  if (
    progress.phase === 'break'
    && progress.breakEndsAt !== null
    && performance.now() >= progress.breakEndsAt
  ) {
    startNextWave();
  }
};

const tick = () => {
  const now = performance.now();
  tickFieldMovement();
  tickEnemies(now);
  tickBulletsAndCollisions(now);
  tickWaveFlow();
  syncPlayerHurtFlash(now);
  rafId = requestAnimationFrame(tick);
};

export const startGameLoop = () => {
  if (running) return;
  running = true;
  attachInput();
  syncFieldDom();
  updatePlayerVisual();
  rafId = requestAnimationFrame(tick);
};

export const stopGameLoop = () => {
  running = false;
  detachInput();
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};
