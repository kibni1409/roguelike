import { storeWrapperCreator } from '../../shared/createStore.ts';

import { useEnemies, EnemiesStore } from './useEnemies.ts';

export const useEnemiesWrapper = storeWrapperCreator<EnemiesStore>(useEnemies);
