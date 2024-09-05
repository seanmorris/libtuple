import Tuple from './Tuple.mjs';
import Group from './Group.mjs';
import Record from './Record.mjs';
import Dict from './Dict.mjs';

/**
 * @callback SchemaMapper
 */

/**
 * Maps keys and values to a Record.
 * Will append additional keys as plain values if more values are provided than appear in the schema.
 * @callback RecordMapper
 * @param {Array} args A list of values
 * @returns {Record}
 */

/**
 * Maps keys and values to a Dict.
 * Will append additional keys as plain values if more values are provided than appear in the schema.
 * @callback DictMapper
 * @param {Array} args A list of values
 * @returns {Dict}
 */

const Schema = {
	/**
	 * Map one or more values to a Tuple.
	 * Will append additional properties as unmapped values if more values are provided than appear in the schema.
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	tuple(...schema)
	{
		return (args = [], path = '') => {
			return Tuple(...args.map(
				(arg, index) => schema[index] ? schema[index](arg, `${path || 'root'}[${index}]`): arg
			));
		}
	},

	/**
	 * Map one or more values to a Group.
	 * Will append additional properties as unmapped values if more values are provided than appear in the schema.
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	group(...schema)
	{
		return (args = [], path = '') => {
			return Group(...args.map(
				(arg, index) => schema[index] ? schema[index](arg, `${path || 'root'}[${index}]`): arg
			));
		}
	},

	/**
	 * Map an object to a Record.
	 * Will append additional properties as unmapped values if more values are provided than appear in the schema.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	record(schema = {})
	{
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			return Record(Object.fromEntries(
				entries.map(([key, value]) => [key, schema[key] ? schema[key](value, `${path || 'root'}[${key}]`) : value])
			));
		}
	},

	/**
	 * Map an object to a Record.
	 * Will append additional properties as unmapped values if more values are provided than appear in the schema.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	dict(schema = {})
	{
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			return Dict(Object.fromEntries(
				entries.map(([key, value]) => [key, schema[key] ? schema[key](value, `${path || 'root'}[${key}]`) : value])
			));
		}
	},

	/**
	 * Map n values to a Tuple.
	 * Will append each value in the input to the Tuple using the same mapper.
	 * @param {SchemaMapper} schema - A SchemaMapper
	 */
	nTuple(schema)
	{
		return (args, path) => {
			if(!Array.isArray(args))
			{
				args = [args]
			}

			return Tuple(...args.map((arg, index) => schema ? schema(arg, `${path || 'root'}[${index}]`) : arg));
		}
	},

	/**
	 * Map n values to a Group.
	 * Will append each value in the input to the Group using the same mapper.
	 * @param {SchemaMapper} schema - A list of SchemaMappers
	 */
	nGroup(schema)
	{
		return (args, path = '') => {
			if(!Array.isArray(args))
			{
				args = [args]
			}

			return Group(...args.map((arg, index) => schema ? schema(arg, `${path || 'root'}[${index}]`) : arg));
		}
	},

	/**
	 * Map n keys to a Record.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	nRecord(schema)
	{
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			return Record(Object.fromEntries(
				entries.map(([key, value]) => [key, schema[key] ? schema[key](value, `${path || 'root'}[${key}]`) : value])
			));
		}
	},

	/**
	 * Map n keys to a Dict.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	nDict(schema)
	{
		/**
		 * @type SchemaMapper
		 */
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			return Dict(Object.fromEntries(
				entries.map(([key, value]) => [key, schema[key] ? schema[key](value, `${path || 'root'}[${key}]`) : value])
			));
		}
	},

	/**
	 * Strictly map values to a Tuple.
	 * @throws {TypeError} Will throw if the number of values does not match the number of SchemaMappers
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	sTuple(...schema)
	{
		return (args, path = '') => {
			if(schema.length !== args.length)
			{
				throw new TypeError(`Expected ${schema.length} elements, got ${args.length} elements at ${path || 'root'}.`);
			}
			return Tuple(...args.map(
				(arg, index) => schema[index] ? schema[index](arg, `${path || 'root'}[${index}]`): arg
			));
		}
	},

	/**
	 * Strictly map values to a Group.
	 * @throws {TypeError} Will throw if the number of values does not match the number of SchemaMappers
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	sGroup(...schema)
	{
		return (args, path = '') => {
			if(schema.length !== args.length)
			{
				throw new TypeError(`Expected ${schema.length} elements, got ${args.length} elements at ${path || 'root'}.`);
			}
			return Group(...args.map(
				(arg, index) => schema[index] ? schema[index](arg, `${path || 'root'}[${index}]`): arg
			));
		}
	},

	/**
	 * Strictly map an object to a Record.
	 * @throws {TypeError} Will throw if the properties provided do not match the keys of the SchemaMappers.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	sRecord(schema = {})
	{
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			const schemaLength = Object.keys(schema).length;
			if(schemaLength > entries.length)
			{
				throw new TypeError(`Expected ${schemaLength} elements, got ${entries.length} elements at ${path || 'root'}.`);
			}
			return Record(Object.fromEntries(
				entries.map(([key, value]) => {
					if(!(key in schema))
					{
						throw new TypeError(`Extra key "${key}" not found in schema at ` + (path ? `${path}[${key}]` : key));
					}
					return [key, schema[key](value, path ? `${path}[${key}]` : key)]
				})
			));
		}
	},

	/**
	 * Strictly map an object to a Dict.
	 * @throws {TypeError} Will throw if the properties provided do not match the keys of the SchemaMappers.
	 * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	sDict(schema = {})
	{
		return (arg, path = '') => {
			const entries = Object.entries(arg);
			const schemaLength = Object.keys(schema).length;
			if(schemaLength > entries.length)
			{
				throw new TypeError(`Expected ${schemaLength} elements, got ${entries.length} elements at ${path || 'root'}.`);
			}
			return Dict(Object.fromEntries(
				entries.map(([key, value]) => {
					if(!(key in schema))
					{
						throw new TypeError(`Extra key "${key}" not found in schema at ` + (path ? `${path}[${key}]` : key));
					}
					return [key, schema[key](value, path ? `${path}[${key}]` : key)]
				})
			));
		}
	},

	/**
	 * Exclusively map values to a Record.
	 * Will drop any keys not present in the schema.
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	xTuple(...schema)
	{
		return (args, path = '') => {
			if(schema.length > args.length)
			{
				throw new TypeError(`Expected ${schema.length} elements, got ${args.length} elements at ${path || 'root'}.`);
			}
			return Tuple(...schema.map(
				(schema, index) => schema(args[index], `${path || 'root'}[${index}]`)
			));
		}
	},

	/**
	 * Exclusively map values to a Group.
	 * Will drop any keys not present in the schema.
	 * @param {...SchemaMapper} schema A list of SchemaMappers
	 */
	xGroup(...schema)
	{
		return (args, path = '') => {
			if(schema.length > args.length)
			{
				throw new TypeError(`Expected ${schema.length} elements, got ${args.length} elements at ${path || 'root'}.`);
			}
			return Group(...schema.map(
				(schema, index) => schema(args[index], `${path || 'root'}[${index}]`)
			));
		}
	},

	/**
	 * Exclusively map an object to a Record.
	 * Will drop any keys not present in the schema.
	  * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	xRecord(schema)
	{
		return (arg, path = '') => {
			const schemaEntries = Object.entries(schema);
			return Record(Object.fromEntries(
				schemaEntries.map(([key, schema]) => [key, schema(arg[key], `${path || 'root'}[${key}]`)])
			));
		}
	},

	/**
	 * Exclusively map an object to a Dict.
	 * Will drop any keys not present in the schema.
	  * @param {Object.<string, SchemaMapper>} schema - An Object holding SchemaMappers
	 */
	xDict(schema)
	{
		return (arg, path = '') => {
			const schemaKeys = Object.keys(schema);
			return Dict(Object.fromEntries(
				schemaKeys.map((key) => [key, schema[key](arg[key], `${path || 'root'}[${key}]`)])
			));
		}
	},

	/**
	 * Validate a boolean
	 * @param {Object} options
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	boolean(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'boolean')
			{
				throw new TypeError(`Expected boolean, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate a number
	 * @param {Object} options
	 * @param {number} options.max Max value
	 * @param {number} options.min Min value
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	number(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'number')
			{
				throw new TypeError(`Expected number, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if('max' in options && options.max < value)
			{
				throw new TypeError(`Expected max ${options.max}, got ${value} at ${path || 'root'}`);
			}
			if('min' in options && options.min > value)
			{
				throw new TypeError(`Expected min ${options.min}, got ${value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate a string
	 * @param {Object} options
	 * @param {number} options.max Max length
	 * @param {number} options.min Min length
	 * @param {Regex} options.match Throw a TypeError if this does NOT match
	 * @param {Regex} options.noMatch Throw a TypeError if this DOES match
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	string(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'string')
			{
				throw new TypeError(`Expected string, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if('max' in options && options.max < value.length)
			{
				throw new TypeError(`Expected max length ${options.max}, got "${value}" at ${path || 'root'}`);
			}
			if('min' in options && options.min > value.length)
			{
				throw new TypeError(`Expected min length ${options.min}, got "${value}" at ${path || 'root'}`);
			}
			if(options.match && !value.match(options.match))
			{
				throw new TypeError(`Expected string to match ${options.match}, got "${value}" at ${path || 'root'}`);
			}
			if(options.noMatch && value.noMatch(options.noMatch))
			{
				throw new TypeError(`Expected string NOT to match ${options.noMatch}, got "${value}" at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate an array
	 * @param {Object} options
	 * @param {number} options.max Max length
	 * @param {number} options.min Min length
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 * @param {function(any):each} options.each Transform each value in the array, after its been validated..
	 */
	array(options = {})
	{
		return (value, path = '') => {
			if(!Array.isArray(value))
			{
				throw new TypeError(`Expected Array, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if('max' in options && options.max < value.length)
			{
				throw new TypeError(`Expected max length ${options.max}, got "${value.length}" at ${path || 'root'}`);
			}
			if('min' in options && options.min > value.length)
			{
				throw new TypeError(`Expected min length ${options.min}, got "${value.length}" at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			if(options.each)
			{
				value = value.map(options.each);
			}
			return value;
		};
	},

	/**
	 * Validate an object
	 * @param {Object} options
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):class} options.class Throw a TypeError if the class does not match.
	 * @param {function(any):any} options.map Transform the object after its been validated.
	 * @param {function(any):each} options.each Transform each entry in the object, after its been validated.
	 */
	object(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'object')
			{
				throw new TypeError(`Expected object, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if(options.class && !(value instanceof options.class))
			{
				throw new TypeError(`Expected object of type ${options.class.name}, got Object of type ${value.constructor ? value.constructor.name : 'null'} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			if(options.each)
			{
				value = Object.fromEntries(Object.entries(value).map(options.each));
			}
			return value;
		};
	},

	/**
	 * Validate a function
	 * @param {Object} options
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	function(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'function')
			{
				throw new TypeError(`Expected function, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate a symbol
	 * @param {Object} options
	 * @param {function(any):boolean} options.check Throw a TypeError if this returns false.
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	symbol(options = {})
	{
		return (value, path = '') => {
			if(typeof value !== 'symbol')
			{
				throw new TypeError(`Expected symbol, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.check && !options.check(value))
			{
				throw new TypeError(`Validation failed! got ${value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate a null
	 * @param {Object} options
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	null(options = {})
	{
		return (value, path = '') => {
			if(value !== null)
			{
				throw new TypeError(`Expected null, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Validate an undefined
	 * @param {Object} options
	 * @param {function(any):any} options.map Transform the value after its been validated.
	 */
	undefined(options = {})
	{
		return (value, path = '') => {
			if(value !== undefined)
			{
				throw new TypeError(`Expected undefined, got ${typeof value} at ${path || 'root'}`);
			}
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Return the value
	 * @param {Object} options
	 * @param {function(any):any} options.map Transform the value.
	 */
	value(options = {})
	{
		return value => {
			if(options.map)
			{
				value = options.map(value);
			}
			return value;
		};
	},

	/**
	 * Drop the value (always maps to `undefined`)
	 */
	drop()
	{
		return () => undefined;
	},

	/**
	 * Map the value with the first matching SchemaMapper
	 * @param  {...function(options):value} mappers
	 */
	or(...mappers)
	{
		return (value, path) => {
			const errors = [];
			for(const mapper of mappers)
			{
				try
				{
					return mapper(value, path);
				}
				catch(error)
				{
					errors.push(error);
				}
			}

			const multi = new Error(errors.map(e => e.message).join(", "));
			multi.errors = errors;
			throw multi;
		};
	},

	/**
	 * Repeat a SchemaMapper n times
	 * @param {number} n The number of times to repeat.
	 * @param {SchemaMapper} schema The SchemaMapper to repeat.
	 */
	repeat(n, schema)
	{
		return Array(n).fill(schema);
	},

	/**
	 * Safely parse a Schema into an immutable structure.
	 * Returns NaN on error. This is helpful because `NaN !== NaN`, and its falsey.
	 * @param {SchemaMapper} schema The Schema to parse by.
	 * @param {values} any The values to parse.
	 * @returns {object|NaN}
	 */
	parse(schema, values)
	{
		try
		{
			return schema(values);
		}
		catch(error)
		{
			console.error(error);
			return NaN;
		}
	}
};

Object.freeze(Schema);

export default Schema;
