import { describe, expect, it } from 'vitest';

import { key, keyFor, piqure, piqureWrapper } from './Piqure';

describe('Piqure', () => {
  it.each([
    { key: key<string>('String key'), provided: 'Injected' },
    { key: key<number>('Number key'), provided: 42 },
  ])('Should get "$provided" for key "$key"', ({ key, provided }) => {
    const { provide, inject } = piqure();
    provide(key, provided);

    const injected = inject(key);

    expect(injected).toBe(provided);
  });

  it('Should not inject when not provided', () => {
    const { inject } = piqure();

    expect(() => inject(key('Not injected'))).toThrow('The key Symbol(Not injected) is not provided');
  });

  it('Should provides multiple keys', () => {
    const { inject, provides } = piqure();
    const FIRST_KEY = key<number>('First key');
    const SECOND_KEY = key<string>('Second key');

    provides([
      [FIRST_KEY, 33],
      [SECOND_KEY, 'Text'],
    ]);

    expect(inject(FIRST_KEY)).toBe(33);
    expect(inject(SECOND_KEY)).toBe('Text');
  });

  it('Should override existing key', () => {
    const { inject, provide } = piqure();
    const KEY = key<string>('Key');
    provide(KEY, 'Value');
    provide(KEY, 'New value');

    expect(inject(KEY)).toBe('New value');
  });

  it('Should create unique symbols for each key call with the same description', () => {
    const FIRST_KEY = key<string>('Key');
    const SECOND_KEY = key<string>('Key');

    expect(FIRST_KEY).not.toBe(SECOND_KEY);
  });

  describe('With memory', () => {
    it('Should attach', () => {
      const memory = new Map();
      const { provide } = piqure(memory);

      provide(key<string>('First key'), 'First');
      provide(key<string>('Second key'), 'Second');

      expect(memory.size).toBe(2);
    });
  });

  describe('Wrapper memory', () => {
    it('Should attach', () => {
      const wrapper = {} as { memory: Map<unknown, unknown> };

      const { provide } = piqureWrapper(wrapper, 'memory');

      provide(key<string>('First key'), 'First');
      provide(key<string>('Second key'), 'Second');

      expect(wrapper.memory.size).toBe(2);
    });

    it('Should not remove keys with multiple provides', () => {
      const wrapper = {} as { memory: Map<unknown, unknown> };

      const { provide: firstProvide } = piqureWrapper(wrapper, 'memory');

      firstProvide(key<string>('First key'), 'First');
      firstProvide(key<string>('Second key'), 'Second');

      const { provide: secondProvide } = piqureWrapper(wrapper, 'memory');

      secondProvide(key<string>('Third key'), 'Third');
      secondProvide(key<string>('Fourth key'), 'Fourth');

      firstProvide(key<string>('Last key'), 'Last');

      expect(wrapper.memory.size).toBe(5);
    });
  });

  describe('Lazy Provider', () => {
    it('Should get lazy value', () => {
      const { provideLazy, inject } = piqure();
      const LAZY_KEY = key('Lazy key');
      provideLazy(LAZY_KEY, () => 'Lazy value');

      expect(inject(LAZY_KEY)).toBe('Lazy value');
    });

    it('Should get value once', () => {
      const { provideLazy, inject } = piqure();
      let count = 0;
      const LAZY_KEY = key('Lazy key');
      const lazyProvider = (): number => {
        count++;
        return 42;
      };
      provideLazy(LAZY_KEY, lazyProvider);

      inject(LAZY_KEY);
      inject(LAZY_KEY);

      expect(count).toBe(1);
    });
  });

  describe('keyFor', () => {
    it('Should return the same symbol for the same description', () => {
      const FIRST_KEY = keyFor<string>('Key');
      const SECOND_KEY = keyFor<string>('Key');

      expect(FIRST_KEY).toBe(SECOND_KEY);
    });

    it('Should be different from key with the same description', () => {
      const LOCAL_KEY = key<string>('Key');
      const GLOBAL_KEY = keyFor<string>('Key');

      expect(LOCAL_KEY).not.toBe(GLOBAL_KEY);
    });

    it('Should work with provide and inject', () => {
      const { provide, inject } = piqure();
      const GLOBAL_KEY = keyFor<string>('my-service');

      provide(GLOBAL_KEY, 'injected value');

      expect(inject(GLOBAL_KEY)).toBe('injected value');
    });
  });

  describe('has(key)', () => {
    it('Should return true if the key is provided', () => {
      const { provide, has } = piqure();
      const KEY = key<string>('Key');
      provide(KEY, 'Value');

      expect(has(KEY)).toBe(true);
    });

    it('Should return false if the key is not provided', () => {
      const { has } = piqure();
      const KEY = key<string>('Key');

      expect(has(KEY)).toBe(false);
    });

    it('Should return true when key is provided lazily', () => {
      const { provideLazy, has } = piqure();
      const k = key<string>('lazy-key');
      provideLazy(k, () => 'hello');

      expect(has(k)).toBe(true);
    });
  });

  describe('Circular dependencies', () => {
    it('Should throw when a lazy key directly depends on itself', () => {
      const { provideLazy, inject } = piqure();
      const A = key('A');

      provideLazy(A, () => inject(A));

      expect(() => inject(A)).toThrow('Circular dependency detected for key Symbol(A)');
    });

    it('Should throw when lazy keys form an indirect cycle', () => {
      const { provideLazy, inject } = piqure();
      const A = key('A');
      const B = key('B');

      provideLazy(A, () => inject(B));
      provideLazy(B, () => inject(A));

      expect(() => inject(A)).toThrow('Circular dependency detected for key Symbol(A)');
    });

    it('Should not throw for a non-circular dependency chain', () => {
      const { provideLazy, inject } = piqure();
      const A = key('A');
      const B = key('B');

      provideLazy(B, () => 'value-b');
      provideLazy(A, () => inject(B));

      expect(inject(A)).toBe('value-b');
    });
  });
});
