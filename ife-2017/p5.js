/**
 * @see http://ife.baidu.com/2017/course/detail/id/24
 */

/* Watcher */
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
			this.off(key, fn);
		};
	}

	off(key, fn) {
		let fns = this._watch[key];

		if(!fns) return;

		if(fn) {
			this._watch[key] = fns.filter(_fn => _fn !== fn);
		} else {
			delete this._watch[key];
		}
	}

	emit(key, ...data) {
		let fns = this._watch[key];

		if(!(isArray(fns) && fns.length > 0)) {
			isFunction(this._defaultFn) && this._defaultFn(...data);
			return false;
		}
	
		fns.forEach(fn => {
			fn.call(this, ...data);
		});
		return true;
	}
}

/* Observer */
class Observer {
	constructor(dataObj) {
		this.data = Object.assign({}, dataObj.data);

		this.bindProp(this.data);
		this.Watcher = new Watcher({defaultFn: dataObj.dataWatcher || function(curPath, triggerPath, oldVal, newVal) {
			console.log(`你设置了 ${triggerPath}, 旧值为${oldVal}，新值为 ${newVal}`);
		}});
	}

	bindProp(obj, currentPath = '') {
		for(let k in obj) {
			let path = currentPath.length ? currentPath + '.' + k : k;
			let prop = k;
			let val = obj[k];

			_bind.call(this, obj, prop, path);
	
			if(isObject(val)) {
				this.bindProp(val, path);
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
			// console.log(`你访问了 ${path}`);
			return val;
		},
		set(newVal) {
			let oldVal = val;
			val = newVal;

			if(oldVal === newVal) return;

			if(isObject(newVal)) {
				that.bindProp(val, path);
			}
			
			emitAllPath(path, oldVal, newVal);
		}
	});

	function emitAllPath(path, ...data) {
		let arr = path.split('.');
		let lens = arr.length;

		arr.forEach((p, i) => {
			let _path = arr.slice(0, lens-i).join('.');

			that.Watcher.emit(_path, _path, path, ...data);
		});
	}
}

/* Vue */
class Vue {
	constructor(options) {
		this._init(options);
	}
	
	_init(options) {
		this.options = Object.assign({}, options);

		this.data = new Observer({data: this.options.data, dataWatcher: () => {this.$update();}}).data;
		this.$mount(options);
	}

	$mount(options) {
		let {el, template} = options;
		let targetDOM = document.querySelector(el);

		if(!template) {
			template = targetDOM && targetDOM.innerHTML;
		}
		
		this.options.template = template;

		targetDOM.innerHTML = this.$compile(template);
	}

	$compile(template) {
		let regex = /{{([a-zA-Z_]\w*|\['\w+-*\w*'\]|\[\d+\])((\.?[a-zA-Z_]\w*)|\['\w+-*\w*'\]|\[\d+\])*}}/g; // 不支持双引号表达式 ["a"]
		// 测试用例：2wreqwr{{abd.a}}fsafdsa{{abd..a}}fsadfas{{.asd}}nknmop{{a.dbn}}sddfas{{2.d}} {{a[2]}}fdsafd{{ss.[a]}}
		
		let html = template.replace(regex, varString => {
			let path = varString.replace(/^{{|}}$/g, '');
			let data = getObjData(this.data, path);
			return data !== void(0) ? data : '';
		});

		return html;
	}

	$update() {
		document.querySelector(this.options.el).innerHTML = this.$compile(this.options.template);
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

function getObjData(obj, path) {
	let pathArr = path.replace(/\['?\w+'?\]/g, p => '.' + p.replace(/^\['?|'?\]$/g, '')).split('.'); // 中括号 ['prop'] 转换为 . 连接，分割为数组
	let data = obj;

	for(let i=0, lens=pathArr.length; i < lens; i++) {
		let key = pathArr[i];
		data = data[key];

		if(data === void 0) return void 0;
	}

	return data;
}

/* test */
let app1 = new Vue({
	el: '#app',
	template: `
		<div class="base-info"> 
			<p>姓名：{{user.name}}</p>
			<p>年龄：{{user.age}}</p>
		</div>
		<div class="score">
			<p>年级：{{school['grade']}}</p>
			<p>分数：
				<span>数学：{{school['score']['math']}}分；</span>
				<span>英语：{{school.score.english}}分</span>
			</p>
		</div>			
	`,
	data: {
		user: {
			name: 'li lei',
			age: 18
		},
		school: {
			grade: 12,
			score: {
				math: 60,
				english: 79
			}
		}
	}
});

setTimeout(() => {
	app1.data.school.score.math = 80; // 更新 DOM
}, 2000);