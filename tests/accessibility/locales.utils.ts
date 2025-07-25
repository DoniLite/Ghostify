/**
 * Get all key paths of a nested object
 * @param obj - The object to extract key paths from
 * @param prefix - The prefix to prepend to each key path
 * @returns An array of key paths
 */
export function getKeyPaths<T extends object>(
	obj: T,
	prefix = '',
): (keyof T)[] {
	let paths: (keyof T)[] = [];

	for (const key in obj) {
		const fullPath = prefix ? `${prefix}.${key}` : key;

		if (typeof obj[key] === 'object' && obj[key] !== null) {
			paths = paths.concat(getKeyPaths(obj[key], fullPath) as (keyof T)[]);
		} else {
			paths.push(fullPath as keyof T);
		}
	}

	return paths;
}
