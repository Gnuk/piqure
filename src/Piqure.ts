// Used to infer type on a symbol
// eslint-disable-next-line @typescript-eslint/no-empty-interface,@typescript-eslint/no-unused-vars,@typescript-eslint/ban-types
export interface InjectionKey<T> extends Symbol {}

export type ProvidePair<T> = [InjectionKey<T>, T];

type Provide = <T>(key: InjectionKey<T>, injected: T) => void;

interface Piqure {
  provide: Provide;
  inject: <T>(key: InjectionKey<T>) => T;
  provides: (list: ProvidePair<unknown>[]) => void;
}

export const piqureWrapper = (wrapper: object, field: string): Piqure => {
  const wrapperTyped = wrapper as Record<string, Map<unknown, unknown>>;

  wrapperTyped[field] = wrapperTyped[field] ?? new Map();

  return piqure(wrapperTyped[field]);
};

export const piqure = (memory: Map<unknown, unknown> = new Map()): Piqure => {
  const provide: Provide = (key, injected) => {
    if (memory.has(key)) {
      throw new Error(`The value for the key ${key.toString()} already exists`);
    }
    memory.set(key, injected);
  };

  return {
    provide,
    inject<T>(key: InjectionKey<T>): T {
      if (!memory.has(key)) {
        throw new Error(`The key ${key.toString()} is not provided`);
      }
      return memory.get(key) as T;
    },
    provides(list) {
      list.forEach(([key, value]) => provide(key, value));
    },
  };
};

export const key = <T>(description: string): InjectionKey<T> => Symbol(description) as InjectionKey<T>;
