import { create } from 'zustand';

import { useEnemies } from '../enemy/useEnemies.ts';
import { Enemy, Bullet, isColliding } from '../../shared';

type ShootState = {
  bullets: Bullet[];
};

type ShootActions = {
  animateBullets: () => void;
  addBullet: (bullet: Bullet) => void;
  setBullets: (updater: Bullet[] | ((prev: Bullet[]) => Bullet[])) => void;
};

export type ShootStore = ShootState & ShootActions;

const initialState = {
  bullets: [],
};

export const useShoot = create<ShootStore>((set, get) => ({
  ...initialState,
  addBullet: bullet => set(state => ({ bullets: [...state.bullets, bullet] })),
  setBullets: updater => set(state => ({
    bullets: typeof updater === 'function' ? updater(state.bullets) : updater,
  })),
  animateBullets: () => {
    const { bullets, setBullets } = get();
    const { enemies, setEnemies } = useEnemies.getState();

    const updatedBullets = bullets.map(bullet => ({
      ...bullet,
      x: bullet.x + bullet.speedX,
      y: bullet.y + bullet.speedY,
    }));

    // Проверяем столкновения с врагами
    const remainingBullets: Bullet[] = [];
    const updatedEnemies: Enemy[] = [...enemies];

    updatedBullets.forEach((bullet) => {
      let collided = false;
      updatedEnemies.forEach((enemy, enemyIndex) => {
        if (!collided && isColliding(bullet, enemy)) {
          // Столкновение: наносим урон (например, -10 HP)
          updatedEnemies[enemyIndex] = {
            ...enemy,
            hp: enemy.hp - 10, // Урон от пули
          };

          // Если HP <= 0, удаляем врага
          if (updatedEnemies[enemyIndex].hp <= 0) {
            updatedEnemies.splice(enemyIndex, 1);
          }

          collided = true; // Пуля уничтожена, не проверяем дальше
        }
      });

      if (!collided) {
        remainingBullets.push(bullet); // Пуля продолжает полёт
      }
    });

    setBullets(remainingBullets);
    setEnemies(updatedEnemies); // Обновляем врагов через их store
  },
}));
