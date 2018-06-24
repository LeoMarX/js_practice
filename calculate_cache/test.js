/* global cacheFn */

function mult(...nums) {
	let time = new Date().getTime();

	while (new Date().getTime() - time < 300) { // cost 300 ms
		// do nothing
	}

	return nums.reduce((total, cur) => {
		return total * cur;
	});
}


console.time('nocache');
mult(10, 20, 30, 40, 80);
console.timeEnd('nocache');

var multCache = cacheFn(mult);

console.time('addcache1');
multCache(10, 20, 30, 40, 80);
console.timeEnd('addcache1');

console.time('addcache2');
multCache(10, 20, 30, 40, 80);
console.timeEnd('addcache2');
