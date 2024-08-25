# libtuple

*Memory-efficient tuple implementation in 6.4kB*

[![Test](https://github.com/seanmorris/libtuple/actions/workflows/test.yaml/badge.svg)](https://github.com/seanmorris/libtuple/actions/workflows/test.yaml)

### Install & Use

`libtuple` is now ESM compliant!

#### npm:

You can install libtuple via `npm`:

```bash
$ npm install libtuple
```

You can also import directly via [importmaps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap):

```html
<script type="importmap">
{
	"imports": {
		"libtuple": "https://cdn.jsdelivr.net/npm/libtuple/index.mjs"
	}
}
</script>
```

#### Usage

Simply import the functions from `libtuple`:

```javascript
import { Tuple, Group, Record, Dict } from 'libtuple';
```

You can also import them via [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import):

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
const [a ,b, c] = [1, 2, 3];
Record({a, b, c}) === Record({c, b, a}); // true
```

### Dict()

A `Dict()` is like an ordered `Record()`:

```javascript
const [a ,b, c] = [1, 2, 3];
Dict({a, b, c}) === Dict({a, b, c}); // true
Dict({a, b, c}) === Dict({c, b, a}); // false
```

## Gotchas

Watch out for the following however, object references can be tricky. In this example, each `[]` represents its own, unique object, so the following returns false:

```javascript
Tuple( [] ) === Tuple( [] ); // FALSE!!!
```

Use the same ***object reference*** to get the same tuple:

```javascript
const a = [];

Tuple( a ) === Tuple( a ); // true :)
```

## Tuples are...

*(Groups, Records, and Dicts are just specialized Tuples)*

### Composable

Tuples can be members of of other tuples. This works as expected:

```javascript
console.log( Tuple(Tuple(1, 2), Tuple(3, 4)) === Tuple(Tuple(1, 2), Tuple(3, 4)) );
// true
```

### Frozen

You cannot add, remove or modify any property on a tuple.

```javascript
const tuple = Tuple('a', 'b', 'c');

tuple[0] = 'NEW VALUE';

console.log( tuple[0] ); // 'a'

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

## How It Works

A *tuple* is a type represented by a sequence of values. Unlike arrays, where `[1,2] !== [1,2]`, since, although they hold the same values, the actual object references are different. Tuples give you `Tuple(1,2) === Tuple(1,2)`.

For a sequence of primitives, this is trivial. Simply run `JSON.stringify` on the list of values and you've got a unique scalar that you can compare against others, and the object-reference problem is gone. Once you add objects to the mix, however, things can get complicated.

Stringifying objects won't work, since given almost any stringification mechanism, two completely disparate objects can be coerced to resolve the same value. That only leaves us with bean-counting. If we keep track of which objects and scalars we've seen, we can use the unique value of the object reference itself to construct a path through a tree of `Maps` where the leaves are the ultimate scalar value of the tuple. But in that case we'll use memory to hold objects and scalars in memory long after their tuples are useful. It seems we're backed into a corner here.

We could use trees of `WeakMaps` instead, however this case would only allow us to use objects, since scalars cannot be used as keys to a `WeakMap`. We'd end up with two disparate mechanisms, one for lists of only scalars, and one for lists of only objects. We just can't win here!

And that's where prefix-trees come in. Before constructing a tree of `WeakMaps`, the function will group all neighboring scalars into singular values. This will then leave us with a list of objects interspersed by singular scalars. Each scalar is then considered the prefix of the next object. When constructing or traversing the tree, first we come upon a node representing the object, then its prefix, then the next object in the chain. If the first (or any) object has no scalar prefix, we simply move directly to the next object. If the list ends in a scalar, simply add a terminator object reference as a key to the leaf, which holds the actual tuple object.

Organizing the hierarchy with the scalar prefixes *after* the objects allows us to exploit the `WeakMap`'s garbage collection behavior. Once the object keys are GC'ed, so are the entries of the `WeakMap`. Holding a key here does not prevent objects from being GC'ed, so the branches of the internal tuple tree only stay in-memory as long as the objects they're comprised of.

## Limitations

* Registered `Symbol`s cannot participate in `Tuples`. (i.e. created with `Symbol.for()`; [more info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry)) [⚠️ Node v19 & Earlier](https://github.com/nodejs/node/issues/49135)

## Testing

Run `npm run test` or `node --test test.mjs` in the terminal.
