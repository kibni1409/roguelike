import { useRef, useEffect, useCallback } from 'react';

import type { Bullet } from '../shared';
import { useShootWrapper } from '../model/shoot';

import { useScreenParams } from './useScreenParams.ts';
import { useKeyboardControls } from './useKeyboardControls.ts';

export const useBullets = () => {
  const bullets = useShootWrapper('bullets');
  const setBullets = useShootWrapper('setBullets');
  const animateBullets = useShootWrapper('animateBullets');
  const { screenWidth, screenHeight } = useScreenParams();
  const { position } = useKeyboardControls();
  const bulletSpeed = 5;
  const rafRef = useRef<null | number>(null);

  const playerFieldX = screenWidth / 2 - position.x;
  const playerFieldY = screenHeight / 2 - position.y;

  const shoot = useCallback((targetX: number, targetY: number) => {
    const fieldTargetX = targetX - position.x;
    const fieldTargetY = targetY - position.y;

    const dx = fieldTargetX - playerFieldX;
    const dy = fieldTargetY - playerFieldY;
    const angle = Math.atan2(dy, dx);
    const speedX = Math.cos(angle) * bulletSpeed;
    const speedY = Math.sin(angle) * bulletSpeed;

    const newBullet: Bullet = {
      speedX,
      speedY,
      size: 6,
      zIndex: 1000,
      id: Date.now(),
      x: playerFieldX,
      y: playerFieldY,
    };

    setBullets(prevBullets => [...prevBullets, newBullet]);
  }, [position.x, position.y, playerFieldX, playerFieldY, setBullets]);

  useEffect(() => {
    if (bullets.length > 0 && !rafRef.current) {
      const animate = () => {
        animateBullets();
        if (bullets.length > 0) { // Проверяем, чтобы не продолжать, если пуль нет
          rafRef.current = requestAnimationFrame(animate);
        }
        else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }
    else if (bullets.length === 0 && rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, [bullets.length, animateBullets]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { shoot, bullets };
};
