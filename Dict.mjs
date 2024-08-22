import Tuple from "./Tuple.mjs";

const base = Object.create(null);
base[Symbol.toStringTag] = 'Dict';
base.toString = Object.prototype.toString;
const marker = {};
Object.freeze(marker);

export default function Dict(obj = {})
{
	if(new.target)
	{
		throw new Error('"Dict" is not a constructor. Create a Record by invoking the function directly.');
	}

	if(!obj || typeof obj !== 'object')
	{
		throw new Error('Parameter must be an object.');
	}

	const keys = Object.keys(obj);
	const values = Object.values(obj);

	const tagged = Tuple.bind({args: obj, base, length: keys.length});
	return tagged(marker, Tuple(...keys), Tuple(...values));
}
