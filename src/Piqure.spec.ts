import { describe, expect, it } from 'vitest';

import { key, piqure, piqureWrapper } from './Piqure';

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

  it('Should not provide for same key multiple times', () => {
    const { provide } = piqure();
    const KEY = key<string>('Key');
    provide(KEY, 'Value');

    expect(() => provide(KEY, 'New value')).toThrow('The value for the key Symbol(Key) already exists');
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
});
