import type { InjectionKey, Provide, ProvideLazy } from './Providing';
import { LazyValue, StaticValue, type Value } from './Value';

export type ProvidePair<T> = [InjectionKey<T>, T];

interface Piqure {
  provide: Provide;
  provideLazy: ProvideLazy;
  inject: <T>(key: InjectionKey<T>) => T;
  provides: (list: ProvidePair<unknown>[]) => void;
}

export const piqureWrapper = (wrapper: object, field: string): Piqure => {
  const wrapperTyped = wrapper as Record<string, Map<unknown, Value<unknown>>>;

  wrapperTyped[field] = wrapperTyped[field] ?? new Map();

  return piqure(wrapperTyped[field]);
};

export const piqure = (memory: Map<unknown, Value<unknown>> = new Map()): Piqure => {
  const provide: Provide = (key, injected) => {
    memory.set(key, new StaticValue(injected));
  };

  const provideLazy: ProvideLazy = (key, provider) => {
    memory.set(key, new LazyValue(provider));
  };

  return {
    provide,
    provideLazy,
    inject<T>(key: InjectionKey<T>): T {
      if (!memory.has(key)) {
        throw new Error(`The key ${key.toString()} is not provided`);
      }
      return memory.get(key)?.get() as T;
    },
    provides(list) {
      list.forEach(([key, value]) => provide(key, value));
    },
  };
};

export const key = <T>(description: string): InjectionKey<T> => Symbol(description) as InjectionKey<T>;
