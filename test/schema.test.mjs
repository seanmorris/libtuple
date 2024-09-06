import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import Schema from '../Schema.mjs';

import Tuple from '../Tuple.mjs';

const s = Schema;

const [major, minor, patch] = process.versions.node.split('.');

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

test('s.integer test', t => {
	const schema = s.integer();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1), 1);
	assert.strictEqual(s.parse(schema, 255), 255);

	assert.throws(() => schema(1.5), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.float test', t => {
	const schema = s.float();
	assert.strictEqual(s.parse(schema, 0), 0);
	assert.strictEqual(s.parse(schema, 1.1), 1.1);
	assert.strictEqual(s.parse(schema, 255), 255);
	assert.strictEqual(s.parse(schema, 255.5), 255.5);

	assert.throws(() => schema(NaN), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.NaN test', t => {
	const schema = s.NaN();
	assert.strictEqual(s.parse(schema, NaN), NaN);
	assert.strictEqual(s.parse(schema, 0/0), NaN);

	assert.throws(() => schema(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.infinity test', t => {
	const schema = s.infinity();
	assert.strictEqual(s.parse(schema, Infinity), Infinity);
	assert.strictEqual(s.parse(schema, -Infinity), -Infinity);
	assert.strictEqual(s.parse(schema, 1/0), Infinity);
	assert.strictEqual(s.parse(schema, -1/0), -Infinity);

	assert.throws(() => schema(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('not a number'), 'SchemaMapper should throw errors on bad value.');
});

test('s.bigint test', t => {
	const schema = s.bigint();
	assert.strictEqual(s.parse(schema, 0n), 0n);
	assert.strictEqual(s.parse(schema, 1n), 1n);

	assert.throws(() => schema(1000), 'SchemaMapper should throw errors on bad value.');
});

test('s.string test', t => {
	const schema = s.string();
	assert.strictEqual(s.parse(schema, ''), '');
	assert.strictEqual(s.parse(schema, 'aaa'), 'aaa');
	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');

	const schemaPrefix = s.string({prefix: 'abcd'});
	assert.strictEqual(s.parse(schemaPrefix, 'abcdefg'), 'abcdefg');
	assert.strictEqual(s.parse(schemaPrefix, 'abcd1234'), 'abcd1234');
	assert.throws(() => schemaPrefix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaPrefix('something'), 'SchemaMapper should throw errors on bad value.');

	const schemaSuffix = s.string({suffix: 'xyz'});
	assert.strictEqual(s.parse(schemaSuffix, 'tuvwxyz'), 'tuvwxyz');
	assert.strictEqual(s.parse(schemaSuffix, '4321xyz'), '4321xyz');
	assert.throws(() => schemaSuffix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaSuffix('something'), 'SchemaMapper should throw errors on bad value.');

	const schemaInfix = s.string({infix: 'ghi'});
	assert.strictEqual(s.parse(schemaInfix, 'abdcefghijkl'), 'abdcefghijkl');
	assert.strictEqual(s.parse(schemaInfix, '001-ghi-002'), '001-ghi-002');
	assert.throws(() => schemaInfix(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schemaInfix('something'), 'SchemaMapper should throw errors on bad value.');
});

test('s.numericString test', t => {
	const schema = s.numericString({map: Number});
	const positive = s.numericString({map: Number, min: Number.EPSILON});
	const negative = s.numericString({map: Number, max: -Number.EPSILON});

	assert.strictEqual(s.parse(schema, '2.25'), 2.25);
	assert.strictEqual(s.parse(schema, '1000000'), 1000000);
	assert.strictEqual(s.parse(schema, '1.00'), 1.00);
	assert.strictEqual(s.parse(schema, '0x29a'), 0x29a);

	assert.strictEqual(s.parse(positive, '2.25'), 2.25);
	assert.strictEqual(s.parse(positive, '1000000'), 1000000);
	assert.strictEqual(s.parse(positive, '1.00'), 1.00);
	assert.strictEqual(s.parse(positive, '0x29a'), 0x29a);

	assert.strictEqual(s.parse(negative, '-2.25'), -2.25);
	assert.strictEqual(s.parse(negative, '-1000000'), -1000000);
	assert.strictEqual(s.parse(negative, '-1.00'), -1.00);

	assert.throws(() => schema('haha wow'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(-10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(-10), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive(0), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative(0), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => positive('0'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => negative('0'), 'SchemaMapper should throw errors on bad value.');
});

test('s.dateString test', t => {
	const schema = s.dateString();
	const after1994 = s.dateString({min: new Date('01/01/1995')});

	assert.deepEqual(s.parse(schema, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.deepEqual(s.parse(after1994, '04 JUL 1995 17:00:00 EDT'), '04 JUL 1995 17:00:00 EDT');
	assert.deepEqual(s.parse(schema, '07/04/1995'), '07/04/1995');
	assert.deepEqual(s.parse(after1994, '07/04/1995'), '07/04/1995');

	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => after1994(new Date('01/01/1989')), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('this is not a date'), 'SchemaMapper should throw errors on bad value.');
});

test('s.uuidString test', t => {
	const schema = s.uuidString();
	assert.strictEqual(s.parse(schema, '00000000-0000-0000-0000-000000000000'), '00000000-0000-0000-0000-000000000000'); // nil
	assert.strictEqual(s.parse(schema, 'acd19070-6b92-11ef-b864-0242ac120002'), 'acd19070-6b92-11ef-b864-0242ac120002'); // v1
	assert.strictEqual(s.parse(schema, '0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'), '0ff5d941-f46a-4f4a-aec8-1d1ec117e2a3'); // v4
	assert.strictEqual(s.parse(schema, '0191c292-fc30-7223-b16c-85c30803cd4d'), '0191c292-fc30-7223-b16c-85c30803cd4d'); // v7
	assert.strictEqual(s.parse(schema, '6b22e05b-8764-4219-bc87-ee2c115a95eb'), '6b22e05b-8764-4219-bc87-ee2c115a95eb'); // gui

	assert.throws(() => schema('this is not a uuid'), 'SchemaMapper should throw errors on bad value.');
});

test('s.urlString test', t => {
	const schema = s.urlString();
	assert.strictEqual(s.parse(schema, 'https://example.com'), 'https://example.com');
	assert.strictEqual(s.parse(schema, 'https://example.com/'), 'https://example.com/');
	assert.strictEqual(s.parse(schema, 'https://www.example.com/'), 'https://www.example.com/');

	assert.throws(() => schema('this is not a url'), 'SchemaMapper should throw errors on bad value.');
});

test('s.emailString test', t => {
	const schema = s.emailString();
	assert.strictEqual(s.parse(schema, 'person@example.co'), 'person@example.co');
	assert.strictEqual(s.parse(schema, 'person@example.com'), 'person@example.com');
	assert.strictEqual(s.parse(schema, 'person@subdomain.example.com'), 'person@subdomain.example.com');
	assert.strictEqual(s.parse(schema, 'person@example.travel'), 'person@example.travel');
	assert.strictEqual(s.parse(schema, 'person.name@example.com'), 'person.name@example.com');

	assert.throws(() => schema('this is not an email'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@.'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@.c'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@example.'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@example.c'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person.example@com'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person@person@example.com'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('person.name@example'), 'SchemaMapper should throw errors on bad value.');
});

test('s.regexString test', t => {
	const schema = s.regexString();
	assert.strictEqual(s.parse(schema, '^$'), '^$');
	assert.strictEqual(s.parse(schema, '.+?'), '.+?');

	assert.throws(() => schema(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('+++'), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('***'), 'SchemaMapper should throw errors on bad value.');
});

test('s.base64String test', t => {
	const schema = s.base64String();
	assert.strictEqual(s.parse(schema, 'RXhhbXBsZSBzdHJpbmc='), 'RXhhbXBsZSBzdHJpbmc=');

	assert.throws(() => schema(''), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => schema('thisisinvalid=='), 'SchemaMapper should throw errors on bad value.');
});

test('s.jsonString test', t => {
	const schema = s.jsonString();
	assert.strictEqual(s.parse(schema, '1234'), '1234');
	assert.strictEqual(s.parse(schema, '"abcd"'), '"abcd"');
	assert.strictEqual(s.parse(schema, '{}'), '{}');
	assert.strictEqual(s.parse(schema, '[]'), '[]');
	assert.strictEqual(s.parse(schema, '[{}, 1, 2]'), '[{}, 1, 2]');

	assert.throws(() => schema('---'), 'SchemaMapper should throw errors on bad value.');
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

test('s.date test', t => {
	const schema = s.date();
	const after1995 = s.date({min: new Date('01/01/1996')});
	const date = new Date();
	assert.deepEqual(s.parse(schema, date), date);
	assert.deepEqual(s.parse(after1995, date), date);

	assert.throws(() => schema({}), 'SchemaMapper should throw errors on bad value.');
	assert.throws(() => after1995(new Date('01/01/1994')), 'SchemaMapper should throw errors on bad value.');
});

test('s.function test', t => {
	const schema = s.function();
	const funcA = () => {};
	const funcB = () => {};
	assert.strictEqual(s.parse(schema, funcA), funcA);
	assert.strictEqual(s.parse(schema, funcB), funcB);

	assert.throws(() => schema(0x29a), 'SchemaMapper should throw errors on bad value.');
});

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

test('s.oneOf test', t => {
	const schema = s.oneOf(['something', 'something else', 'a secret third thing', 1234]);

	assert.strictEqual(s.parse(schema, 1234), 1234);
	assert.strictEqual(s.parse(schema, 'something'), 'something');
	assert.strictEqual(s.parse(schema, 'something else'), 'something else');
	assert.strictEqual(s.parse(schema, 'a secret third thing'), 'a secret third thing');

	assert.throws(() => dateSchema(new Event('not on the list')), 'SchemaMapper should throw errors on bad value.');
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

	assert.strictEqual(s.parse(schema, ''), '');
	assert.strictEqual(s.parse(schema, 'string'), 'string');

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
	assert.throws(() => schema('bad string'), 'SchemaMapper should throw errors on bad value.');
});

test('usersSchema test', t => {
	const users = JSON.parse(fs.readFileSync('test/users.json', {encoding: 'utf-8'}));

	const usersSchema = s.nTuple(
		s.sRecord({
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
			phone: s.string({map: phone => Tuple(...phone.split(/\W+/).filter(x => x))}),
			website: s.string({map: s => String(new URL('https://' + s))}),
			company: s.sDict({
				name: s.string(),
				catchPhrase: s.string(),
				bs: s.string(),
			}),
		})
	);

	const usersA = usersSchema(JSON.parse(JSON.stringify(users)));
	const usersB = usersSchema(JSON.parse(JSON.stringify(users)));

	assert.strictEqual(usersA, usersB);
	assert.strictEqual(usersA[0], usersB[0]);
	assert.strictEqual(usersA[9], usersB[9]);

	assert.notEqual(usersA[0], usersB[1]);
});
