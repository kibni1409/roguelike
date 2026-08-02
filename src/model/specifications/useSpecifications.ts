import { create } from 'zustand';

import { spendSkillPoint, resetGame as resetWorld } from '../../game/world';

type SpecificationsState = {
  range: number;
  speed: number;
  attack: number;
  reload: number;
};

type SpecificationsActions = {
  upgradeRange: () => boolean;
  upgradeSpeed: () => boolean;
  upgradeAttack: () => boolean;
  upgradeReload: () => boolean;
  resetSpecifications: () => void;
};

export type SpecificationsStore = SpecificationsState & SpecificationsActions;

const initialState: SpecificationsState = {
  range: 0,
  speed: 0,
  attack: 0,
  reload: 0,
};

export const useSpecifications = create<SpecificationsStore>(set => ({
  ...initialState,
  upgradeRange: () => {
    if (!spendSkillPoint()) return false;
    set(state => ({ range: state.range + 1 }));
    return true;
  },
  upgradeSpeed: () => {
    if (!spendSkillPoint()) return false;
    set(state => ({ speed: state.speed + 1 }));
    return true;
  },
  upgradeAttack: () => {
    if (!spendSkillPoint()) return false;
    set(state => ({ attack: state.attack + 1 }));
    return true;
  },
  upgradeReload: () => {
    if (!spendSkillPoint()) return false;
    set(state => ({ reload: state.reload + 1 }));
    return true;
  },
  resetSpecifications: () => set({ ...initialState }),
}));

export const restartFullGame = () => {
  useSpecifications.getState().resetSpecifications();
  resetWorld();
};
