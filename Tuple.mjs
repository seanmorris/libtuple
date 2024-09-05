const refTree = new WeakMap;
const scalarMap = new Map;
const terminator = Object.create(null);

export const size = Symbol('size');
export const _index = Symbol('index');
export const keys = Symbol('keys');

const base = Object.create(null);
base.toString = Object.prototype.toString;
base[Symbol.toStringTag] = 'Tuple';
base.toJSON = function() {
	return [...this];
}
base[Symbol.iterator] = function() {
	let index = 0;
	return { next: () => {
		const iteration = index++;
		if(this[size] < index)
		{
			return { done: true };
		}
		return { value: this[iteration], done: false };
	}};
};

let index = 0;

Object.freeze(terminator);
Object.freeze(base);

const registry = new FinalizationRegistry(held => scalarMap.delete(held));

export default function Tuple(...args)
{
	if(new.target)
	{
		throw new Error('"Tuple" is not a constructor. Create a Tuple by invoking the function directly.');
	}

	let prefix = null;
	let mode   = null;
	let maps   = null;
	let part   = [];
	let map    = refTree;

	for(const arg of args)
	{
		const type   = typeof arg;
		const canMap = arg !== null && (type === 'object' || type === 'symbol' || type === 'function');

		prefix = null;

		if(type === 'symbol' && Symbol.keyFor(arg))
		{
			throw new Error('Registered symbols (`Symbol.for(...)`) cannot participate in Tuples.');
		}

		mode = mode ?? canMap;

		if(mode === canMap)
		{
			part.push(arg);
		}
		else if(canMap)
		{
			prefix = JSON.stringify(part.map(p => `${typeof p}::${p}`))
		}
		else
		{
			part = [arg];
		}

		mode = canMap;

		if(!canMap)
		{
			continue;
		}

		if(!map.has(arg))
		{
			map.set(arg, {map: new WeakMap, prefixMap: new Map});
		}

		maps = map.get(arg);
		map  = maps.map;

		if(prefix)
		{
			if(!maps.prefixMap.has(prefix))
			{
				maps.prefixMap.set(prefix, new WeakMap);
			}

			map = maps.prefixMap.get(prefix);
		}
	}

	if(!map.has(terminator))
	{
		map.set(terminator, {prefixMap: new Map, result: null});
	}

	if(!mode)
	{
		part = JSON.stringify(part.map(p => `${typeof p}::${p}`));

		if(!maps)
		{
			const a = (this ? this.args : args);
			const result = Object.create(this ? this.base : base);
			const length = Array.isArray(a) ? a.length : Object.keys(a).length;
			Object.assign(result, a);
			Object.defineProperties(result, {
				length: {value: length},
				[size]: {value: length},
				[keys]: {value: this && this.keys},
				[_index]: {value: index++}
			});
			Object.freeze(result);

			if(!scalarMap.has(part))
			{
				registry.register(result, part);
				scalarMap.set(part, new WeakRef(result));
				return result;
			}
			else
			{
				return scalarMap.get(part).deref();
			}
		}

		if(!map.get(terminator).prefixMap.has(part))
		{
			const a = (this ? this.args : args);
			const result = Object.create(this ? this.base : base);
			const length = Array.isArray(a) ? a.length : Object.keys(a).length;
			Object.assign(result, a);
			Object.defineProperties(result, {
				length: {value: length},
				[size]: {value: length},
				[keys]: {value: this && this.keys},
				[_index]: {value: index++}
			});
			Object.freeze(result);

			map.get(terminator).prefixMap.set(part, result);
		}

		return map.get(terminator).prefixMap.get(part);
	}

	if(!map.get(terminator).result)
	{
		const a = (this ? this.args : args);
		const result = Object.create(this ? this.base : base);
		const length = Array.isArray(a) ? a.length : Object.keys(a).length;
		Object.assign(result, a);
		Object.defineProperties(result, {
			length: {value: length},
			[size]: {value: length},
			[keys]: {value: this && this.keys},
			[_index]: {value: index++}
		});
		Object.freeze(result);

		map.get(terminator).result = result;
	}

	return map.get(terminator).result;
}

Object.defineProperty(Tuple, 'scalarsCached', {get: () => scalarMap.size});
