import { storeWrapperCreator } from '../../shared/createStore.ts';

import { useShoot, type ShootStore } from './useShoot.ts';

export const useShootWrapper = storeWrapperCreator<ShootStore>(useShoot);
