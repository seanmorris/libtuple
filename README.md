# libtuple

*Memory-efficient immutables in 9kB*

[![npm version](https://img.shields.io/npm/v/libtuple?color=7f3d65&label=libtuple&style=for-the-badge)](https://www.npmjs.com/package/libtuple)  [![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/seanmorris/libtuple/test.yaml?style=for-the-badge&link=https%3A%2F%2Fgithub.com%2Fseanmorris%2Flibtuple)](https://github.com/seanmorris/libtuple/actions/workflows/test.yaml)  [![License](https://img.shields.io/npm/l/libtuple?logo=apache&color=427819&style=for-the-badge)](https://github.com/seanmorris/libtuple/blob/master/LICENSE)

### ⚠️ Notice: Schemas have been moved to the [libtuple-schema](https://github.com/seanmorris/libtuple-schema) project. ⚠️

> ## I am giving up my bed for one night.
> My Sleep Out helps youth facing homelessness find safe shelter and loving care at Covenant House. That care includes essential services like education, job training, medical care, mental health and substance use counseling, and legal aid — everything they need to build independent, sustainable futures.
>
> By supporting my Sleep Out, you are supporting the dreams of young people overcoming homelessness.
>
> <a href = "https://www.sleepout.org/participants/62915"><img width = "50%" alt="Donate to Covenant House" src="https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fwww.sleepout.org%2Fapi%2F1.3%2Fparticipants%2F62915%3F_%3D1760039017428&query=%24.sumDonations&prefix=%24&suffix=%20Raised&style=for-the-badge&label=Sleep%20Out%3A%20NYC&link=https%3A%2F%2Fwww.sleepout.org%2Fparticipants%2F62915"></a>
>
> Click here to help out: https://www.sleepout.org/participants/62915
>
> More info: https://www.sleepout.org/ | https://www.covenanthouse.org/ | https://www.charitynavigator.org/ein/132725416
>
> Together, we are working towards a future where every young person has a safe place to sleep.
>
> Thank you.
>
> and now back to your documentation...

### Install & Use

You can install libtuple via `npm`:

```bash
$ npm install libtuple
```

## Tuples are...

*(Groups, Records, and Dicts are just specialized Tuples)*

### Value Objects

A tuple with the same values is the same tuple:

```javascript
const t1 = Tuple('a', 'b', 'c');
const t2 = Tuple('a', 'b', 'c');

console.log( t1 === t2 ); //true
```

### Immutable

Tuples are immutable. Any attempt to modify them will not throw an error, but will silently fail, leaving the original values unchanged.

```javascript
const tuple = Tuple('a', 'b', 'c');

tuple[0] = 'NEW VALUE'; // This will not change the tuple, it will still be 'a'

console.log( tuple[0] ); // 'a'
```

### Composable

Tuples can be members of other tuples. This works as expected:

```javascript
console.log( Tuple(Tuple(1, 2), Tuple(3, 4)) === Tuple(Tuple(1, 2), Tuple(3, 4)) );
// true
```

### Iterable & Spreadable

Tuples and Groups can be looped over just like Arrays:

```javascript
const tuple = Tuple(1, 2, 3);
for(const value of tuple) {
    console.log(value)
}
```

Records, and Dicts can also be iterated just like normal objects:

```javascript
const record = Record({a: 1, b: 2, c: 3});
for(const [key, value] of Object.entries(record)) {
    console.log(key, value);
}
```

Tuples & Groups can be spread just like arrays:

```javascript
const tuple = Tuple(1, 2, 3);
console.log([...tuple]); // [1, 2, 3]
```

Similarly, Records & Dicts can be spread into objects:

```javascript
const record = Record({a: 1, b: 2, c: 3});
console.log({...record}); // {a: 1, b: 2, c: 3}
```

#### Usage

Simply import the functions from `libtuple`:

```javascript
import { Tuple, Group, Record, Dict } from 'libtuple';
```

You can also import them via URL imports, or [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) *(npm not required)*

```javascript
import { Tuple, Group, Record, Dict } from 'https://cdn.jsdelivr.net/npm/libtuple@1.0.0/index.mjs';
```

```javascript
const { Tuple, Group, Record, Dict } = await import('https://cdn.jsdelivr.net/npm/libtuple/index.mjs');
```

### Tuple()

Pass a list of values to the `Tuple()` function. This value will be strictly equivalent to any tuple generated with the same values:

```javascript
const tuple123 = Tuple(1, 2, 3);
tuple123 === Tuple(1, 2, 3); // true

const tuple321 = Tuple(3, 2, 1);
tuple123 === tuple321; // false
```

This is true for tuples with objects as well:

```javascript
const a = {};
const b = [];
const c = new Date;

console.log( Tuple(a, b, c, 1, 2, 3) === Tuple(a, b, c, 1, 2, 3) ); //true
```

### Group()

A `Group()` is similar to a `Tuple()`, except they're not ordered:

```javascript
Group(3, 2, 1) === Group(1, 2, 3); // true
```

### Record()

A `Record()` works the same way, but works with keys & values, and is **not** ordered.

```javascript
const [a, b, c] = [1, 2, 3];
Record({a, b, c}) === Record({c, b, a}); // true
```

### Dict()

A `Dict()` is like an ordered `Record()`:

```javascript
const [a, b, c] = [1, 2, 3];
Dict({a, b, c}) === Dict({a, b, c}); // true
Dict({a, b, c}) === Dict({c, b, a}); // false
```

## Gotchas

In JavaScript, object comparisons are based on reference, not on the actual content of the objects. This means that even if two objects have the same properties and values, they are considered different if they do not reference the same memory location.

For example, the following comparison returns false because each {} creates a new, unique object:

```javascript
Tuple( {} ) === Tuple( {} ); // FALSE!!!
```

Each {} is a different object in memory, so the tuples containing them are not strictly equal. This is an important behavior to understand when working with tuples that contain objects.

To get the same tuple, you need to use the exact same object reference:

```javascript
const a = {};

Tuple( a ) === Tuple( a ); // true :)
```

## How It Works

A *tuple* is a type represented by a sequence of values. Unlike arrays, where `[1, 2] !== [1, 2]` (as they hold different object references), tuples provide a mechanism where `Tuple(1, 2) === Tuple(1, 2)`. This ensures that tuples with the same values are always strictly equal, simplifying equality checks and enhancing memory efficiency.

For a sequence of primitives, this is trivial. Simply run `JSON.stringify` on the list of values and you've got a unique scalar that you can compare against others, and the object-reference problem is gone. Once you add objects to the mix, however, things can get complicated.

Stringifying objects won't work, since given almost any stringification mechanism, two completely disparate objects can be coerced to resolve the same value. That only leaves us with bean-counting. If we keep track of which objects and scalars we've seen, we can use the unique value of the object reference itself to construct a path through a tree of `Maps` where the leaves are the ultimate scalar value of the tuple. But in that case we'll use memory to hold objects and scalars in memory long after their tuples are useful. It seems we're backed into a corner here.

We could use trees of `WeakMaps` instead, however this case would only allow us to use objects, since scalars cannot be used as keys to a `WeakMap`. We'd end up with two disparate mechanisms, one for lists of only scalars, and one for lists of only objects. We just can't win here!

And that's where prefix-trees come in. Before constructing a tree of `WeakMaps`, the function will group all neighboring scalars into singular values. This will then leave us with a list of objects interspersed by singular scalars. Each scalar is then considered the prefix of the next object. When constructing or traversing the tree, first we come upon a node representing the object, then its prefix, then the next object in the chain. If the first (or any) object has no scalar prefix, we simply move directly to the next object. If the list ends in a scalar, simply add a terminator object reference as a key to the leaf, which holds the actual tuple object.

Organizing the hierarchy with the scalar prefixes *after* the objects allows us to exploit the `WeakMap`'s garbage collection behavior. Once the object keys are GC'ed, so are the entries of the `WeakMap`. Holding a key here does not prevent objects from being GC'ed, so the branches of the internal tuple tree only stay in-memory as long as the objects they contain are in use.

## Limitations

* Registered `Symbol`s cannot be used in `Tuples`, i.e. symbols created with `Symbol.for()`;
    * [more info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry)
    * [⚠️ Node v19 & Earlier](https://github.com/nodejs/node/issues/49135)

## Testing

Run `npm run test` or `node --test --expose-gc test/test.mjs` in the terminal.

## 🍻 Licensed under the Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
