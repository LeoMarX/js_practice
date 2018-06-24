function cacheFn(fn) {
	let cache = {};

	return function() {
		let args = [...arguments].join(',');

		if(cache[args]) {
			return cache[args];
		}

		return cache[args] = fn(...arguments);
	}
}