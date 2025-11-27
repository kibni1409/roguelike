import { create } from 'zustand';

import { Enemy, generateEnemies } from '../../shared';

type EnemiesState = {
  enemies: Enemy[];
};

type EnemiesActions = {
  addEnemy: (enemy: Enemy) => void;
  setEnemies: (updater: Enemy[] | ((prev: Enemy[]) => Enemy[])) => void;
};

export type EnemiesStore = EnemiesState & EnemiesActions;

const initialState = {
  enemies: generateEnemies(20),
};

export const useEnemies = create<EnemiesStore>(set => ({
  ...initialState,
  addEnemy: enemy => set(state => ({ enemies: [...state.enemies, enemy] })),
  setEnemies: updater => set(state => ({
    enemies: typeof updater === 'function' ? updater(state.enemies) : updater,
  })),
}));
