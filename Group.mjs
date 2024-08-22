import Tuple from "./Tuple.mjs";

const base = Object.create(null);
base[Symbol.toStringTag] = 'Group';
base.toString = Object.prototype.toString;
const marker = {};
Object.freeze(marker);

export default function Group(...args)
{
	if(new.target)
	{
		throw new Error('"Group" is not a constructor. Create a Group by invoking the function directly.');
	}

	const tuples = args.map(a => Tuple(a)).sort((a, b) => a.index < b.index ? -1 : 1);
	const sorted = tuples.map(t => t[0]);

	const tagged = Tuple.bind({args: sorted, base});
	return tagged(marker, ...tuples);
}
