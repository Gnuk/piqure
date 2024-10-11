# Piqure

Just a dependency injection system in JavaScript.

## Prerequisites

* [Node](https://nodejs.org/) LTS

## Install

```shell
npm i piqure
```

## Usage

Classic usage:

```typescript
import { key, piqure } from './Piqure';

const { provide, provideLazy, inject } = piqure();

// Create an injection key with a type and a description
const KEY_TO_INJECT = key<string>('Key to inject');

// Register a text using provide
provide(KEY_TO_INJECT, 'Injected text');

// Register a text using provideLazy
provideLazy(KEY_TO_INJECT, () => 'Injected text');

// Use your text
const injected = inject(KEY_TO_INJECT);

console.log(injected); // Injected text
```

Attach piqure to the map you want:

```typescript
import { piqure } from './Piqure';

const memory = new Map();

const { provide, provideLazy, inject } = piqure(memory); // Now, the injected values will be inside "memory"

// […]
```

Attach piqure to a wrapper like `window`:

```typescript
import { piqureWrapper } from './Piqure';

const { provide, provideLazy, inject } = piqureWrapper(window, 'piqure'); // This will reuse or create a "piqure" field

// […]
```

To expose `provide` and `inject` globally with the `window` (if you're in a browser environment), just create a file in your project with:

```typescript
import { piqureWrapper } from './Piqure';

const { provide, provideLazy, inject } = piqureWrapper(window, 'piqure');

export { provide, provideLazy, inject };
```

## Contribute

Install with:

```shell
npm i
```

Launch tests with:

```shell
npm test
```

Then start coding and don't hesitate to send PR.
