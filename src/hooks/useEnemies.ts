import { useRef, useState, useEffect, useCallback } from 'react';

import { useKeyboardControls } from './useKeyboardControls'; // Импорт вашего хука
import { useScreenParams } from './useScreenParams'; // Добавьте импорт, если у вас есть этот хук

type Enemy = {
  x: number;
  y: number;
  id: number;
  speed: number; // Скорость движения (пиксели за кадр)
};

export const useEnemies = () => {
  const initialEnemies = [
    { id: 1, x: 200, y: 200, speed: 1 }, // Пример: медленный враг
    { id: 2, x: 800, y: 400, speed: 1.5 }, // Быстрее
    { id: 3, x: 400, y: 600, speed: 0.8 }, // Медленнее
  ];
  const { fieldPosition } = useKeyboardControls(); // Получаем позицию поля
  const { screenWidth, screenHeight } = useScreenParams(); // Получаем размеры экрана (предполагаю { width, height })
  const [enemies, setEnemies] = useState<Enemy[]>(initialEnemies);
  const rafRef = useRef<null | number>(null);

  const moveEnemies = useCallback(() => {
    // Вычисляем абсолютную позицию персонажа на поле (центр экрана относительно поля)
    const playerX = fieldPosition.x + screenWidth * 2;
    const playerY = fieldPosition.y + screenHeight * 2;

    setEnemies(prevEnemies =>
      prevEnemies.map((enemy) => {
        // Вычисляем направление к персонажу
        const dx = playerX - enemy.x;
        const dy = playerY - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Если расстояние больше 1, двигаемся ближе (нормализуем вектор)
        if (distance > 1) {
          const normalizedDx = dx / distance;
          const normalizedDy = dy / distance;
          return {
            ...enemy,
            x: enemy.x + normalizedDx * enemy.speed,
            y: enemy.y + normalizedDy * enemy.speed,
          };
        }
        return enemy; // Если уже близко, не двигаемся
      }),
    );

    // eslint-disable-next-line react-hooks/immutability
    rafRef.current = requestAnimationFrame(moveEnemies); // Продолжаем анимацию
  }, [fieldPosition, screenWidth, screenHeight]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(moveEnemies); // Запускаем анимацию
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [moveEnemies]);

  return { enemies, setEnemies };
};
