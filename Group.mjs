import Tuple from "./Tuple.mjs";
import { _index, size } from "./Tuple.mjs";

const base = Object.create(null);
base.toString = Object.prototype.toString;
base[Symbol.toStringTag] = 'Group';
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

export default function Group(...args)
{
	if(new.target)
	{
		throw new Error('"Group" is not a constructor. Create a Group by invoking the function directly.');
	}

	const tuples = args.map(a => Tuple(a)).sort((a, b) => a[_index] < b[_index] ? -1 : 1);
	const tagged = Tuple.bind({args: tuples.map(t => t[0]), base});
	return tagged(...tuples, 'group');
}
