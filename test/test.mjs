import test from 'node:test';
import assert from 'node:assert/strict';

import Tuple from '../Tuple.mjs';
import Group from '../Group.mjs';
import Record from '../Record.mjs';
import Dict from '../Dict.mjs';

import { size } from "../Tuple.mjs";

const tests  = [];

tests.push(test('toString Tag Test', t => {
	const group = Group();
	const record = Record();
	const tuple = Tuple();

	assert.strictEqual(String(group),  '[object Group]');
	assert.strictEqual(String(record), '[object Record]');
	assert.strictEqual(String(tuple),  '[object Tuple]');
}));

tests.push(test('Null Tuple Test', t => {
	assert.strictEqual(Tuple(), Tuple());
}));

tests.push(test('Identical Primitive Test', t => {
	for(let i = 0; i < 100; i++)
	{
		const numbers = Array(i).fill(0).map((_,k) => k);

		const numbersA = numbers.slice();
		const numbersB = numbers.slice();

		assert.strictEqual(Tuple(...numbersA), Tuple(...numbersB));
	}
}));

tests.push(test('Non Identical Primitive Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const numbers = Array(i).fill(0).map((_,k) => k);

		const numbersA = numbers.slice();
		const numbersB = numbers.slice();

		numbersB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...numbersA), Tuple(...numbersB));
	}
}));

tests.push(test('Null vs Undefined', t => {
	assert.notEqual(Tuple(null), Tuple(void 0));
}));

tests.push(test('Identical Object Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const objects = Array(i).fill(0).map((_,k) => ({}));
		const objectsA = objects.slice();
		const objectsB = objects.slice();

		assert.strictEqual(Tuple(...objectsA), Tuple(...objectsB));
	}
}));

tests.push(test('Non Identical Object Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const objects = Array(i).fill(0).map((_,k) => ({}));
		const objectsA = objects.slice();
		const objectsB = objects.slice();

		objectsB[ Math.trunc(i/2) ] = {};

		assert.notEqual(Tuple(...objectsA), Tuple(...objectsB));
	}
}));

tests.push(test('Identical Interpolated 2 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 2 ? k : {} );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Non Identical Interpolated 2 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}

	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 2 ? k : {[k]:k} );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Identical Interpolated 3 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 3 ? k : {} );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Non Identical Interpolated 3 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}

	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 3 ? k : {[k]:k} );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Identical Interpolated 4 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 4 ? k : {} );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Non Identical Interpolated 4 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}

	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 4 ? k : {[k]:k} );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Identical Interpolated 5 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 5 ? {[k]:k} : k );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 5 ? k : {} );
		const mixedA = mixed.slice();
		const mixedB = mixed.slice();

		assert.strictEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Non Identical Interpolated 5 Test', t => {
	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 5 ? {[k]:k} : k );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}

	for(let i = 1; i < 100; i++)
	{
		const mixed = Array(i).fill(0).map((_,k) => k % 5 ? k : {[k]:k} );
		const mixedA = mixed.slice(0);
		const mixedB = mixed.slice(0);

		mixedB[ Math.trunc(i/2) ] = 'CHANGED';

		assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
	}
}));

tests.push(test('Scalar Subset Test', t => {
	const numbers  = Array(100).fill(0).map((_,k) => ({}));
	const numbersA = numbers.slice();
	for(let i = 1; i < 100; i++)
	{
		const numbersB = numbers.slice(0,i);
		assert.notEqual(Tuple(...numbersA), Tuple(...numbersB));
	}
}));

tests.push(test('Object Subset Test', t => {
	const objects  = Array(100).fill(0).map((_,k) => ({}));
	const objectsA = objects.slice();
	for(let i = 1; i < 100; i++)
	{
		const objectsB = objects.slice(0,i);
		assert.notEqual(Tuple(...objectsA), Tuple(...objectsB));
	}
}));

tests.push(test('Interpolated 2 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Interpolated 3 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Interpolated 4 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Switched Scalar Subset Test', t => {
	const numbers  = Array(100).fill(0).map((_,k) => ({}));
	const numbersA = numbers.slice();
		for(let i = 1; i < 100; i++)
	{
		const numbersB = numbers.slice(0,i);
		assert.notEqual(Tuple(...numbersB), Tuple(...numbersA));
	}
}));

