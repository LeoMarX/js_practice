/**
 * @see http://ife.baidu.com/2017/course/detail/id/22
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

/* Observer */
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

/* Vue */
class Vue extends Observer {
	constructor(options) {
		super(options.data);
		this._init(options);
	}

	_init(options) {
		let {el, template} = options;
		let targetDOM = document.querySelector(el);

		if(!template) {
			template = targetDOM && targetDOM.innerHTML;
		}

		targetDOM.innerHTML = this.$compile(template);
	}

	$compile(template) {
		console.log(template);

		let regex = /{{([a-zA-Z_]\w*|\[\w+\])((\.?[a-zA-Z_]\w*)|\[\w+\])*}}/g;
		// 测试用例：2wreqwr{{abd.a}}fsafdsa{{abd..a}}fsadfas{{.asd}}nknmop{{a.dbn}}sddfas{{2.d}} {{a[2]}}fdsafd{{ss.[a]}}
		
		let html = template.replace(regex, varString => {
			let path =  varString.replace(/^{{|}}$/g, '');
			let data = getInObj(this.data, path);
			return data !== void(0) ? data : '';
		});

		console.log(html);
		return html;
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

function getInObj(obj, path) {
	let pathArr = path.replace(/\[\w+\]/g, p => '.' + p.slice(1, -1)).split('.'); // 中括号 [] 转换为 . 连接，分割为数组
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
			<p>年级：{{school[grade]}}</p>
			<p>分数：
				<span>数学：{{school.score.math}}分；</span>
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