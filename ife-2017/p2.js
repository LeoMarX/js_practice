/**
 * @see http://ife.baidu.com/2017/course/detail/id/20
 */

/**
 * set object property
 * 
 * @param {Object} dataObj
 * @returns {Object}
 */
function Observer(dataObj) {
	this.data = Object.assign({}, dataObj);
	this.Watcher = new Watcher((prop, newVal) => {
		console.log(`你设置了 ${prop}, 新值为 ${newVal}`);
	});
    
	this.bindProp(this.data);

	return this;
}

Observer.prototype.bindProp = function (obj, currentPath = '') {
	for(let k in obj) {
		let path = currentPath.length ? currentPath + '.' + k : k;
		let prop = k;

		_bind.call(this, obj, prop, path);

		if(isObject(obj[k])) {
			this.bindProp(obj[k], path);
		}
	}
};

Observer.prototype.$watch = function(key, fn) {
	return this.Watcher.on(key, fn);
};

function _bind(target, prop, path) {
	let val = target[prop];
	let that = this;

	Object.defineProperty(target, prop, {
		configurable: true,
		enumerable: true,
		get() {
			console.log(`你访问了 ${prop}`);
			return val;
		},
		set(newVal) {
			val = newVal;

			if(isObject(newVal)) {
				this.bindProp(val, prop);
			}
            
			that.Watcher.emit(path, prop, newVal);
		}
	});
}

function Watcher(defaultFn) {
	this._watcher = {};
	this.defaultFn = defaultFn;
}

Watcher.prototype.on = function(key, fn) {
	if(isArray(this._watcher[key])) {
		this._watcher[key].push(fn);
	} else {
		this._watcher[key] = [fn];
	}

	return () => {
		let fns = this._watcher[key] || [];
		this._watcher[key] = fns.filter(_fn => _fn != fn);
	};
};

Watcher.prototype.emit = function(key, ...data) {
	let fns = this._watcher[key];

	if(!(isArray(fns) && fns.length > 0)) {
		isFunction(this.defaultFn) && this.defaultFn(...data);
		return false;
	}

	fns.forEach(fn => {
		fn(...data);
	});
	return true;
};

/* tools */
function isObject(data) {
	return typeof data === 'object' && data !== null;
}

function isFunction(data) {
	return typeof data === 'function';
} 

function isArray(data) {
	return Array.isArray(data);
}

/* test function */
function getAllPath(obj) {
	let pathAll = [];
	addPath(obj);

	function addPath(_obj, currentPath = '') {
		for(let k in _obj) {
			let path = currentPath.length ? currentPath + '.' + k : k;
			let prop = k;

			pathAll.push(path);
			console.log(prop, ': ', _obj);

			if(isObject(_obj[k])) {
				addPath(_obj[k], path);
			}
		}
	}
	return pathAll;
}

/* test Watcher */
// let wt = new Watcher;
// wt.on('test', (...data) => console.log('test1: ', ...data));
// let fn2 = wt.on('test', data => console.log('test2:', data));
// wt.emit('test', 1, 2, 3);

/* test Observer */
var app1 = new Observer({a:1, b:2, c: {d: 4, e: {f: 5}, g: function() {console.log('g');}}});

/* test $watch */
var rm1 = app1.$watch('c.g', (data1, data2) => console.log('$watch', data1, data2));

/* set prop c */
// app1.data.c = {d: 4, e: {f: 5}, g: function() {console.log('g2');}};

/* set prop g */
// app1.data.c.g = 3;