tests.push(test('Switched Object Subset Test', t => {
	const objects  = Array(100).fill(0).map((_,k) => ({}));
	const objectsA = objects.slice();
		for(let i = 1; i < 100; i++)
	{
		const objectsB = objects.slice(0,i);
		assert.notEqual(Tuple(...objectsB), Tuple(...objectsA));
	}
}));

tests.push(test('Switched Interpolated 2 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Switched Interpolated 3 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Switched Interpolated 4 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Changed Scalar Subset Test', t => {
	const numbers  = Array(100).fill(0).map((_,k) => ({}));
	const numbersA = numbers.slice();
	for(let i = 1; i < 100; i++)
	{
		const numbersB = numbers.slice(0,i);
		numbersB[ Math.trunc(i/2) ] = 'CHANGED';
		assert.notEqual(Tuple(...numbersA), Tuple(...numbersB));
	}
}));

tests.push(test('Changed Object Subset Test', t => {
	const objects  = Array(100).fill(0).map((_,k) => ({}));
	const objectsA = objects.slice();
	for(let i = 1; i < 100; i++)
	{
		const objectsB = objects.slice(0,i);
		objectsB[ Math.trunc(i/2) ] = 'CHANGED';
		assert.notEqual(Tuple(...objectsA), Tuple(...objectsB));
	}
}));

tests.push(test('Changed Interpolated 2 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Changed Interpolated 3 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Changed Interpolated 4 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedA), Tuple(...mixedB));
		}
	}
}));

tests.push(test('Switched Changed Scalar Subset Test', t => {
	const numbers  = Array(100).fill(0).map((_,k) => ({}));
	const numbersA = numbers.slice();
	for(let i = 1; i < 100; i++)
	{
		const numbersB = numbers.slice(0,i);
		numbersB[ Math.trunc(i/2) ] = 'CHANGED';
		assert.notEqual(Tuple(...numbersB), Tuple(...numbersA));
	}
}));

tests.push(test('Switched Changed Object Subset Test', t => {
	const objects  = Array(100).fill(0).map((_,k) => ({}));
	const objectsA = objects.slice();
	for(let i = 1; i < 100; i++)
	{
		const objectsB = objects.slice(0,i);
		objectsB[ Math.trunc(i/2) ] = 'CHANGED';
		assert.notEqual(Tuple(...objectsB), Tuple(...objectsA));
	}
}));

tests.push(test('Switched Changed Interpolated 2 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 2 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Switched Changed Interpolated 3 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 3 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Switched Changed Interpolated 4 Subset Test', t => {
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? {[k]:k} : k );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
	{
		const mixed = Array(100).fill(0).map((_,k) => k % 4 ? k : {[k]:k} );
		const mixedA = mixed.slice();

		for(let i = 1; i < 100; i++)
		{
			const mixedB = mixed.slice(0,i);
			mixedB[ Math.trunc(i/2) ] = 'CHANGED';
			assert.notEqual(Tuple(...mixedB), Tuple(...mixedA));
		}
	}
}));

tests.push(test('Group Property Test', t => {
	const g1 = Group(1, 2, 3);
	const g2 = Group(3, 2, 1);

	assert.strictEqual(g1, g2);
	assert.strictEqual(g1[0], g2[0]);
	assert.strictEqual(g1[1], g2[1]);
	assert.strictEqual(g1[2], g2[2]);

	assert.strictEqual(g1[size], 3);
	assert.strictEqual(g2[size], 3);
}));

tests.push(test('Group Equality Test', t => {
	assert.strictEqual(Group(), Group());
	assert.strictEqual(Group(1), Group(1));
	assert.strictEqual(Group(1, 2), Group(2, 1));
	assert.strictEqual(Group(1, 2, 3), Group(3, 2, 1));
}));

tests.push(test('Record Equality Test', t => {
	const [a ,b, c] = [1, 2, 3];
	assert.strictEqual(Record({}), Record({}));
	assert.strictEqual(Record({a}), Record({a}));
	assert.strictEqual(Record({a, b}), Record({b, a}));
	assert.strictEqual(Record({a, b, c}), Record({c, b, a}));
	assert.strictEqual(Record({c: 0, b: 1, a: 2}), Record({a: 2, b: 1, c: 0}));
	assert.strictEqual(Record({c: 0, b: 1, a: 2})[size], 3);
}));

tests.push(test('Record Property Test', t => {
	const record = Record({b: 1, a: 2});
	assert.strictEqual(record.b, 1);
}));

