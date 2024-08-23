import Tuple from "./Tuple.mjs";
import { size, keys } from "./Tuple.mjs";

const base = Object.create(null);
base.toString = Object.prototype.toString;

base[Symbol.toStringTag] = 'Dict';
base[Symbol.iterator] = function() {
	let index = 0;
	return { next: () => {
		const iteration = index++;
		if(this[size] < index)
		{
			return { done: true };
		}
		return {value: [this[keys][iteration], this[this[keys][iteration]]], done: false };
	}};
};


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

	const tagged = Tuple.bind({args: obj, base, length: keys.length, keys});
	return tagged('dict', Tuple(...keys), Tuple(...values));
}
