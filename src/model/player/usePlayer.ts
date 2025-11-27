import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type Position = {
  x: number;
  y: number;
};

type PlayerState = {
  isStep: boolean;
  position: Position;
  orientation: 'left' | 'right';
};

export type PlayerStore = {
  player: PlayerState;
  setPlayer: (updates: Partial<PlayerState>) => void;
};

const initialPlayer: PlayerState = {
  isStep: false,
  orientation: 'left',
  position: { x: 0, y: 0 }, // Или из useScreenParams
};

export const usePlayerStore = create<PlayerStore>()(
  subscribeWithSelector(set => ({
    player: initialPlayer,
    setPlayer: updates =>
      set(state => ({
        player: { ...state.player, ...updates },
      })),
  })),
);
