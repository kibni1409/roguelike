import { useRef, useState, useEffect, useCallback } from 'react';

import { type Enemy, type EnemyType, generateEnemies } from '../shared';

import { useScreenParams } from './useScreenParams';
import { useKeyboardControls } from './useKeyboardControls';

export const useEnemies = () => {
  const { fieldPosition } = useKeyboardControls();
  const { screenWidth, screenHeight } = useScreenParams();
  const [enemies, setEnemies] = useState<Enemy[]>(generateEnemies(10));
  const rafRef = useRef<null | number>(null);

  const moveEnemies = useCallback(() => {
    // Вычисляем абсолютную позицию персонажа на поле (центр экрана относительно поля)
    const playerX = screenWidth / 2 - fieldPosition.x;
    const playerY = screenHeight / 2 - fieldPosition.y;

    setEnemies((prevEnemies) => {
      // Сначала обновляем позиции и orientation
      const updatedEnemies = prevEnemies.map((enemy) => {
        // Вычисляем направление к персонажу
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Вычисляем сторону: слева или справа от персонажа
        const orientation: 'left' | 'right' = enemy.x < playerX ? 'right' : 'left';

        // Если расстояние больше 1, двигаемся ближе
        if (distance > 1) {
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          return {
            ...enemy,
            orientation,
            x: enemy.x + normalizedDx * enemy.speed,
            y: enemy.y + normalizedDy * enemy.speed,
          };
        }
        return { ...enemy, orientation };
      });

      // Функция для получения высоты по типу (предполагаем, что это высота)
      const getHeight = (type: EnemyType) => type === 'bigZ' ? 100 : 50;

      // Сортируем по нижней границе (y + height) убыванию: враги с большей нижней границей (ниже) получают меньший индекс в массиве
      updatedEnemies.sort((a, b) => (a.y + getHeight(a.type)) - (b.y + getHeight(b.type)));

      updatedEnemies.forEach((enemy, index) => {
        enemy.zIndex = index + 2;
      });

      return updatedEnemies;
    });

    // eslint-disable-next-line react-hooks/immutability
    rafRef.current = requestAnimationFrame(moveEnemies);
  }, [fieldPosition, screenWidth, screenHeight]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(moveEnemies);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [moveEnemies]);

  return { enemies, setEnemies };
};
