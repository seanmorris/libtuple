import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Schema from '../Schema.mjs';

import Tuple from '../Tuple.mjs';

const s = Schema;

test('s.boolean test', t => {
	const schema = s.boolean();
	assert.strictEqual(s.parse(schema, false), false);
	assert.strictEqual(s.parse(schema, true), true);

	assert.throws(() => schema('not a boolean'), 'SchemaMapper should throw errors on bad value.');
});

test('s.number test', t => {
	const schema = s.number();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1), 1);

	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.string test', t => {
	const schema = s.string();
	assert.strictEqual(s.parse(schema, ''), '');
	assert.strictEqual(s.parse(schema, 'aaa'), 'aaa');

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.array test', t => {
	const schema = s.array();
	assert.deepEqual(s.parse(schema, []), []);
	assert.deepEqual(s.parse(schema, [1, 2, 3]), [1, 2, 3]);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.object test', t => {
	const schema = s.object();
	assert.deepEqual(s.parse(schema, {}), {});
	assert.deepEqual(s.parse(schema, {a:1, b:2}), {a:1, b:2});

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.function test', t => {
	const schema = s.function();
	const funcA = () => {};
	const funcB = () => {};
	assert.strictEqual(s.parse(schema, funcA), funcA);
	assert.strictEqual(s.parse(schema, funcB), funcB);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

const [major, minor, patch] = process.versions.node.split('.');

test('s.symbol test', {skip: major < 20 ? 'https://github.com/nodejs/node/issues/49135' : false}, t => {
	const schema = s.symbol();
	const symA = Symbol('a');
	const symB = Symbol('b');
	assert.strictEqual(s.parse(schema, symA), symA);
	assert.strictEqual(s.parse(schema, symB), symB);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.null test', t => {
	const schema = s.null();
	assert.strictEqual(s.parse(schema, null), null);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.undefined test', t => {
	const schema = s.undefined();
	assert.strictEqual(s.parse(schema, undefined), undefined);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

test('s.value test', t => {
	const schema = s.value();
	assert.strictEqual(s.parse(schema, 123), 123);
	assert.strictEqual(s.parse(schema, 'some value'), 'some value');
});

test('s.drop test', t => {
	const schema = s.drop();
	assert.strictEqual(s.parse(schema, 123), undefined);
	assert.strictEqual(s.parse(schema, 'some value'), undefined);
});

test('dateSchema test', t => {
	const dateSchema = s.object({class: Date});
	const date = new Date;
	assert.strictEqual(s.parse(dateSchema, date), date);

	assert.throws(() => dateSchema(new Event('something')), 'SchemaMapper should throw errors on bad value.');
});

test('s.or test', t => {
	const schema = s.or(s.boolean(), s.string());
	assert.strictEqual(s.parse(schema, false), false);
	assert.strictEqual(s.parse(schema, true), true);

	assert.strictEqual(s.parse(schema, ""), "");
	assert.strictEqual(s.parse(schema, "string"), "string");

	assert.throws(() => schema(321), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
});

test('s.or param test', t => {
	const schema = s.or(
		s.string({match: /\d\d \w+ \d\d\d\d \d\d:\d\d:\d\d \w+?/})
		, s.object({class: Date})
	);

	const dateObject = new Date;
	const dateString = '04 Apr 1995 00:12:00 GMT';

	assert.strictEqual(s.parse(schema, dateObject), dateObject);
	assert.strictEqual(s.parse(schema, dateString), dateString);

	assert.throws(() => schema([]), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema("bad string"), 'SchemaMapper should throw errors on bad value.');
});

test('usersSchema test', t => {
	const users = JSON.parse(fs.readFileSync('test/users.json', {encoding: 'utf-8'}));

	const usersSchema = s.nTuple(
		(s.sRecord({
			id: s.number({}),
			name: s.string({
				map: s => Tuple(...s.split(' '))
			}),
			username: s.string(),
			email: s.string(),
			address: s.sDict({
				street: s.string(),
				suite: s.string(),
				city: s.string(),
				zipcode: s.string({match: /\d{5}(-\d{4})?/, map: s => Tuple(...s.split('-'))}),
				geo: s.sRecord({
					lat: s.string({map: Number}),
					lng: s.string({map: Number}),
				}),
			}),
			phone: s.string({map: s => Tuple(...s.split(/\W+/).filter(x => x))}),
			website: s.string({map: s => String(new URL('https://' + s))}),
			company: s.sDict({
				name: s.string(),
				catchPhrase: s.string(),
				bs: s.string(),
			}),
		}))
	);

	const usersA = usersSchema(JSON.parse(JSON.stringify(users)));
	const usersB = usersSchema(JSON.parse(JSON.stringify(users)));

	assert.strictEqual(usersA, usersB);
	assert.strictEqual(usersA[0], usersB[0]);
	assert.strictEqual(usersA[9], usersB[9]);

	assert.notEqual(usersA[0], usersB[1]);
});
