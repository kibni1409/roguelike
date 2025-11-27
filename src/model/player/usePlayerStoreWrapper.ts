import { storeWrapperCreator } from '../../shared/createStore.ts';

import { PlayerStore, usePlayerStore } from './usePlayer.ts';

export const usePlayerStoreWrapper = storeWrapperCreator<PlayerStore>(usePlayerStore);
