/**
 * @see http://ife.baidu.com/2017/course/detail/id/21
 */

class Watcher {
	constructor({defaultFn} = {}) {
		this._watch = {};
		this._defaultFn = defaultFn;
	}

	on(key, fn) {
		if(isArray(this._watch[key])) {
			this._watch[key].push(fn);
		} else {
			this._watch[key] = [fn];
		}
	
		return () => {
			let fns = this._watch[key] || [];
			this._watch[key] = fns.filter(_fn => _fn != fn);
		};
	}

	emit(key, ...data) {
		let fns = this._watch[key];

		if(!(isArray(fns) && fns.length > 0)) {
			isFunction(this._defaultFn) && this._defaultFn(...data);
			return false;
		}
	
		fns.forEach(fn => {
			fn(...data);
		});
		return true;
	}
}


class Observer {
	constructor(dataObj) {
		this.data = Object.assign({}, dataObj);

		this.bindProp(this.data);
		this.Watcher = new Watcher({defaultFn: (prop, newVal) => {
			console.log(`你设置了 ${prop}, 新值为 ${newVal}`);
		}});
	}

	bindProp(obj, currentPath = '') {
		for(let k in obj) {
			let path = currentPath.length ? currentPath + '.' + k : k;
			let prop = k;
	
			_bind.call(this, obj, prop, path);
	
			if(isObject(obj[k])) {
				this.bindProp(obj[k], path);
			}
		}
	}

	$watch(key, fn) {
		return this.Watcher.on(key, fn);
	}
}

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
			let oldVal = val;
			val = newVal;

			if(isObject(newVal)) {
				that.bindProp(val, path);
			}
			
			emitAllPath(path, prop, newVal, oldVal);
		}
	});

	function emitAllPath(path, ...data) {
		let arr = path.split('.');
		let lens = arr.length;

		arr.forEach((p, i) => {
			let _path = arr.slice(0, lens-i).join('.');

			that.Watcher.emit(_path, ...data);
		});
	}
}


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


/* test Observer */
var app1 = new Observer({a:1, b:2, c: {d: 4, e: {f: 5}, g: function() {console.log('g');}}});

/* test $watch */
var rm1 = app1.$watch('c.e.f', (data1, data2) => console.log('$watch f', data1, data2));
var rm2 = app1.$watch('c', (data1, data2) => console.log('$watch c', data1, data2));

/* set prop c */
// app1.data.c = {d: 4, e: {f: 5}, g: function() {console.log('g2');}};

/* set prop g */
// app1.data.c.g = 3;
