import { create } from 'zustand';

type SpecificationsState = {
  range: number;
  speed: number;
  attack: number;
};

type SpecificationsActions = {
  setRange: (range: number) => void;
  setSpeed: (speed: number) => void;
  setAttack: (attack: number) => void;
};

export type SpecificationsStore = SpecificationsState & SpecificationsActions;

const initialState: SpecificationsState = {
  range: 0,
  speed: 0,
  attack: 0,
};

export const useSpecifications = create<SpecificationsStore>(set => ({
  ...initialState,
  setRange: (range: number) => set({ range }),
  setSpeed: (speed: number) => set({ speed }),
  setAttack: (attack: number) => set({ attack }),
}));
