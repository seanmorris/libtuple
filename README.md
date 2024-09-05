# libtuple

[![Test](https://github.com/seanmorris/libtuple/actions/workflows/test.yaml/badge.svg)](https://github.com/seanmorris/libtuple/actions/workflows/test.yaml) *Memory-efficient immutables in 10.4kB*

### Install & Use

`libtuple` is now ESM compliant!

#### npm:

You can install libtuple via `npm`:

```bash
$ npm install libtuple
```

## Tuples are...

*(Groups, Records, and Dicts are just specialized Tuples)*

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

You can also import them via URL imports, or [dynamic imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import): *(npm not required)*

```javascript
import { Tuple, Group, Record, Dict } from 'https://cdn.jsdelivr.net/npm/libtuple@0.0.7-alpha-4/index.mjs';
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

### Schema

A `Schema` allows you to define a complex structure for your immutables. It is defined by one or more SchemaMappers, which take a value and either return it, or throw an error:

```javascript
import { Schema as s } from 'libtuple';

const boolSchema = s.boolean();

boolSchema(true);  // returns true
boolSchema(false); // returns false
boolSchema(123);   // throws an error
```

You can create schemas for Tuples, Groups, Records, and Dicts:

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(
    s.number(),
    s.number(),
);

const pointTuple = pointSchema([5, 10]);

console.log(pointTuple);

const userSchema = s.record({
    id: s.number(),
    email: s.string(),
});

const userRecord = userSchema({id: 1, email: 'fake@example.com'});

console.log(userRecord);
```

#### Schema.parse(schema, value)

`Schema.parse()` will return the parsed value, or NaN on error, since `NaN` is falsey, and `NaN !== NaN`.

```javascript
import { Schema as s } from 'libtuple';

const boolSchema = s.boolean();

s.parse(boolSchema, true);  // returns true
s.parse(boolSchema, false); // returns false
s.parse(boolSchema, 123);   // returns NaN
```
### SchemaMappers

*Expand the sections below to see SchemaMapper documentation.*

<details>
  <summary>Schema Mappers for Values</summary>

#### Schema.value(options)

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.

#### Schema.drop()

Drop the value (always maps to `undefined`)

#### Schema.boolean(options)

* options.map - Callback to transform the value after its been validated.

#### Schema.number(options)

* options.min - Min value
* options.max - Max value
* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.

#### Schema.bigint(options)

* options.min - Min value
* options.max - Max value
* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.

#### Schema.string(options)

* options.min - Min length
* options.max - Max length
* options.map - Callback to transform the value after its been validated.
* options.match - Throw a TypeError if this does NOT match
* options.noMatch - Throw a TypeError if this DOES match
* options.check - Throw a TypeError if this returns false.

#### Schema.array(options)

* options.min - Min length
* options.max - Max length
* options.map - Callback to transform the value after its been validated.
* options.each - Callback to transform each element.
* options.check - Throw a TypeError if this returns false.

#### Schema.object(options)

* options.class - Throw a TypeError if the class does not match.
* options.map - Callback to transform the value after its been validated.
* options.each - Callback to transform each element.
* options.check - Throw a TypeError if this returns false.

#### Schema.function(options)

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.

#### Schema.symbol(options)

* options.map - Callback to transform the value after its been validated.
* options.check - Throw a TypeError if this returns false.

#### Schema.null(options)

* options.map - Callback to transform the value after its been validated.

#### Schema.undefined(options)

* options.map - Callback to transform the value after its been validated.

---
</details>

<details>
  <summary>Schema Mappers for Convenience</summary>

#### Convenience methods for numbers

The following methods will call `s.number` with additional constraints added:

* s.integer
* s.float
* s.NaN
* s.infinity

#### Convenience methods for strings

The following methods will call `s.string` with additional constraints added:

* s.numericString
    ```javascript
    // options.min & options.max are overridden for numeric comparison.
    const positive = s.numericString({map: Number, min: Number.EPSILON});
	const negative = s.numericString({map: Number, max: -Number.EPSILON});

    negative('-100'); // -100
    positive('100');  //  100

    negative('5');    // ERROR
    positive('-5');   // ERROR
    ```
* s.dateString
    ```javascript
    // options.min & options.max are overridden for comparison with Date objects.
    const after1994 = s.dateString({min: new Date('01/01/1995')});

    after1994('07/04/1995'); // '01/01/1996'
    after1994('07/04/1989'); // ERROR
    ```
* s.uuidString
* s.urlString
* s.emailString
* s.regexString
* s.base64String
* s.jsonString

</details>

<details>
  <summary>Special Schema Mappers</summary>

#### Schema.or(...schemaMappers)

Map the value with the first matching SchemaMapper

```javascript
import { Schema as s } from 'libtuple';

const dateSchema = s.or(
    s.string({match: /\d\d \w+ \d\d\d\d \d\d:\d\d:\d\d \w+?/, map: s => new Date(s)}),
    s.object({class: Date})
);

console.log( dateSchema('04 Apr 1995 00:12:00 GMT') );
console.log( dateSchema(new Date) );
```

#### Schema.repeat(r, schemaMapper)

Repeat a SchemaMapper r times

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(s.repeat(2, s.number()));

const point = pointSchema([5, 10]);
```

#### Schema.oneOf(literals = [], options = {})

Match the value to a set of literals with strict-equals comparison.

```javascript
import { Schema as s } from 'libtuple';

const schema = s.oneOf(['something', 1234]);

s.parse(schema, 1234);          // 1234
s.parse(schema, 'something');   // 'something'
s.parse(schema, 'not on list'); // ERROR!
```

---
</details>

<details>
  <summary>Schema Mappers for Tuples, Groups, Records and Dicts</summary>

#### Schema.tuple(...values)

Map one or more values to a Tuple.

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.tuple(s.number(), s.number());

const point = pointSchema([5, 10]);
```

#### Schema.group(...values)

Map one or more values to a Group.

#### Schema.record(properties)

Map one or more properties to a Record.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.sRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

console.log({company});
```

#### Schema.dict(properties)

Map one or more values to a Dict.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.sDict({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

console.log({company});
```

#### Schema.nTuple(...values)

Map n values to a Tuple. Will append each value in the input to the Tuple using the same mapper.

```javascript
import { Schema as s } from 'libtuple';

const vectorSchema = s.nTuple(s.number());

const vec2 = vectorSchema([5, 10]);
const vec3 = vectorSchema([5, 10, 11]);
const vec4 = vectorSchema([5, 10, 11, 17]);

console.log({vec2, vec3, vec4});
```

#### Schema.nGroup(...values)

Map n values to a Group. Will append each value in the input to the Group using the same mapper.

#### Schema.nRecord(properties)

Map n properties to a Record. Will append additional properties without mapping or validation, if present.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.nRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
    openHours: '9AM-7PM',
    slogan: 'We do business.',
});
```

#### Schema.nDict(properties)

Map n properties to a Dict. Will append additional properties without mapping or validation, if present.

#### Schema.sTuple(...values)

Strictly map values to a Tuple. Will throw an error if the number of values does not match.

```javascript
import { Schema as s } from 'libtuple';

