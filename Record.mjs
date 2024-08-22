import Tuple from "./Tuple.mjs";

const base = Object.create(null);
base[Symbol.toStringTag] = 'Record';
base.toString = Object.prototype.toString;
const marker = {};
Object.freeze(marker);

export default function BaseRecord(obj = {})
{
	if(new.target)
	{
		throw new Error('"Record" is not a constructor. Create a Record by invoking the function directly.');
	}

	if(!obj || typeof obj !== 'object')
	{
		throw new Error('Parameter must be an object.');
	}

	const entries = Object.fromEntries(Object.entries(obj).sort((a, b) => a[0] < b[0] ? -1 : 1));
	const keys = Object.keys(entries);
	const values = Object.values(entries);

	const tagged = Tuple.bind({args: obj, base});
	return tagged(marker, Tuple(...keys), Tuple(...values));
}
