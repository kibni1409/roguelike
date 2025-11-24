import { useStore, type StoreApi, type UseBoundStore } from 'zustand';

type TStore<T> = UseBoundStore<StoreApi<T>>;
export type TWrappedStore<T> = <K extends keyof T>(key: K) => T[K];

export const storeWrapperCreator = <T>(store: TStore<T>): TWrappedStore<T> => {
  return <K extends keyof T>(key: K): T[K] => {
    return useStore(store, state => state[key]);
  };
};
