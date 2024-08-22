const refTree = new WeakMap;
const scalarMap = new Map;
const terminator = Object.create(null);

const baseTuple = Object.create(null);
baseTuple[Symbol.toStringTag] = 'Tuple';
baseTuple.toString = Object.prototype.toString;

let index = 0;

Object.freeze(terminator);
Object.freeze(baseTuple);

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
		const canMap = arg !== null && (type === 'object' || type === 'function');

		prefix = null;

		if(type === 'symbol')
		{
			throw new Error('Symbols cannot participate in Tuples.');
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
		part = JSON.stringify(part.map(p => `${typeof p}::${p}`))

		if(!maps)
		{
			const result = Object.create(this ? this.base : baseTuple);
			Object.assign(result, {length: (this ? this.length : args.length), index: index++, ...(this ? this.args : args)});
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
			const result = Object.create(this ? this.base : baseTuple);
			Object.assign(result, {length: (this ? this.length : args.length), index: index++, ...(this ? this.args : args)});
			Object.freeze(result);

			map.get(terminator).prefixMap.set(part, result);
		}

		return map.get(terminator).prefixMap.get(part);
	}

	if(!map.get(terminator).result)
	{
		const result = Object.create(this ? this.base : baseTuple);
		Object.assign(result, {length: (this ? this.length : args.length), index: index++, ...(this ? this.args : args)});
		Object.freeze(result);

		map.get(terminator).result = result;
	}

	return map.get(terminator).result;
}

Object.defineProperty(Tuple, 'scalarsCached', {get: () => scalarMap.size});
