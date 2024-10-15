import { type Provider } from './Providing';

const ABSENT = Symbol('Absent');

export interface Value<T> {
  get(): T;
}

export class StaticValue<T> implements Value<T> {
  readonly #value: T;

  constructor(value: T) {
    this.#value = value;
  }

  get(): T {
    return this.#value;
  }
}

export class LazyValue<T> implements Value<T> {
  readonly #provider: Provider<T>;
  #memory: T | typeof ABSENT = ABSENT;

  constructor(provider: Provider<T>) {
    this.#provider = provider;
  }

  get(): T {
    if (this.#memory === ABSENT) {
      this.#memory = this.#provider();
    }
    return this.#memory;
  }
}
