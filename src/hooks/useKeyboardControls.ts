import { useRef, useState, useEffect, useCallback } from 'react';

import type { Orientation } from '../shared';
import { useSpecificationsWrapper } from '../model/specifications';

import { useScreenParams } from './useScreenParams.ts';

type Position = {
  x: number;
  y: number;
};

const keysCode = ['KeyW', 'KeyS', 'KeyA', 'KeyD'];

export const useKeyboardControls = () => {
  const {
    maxY,
    minX,
    maxX,
    minY,
    moveStep,
    initialPosition,
  } = useScreenParams();
  const speed = useSpecificationsWrapper('speed');

  const [fieldPosition, setFieldPosition] = useState<Position>(initialPosition);
  const [orientation, setOrientation] = useState<Orientation>('left');
  const [isStep, setIsStep] = useState<boolean>(false);

  const pressedKeysRef = useRef<Record<string, boolean>>({});
  const rafRef = useRef<null | number>(null);

  const updatePosition = useCallback(() => {
    const pressedKeys = pressedKeysRef.current;
    setFieldPosition((prev) => {
      let newX = prev.x;
      let newY = prev.y;

      if (pressedKeys.KeyS) newY = prev.y - moveStep - (speed / 2);
      if (pressedKeys.KeyW) newY = prev.y + moveStep + (speed / 2);
      if (pressedKeys.KeyD) {
        setOrientation('right');
        newX = prev.x - moveStep - (speed / 2);
      }
      if (pressedKeys.KeyA) {
        setOrientation('left');
        newX = prev.x + moveStep + (speed / 2);
      }

      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));

      return { x: newX, y: newY };
    });

    const hasPressedKeys = Object.values(pressedKeys).some(Boolean);

    // eslint-disable-next-line react-hooks/immutability
    if (hasPressedKeys) rafRef.current = requestAnimationFrame(updatePosition);
  }, [moveStep, speed, minX, maxX, minY, maxY]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const code = event.code;
      if (keysCode.includes(code)) {
        event.preventDefault();
        if (!pressedKeysRef.current[code]) {
          pressedKeysRef.current[code] = true;
          setIsStep(Object.values(pressedKeysRef.current).some(Boolean));
          if (!rafRef.current) rafRef.current = requestAnimationFrame(updatePosition);
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const code = event.code;
      if (keysCode.includes(code)) {
        if (pressedKeysRef.current[code]) {
          pressedKeysRef.current[code] = false;
          const hasPressed = Object.values(pressedKeysRef.current).some(Boolean);
          setIsStep(hasPressed);
          if (!hasPressed && rafRef.current) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [updatePosition]);

  return { isStep, orientation, fieldPosition };
};
