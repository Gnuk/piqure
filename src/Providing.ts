// Used to infer type on a symbol
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export interface InjectionKey<T> extends Symbol {} // eslint-disable-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-wrapper-object-types,@typescript-eslint/no-empty-object-type
export type Provider<T> = () => T;
export type Provide = <T>(key: InjectionKey<T>, injected: T) => void;
export type ProvideLazy = <T>(key: InjectionKey<T>, injected: Provider<T>) => void;
