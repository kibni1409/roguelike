import { storeWrapperCreator } from '../../shared/createStore.ts';

import { useSpecifications, type SpecificationsStore } from './useSpecifications.ts';

export const useSpecificationsWrapper = storeWrapperCreator<SpecificationsStore>(useSpecifications);
