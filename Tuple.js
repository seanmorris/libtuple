const WeakMap = globalThis.WeakMap;
const Map     = globalThis.Map;
const refTree = new WeakMap;
const terminator = Object.create(null);
const baseTuple  = Object.create(null);
baseTuple.toString = () => '[Object Tuple]';
Object.freeze(terminator);
Object.freeze(baseTuple);

module.exports = function Tuple(...args)
{
	if(new.target)
	{
		throw new globalThis.Error('"Tuple" is not a constructor. Create a Tuple by invoking the function directly.');
	}

	if(!args.length)
	{
		return '[]';
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
			throw new globalThis.Error('Symbols cannot participate in Tuples (yet).');
		}

		mode = mode ?? canMap;

		if(mode === canMap)
		{
			part.push(arg);
		}
		else
		{
			if(canMap)
			{
				prefix = JSON.stringify(part.map(p => `${typeof p}::${p}`))
			}

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

	if(!mode)
	{
		part = JSON.stringify(part.map(p => `${typeof p}::${p}`))

		if(!map.has(terminator))
		{
			map.set(terminator, {prefixMap: new Map, result: null});
		}

		if(!map.get(terminator).prefixMap.has(part))
		{
			const result = Object.create(baseTuple);
			result.length = args.length;
			Object.assign(result, args);
			Object.freeze(result);

			map.get(terminator).prefixMap.set(part, result);
		}

		return map.get(terminator).prefixMap.get(part);
	}

	if(!map.has(terminator))
	{
		map.set(terminator, {prefixMap: new Map, result: null});
	}

	if(!map.get(terminator).result)
	{
		const result  = Object.create(baseTuple);
		result.length = args.length;
		Object.assign(result, args);
		Object.freeze(result);

		map.get(terminator).result = result;
	}

	return map.get(terminator).result;
}