const pointSchema = s.sTuple(s.number(), s.number());

const pointA = pointSchema([5, 10]);
const pointB = pointSchema([5, 10, 1]); // ERROR!
```

#### Schema.sGroup(...values)

Strictly map values to a Group. Will throw an error if the number of values does not match.

#### Schema.sRecord(properties)

Strictly map values to a Record. Will throw an error if the number of values does not match.

```javascript
import { Schema as s } from 'libtuple';

const companySchema = s.nRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
});

// ERROR!
companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
    openHours: '9AM-7PM',
    slogan: 'We do business.',
});
```

#### Schema.sDict(properties)

Strictly map values to a Dict. Will throw an error if the number of values does not match.

#### Schema.xTuple(...values)

Exclusively map values to a Tuple. Will drop any keys not present in the schema.

```javascript
import { Schema as s } from './index.mjs';

const pointSchema = s.xTuple(s.number(), s.number());

const pointA = pointSchema([5, 10]); // [5, 10]
const pointB = pointSchema([5, 10, 1]); // Also [5, 10]

console.log(pointB[0]); // 5
console.log(pointB[1]); // 10
console.log(pointB[2]); // undefined

```

#### Schema.xGroup(...values)

Exclusively map values to a Group. Will drop any keys not present in the schema.

#### Schema.xRecord(properties)

```javascript
const companySchema = s.xRecord({
    name: s.string(),
    phone: s.string(),
    address: s.string(),
});

const company = companySchema({
    name: 'Acme Corporation',
    phone: '+1-000-555-1234',
    address: '123 Fake St, Anytown, USA',
    openHours: '9AM-7PM',
    slogan: 'We do business.',
});

console.log({company});
```

Exclusively map values to a Record. Will drop any keys not present in the schema.

#### Schema.xDict(properties)

Exclusively map values to a Dict. Will drop any keys not present in the schema.

---
</details>

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

* Registered `Symbol`s cannot be used in `Tuples`. (i.e. created with `Symbol.for()`; [more info](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#shared_symbols_in_the_global_symbol_registry)) [⚠️ Node v19 & Earlier](https://github.com/nodejs/node/issues/49135)

## Testing

Run `npm run test` or `node --test test.mjs` in the terminal.

# 🍻 Licensed under the Apache License, Version 2.0

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