tests.push(test('Dict Equality Test', t => {
	const [a ,b, c] = [1, 2, 3];
	assert.strictEqual(Dict({}), Dict({}));
	assert.strictEqual(Dict({a}), Dict({a}));
	assert.strictEqual(Dict({a, b}), Dict({a, b}));
	assert.strictEqual(Dict({a, b, c}), Dict({a, b, c}));
	assert.strictEqual(Dict({a: 2, b: 1, c: 0}), Dict({a: 2, b: 1, c: 0}));
	assert.notEqual(Dict({a: 2, b: 1, c: 0}), Dict({a: 2, b: 1, c: 1}));
	assert.notEqual(Dict({c: 0, b: 1, a: 2}), Dict({a: 2, b: 1, c: 0}));
	assert.strictEqual(Dict({c: 0, b: 1, a: 2})[size], 3);
}));

tests.push(test('Dict Property Test', t => {
	assert.strictEqual(Dict({b: 1, a: 2}).b, 1);
}));

const [major, minor, patch] = process.versions.node.split('.');

tests.push(test('Symbol Tuple Test', {skip: major < 20 ? 'https://github.com/nodejs/node/issues/49135' : false}, t => {
	const tuple = Tuple();
	const symbol = Symbol();
	const object = {};
	assert.strictEqual(Tuple( symbol ), Tuple( symbol ));
	assert.strictEqual(Tuple( symbol, 'aaa' ), Tuple( symbol, 'aaa' ));
	assert.strictEqual(Tuple( symbol, object ), Tuple( symbol, object ));
	assert.notEqual(Tuple( Symbol() ), Tuple( Symbol() ));
	assert.notEqual(Tuple( symbol, 'aaa' ), Tuple( symbol, 'bbb' ));
	assert.notEqual(Tuple( 'aaa', symbol ), Tuple( symbol, 'aaa' ));
	assert.notEqual(Tuple( symbol, object ), Tuple( object, symbol ));
	assert.notEqual(Tuple( symbol, object ), Tuple( symbol, {} ));
}));

tests.push(test('bigint Tuple Test', t => {
	const bigZero = 0n;
	const bigOne = 1n;
	const bigMillion = 1_000_000n;

	assert.strictEqual(Tuple( bigZero ), Tuple( bigZero ));
	assert.strictEqual(Tuple( bigZero, bigOne ), Tuple( bigZero, bigOne ));
	assert.strictEqual(Tuple( bigZero, bigOne, bigMillion ), Tuple( bigZero, bigOne, bigMillion ));
	assert.strictEqual(Tuple( bigOne ), Tuple( bigOne ));
	assert.strictEqual(Tuple( bigMillion ), Tuple( bigMillion ));
	assert.notEqual(Tuple( bigZero ), Tuple( bigOne ));
}));

tests.push(test('Iterator Test', t => {
	const tuple = Tuple(1, 2, 3);
	assert.deepEqual([...tuple], [1, 2, 3]);

	const group = Group(1, 2, 3);
	assert.deepEqual([...group], [1, 2, 3]);

	const record = Record({a:1, b:2, c:3});
	assert.deepEqual({...record}, {a:1, b:2, c:3});

	const dict = Dict({a:1, b:2, c:3});
	assert.deepEqual({...dict}, {a:1, b:2, c:3});
}));

tests.push(test('Tuple JSON Test', t => {
	const t1 = Tuple(1, 2, 3);
	assert.strictEqual(JSON.stringify(t1), '[1,2,3]');
}));

tests.push(test('Group JSON Test', t => {
	const g1 = Group(1, 2, 3);
	assert.strictEqual(JSON.stringify(g1), '[1,2,3]');
}));

tests.push(test('Record JSON Test', t => {
	const r1 = Record({id: 1, name: 'Test'});
	assert.strictEqual(JSON.stringify(r1), '{"id":1,"name":"Test"}');
}));

tests.push(test('Dict JSON Test', t => {
	const d1 = Dict({id: 1, name: 'Test'});
	assert.strictEqual(JSON.stringify(d1), '{"id":1,"name":"Test"}');
}));

test(`Ensure memory isn\'t leaking for scalar keys`, async t => {
	await Promise.allSettled(tests)

	await new Promise(accept => setTimeout(accept, 1));
	for (let i = 0; i < 300; i++) {
		global.gc();
	}

	await new Promise(accept => setTimeout(accept, 1));
	for (let i = 0; i < 300; i++) {
		global.gc();
	}

	assert.strictEqual(0, Tuple.scalarsCached);
});
