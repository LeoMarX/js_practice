export default class EasyStorage {
	/**
	 * Creates an instance of EasyStorage.
	 * @param {Object} [{ id = '', saveTime = 86400000 }={}] 
	 * @memberof EasyStorage
	 */
	constructor({ id = '', saveTime = 86400000 } = {}) {
		this.id = String(id);
		this.saveTime = +saveTime;
		this.store = localStorage;
	}

	_getKey(theKey) {
		return this.id.length ? `${this.id}_${theKey}` : theKey;
	}

	_getRaw(key) {
		let dataObj = null;

		try {
			let dataVal = localStorage.getItem(key);
			dataObj = JSON.parse(dataVal); // 是否需要校验 data、ctime、etime
		} catch (e) {
			console.log(e);
		}

		return dataObj;
	}

	// maybe add 'type' later
	_setRaw(key, {data = '', ctime = 0, etime = 0}) {
		let _data = {
			'data': data,
			'ctime': ctime,
			'etime': etime
		};

		if (!key) { return false; }

		this.store.setItem(key, JSON.stringify(_data));
	}

	get(key = '', { saveTime, nowTime = new Date().getTime(), forceGet = false } = {}) {
		key = this._getKey(key);
		let value = null, // 默认值为 null，区分空字符串
			data, ctime, etime;
		let condition1, condition2, condition3;
		let dataObj = this._getRaw(key);
		
		if(!dataObj) {return null;}

		data = dataObj.data || '',
		ctime = dataObj.ctime,
		etime = dataObj.etime;

		condition1 = !!forceGet,
		condition2 = !!saveTime,
		condition3 = etime && etime > nowTime;
		
		if(condition1) {
			value = data;
		} else if(condition2) {
			value = ctime && ctime + saveTime > nowTime ? data : null;
		} else if(condition3) {
			value = data;
		}

		return value;
	}

	set(key, data = '', {saveTime, nowTime = new Date().getTime()} = {}) {
		key = this._getKey(key);
		saveTime = +saveTime || this.saveTime;

		this._setRaw(key, {data: data, ctime: nowTime, etime: nowTime + saveTime});
	}

	add(key, data = '') {
		if(typeof key !== 'string') {return false;}

		let _data = this.get(key);
		if(_data !== null) {
			this.set(key, _data + data); // 需改进
		} else {
			this.set(key, data);
		}
	}

	getExpirationTime(key) {
		key = this._getKey(key);
		
		let exp = null;
		let dataObj = this._getRaw(key);

		dataObj !== null && !!dataObj.etime && (exp = dataObj.etime);

		return exp;
	}

	updateExpirationTime(key, expTime) {
		key = this._getKey(key);
		let dataObj = this._getRaw(key);
		let data, ctime, etime;

		if (dataObj === null || typeof expTime !== 'number') {
			return false;
		}
		
		data = dataObj.data;
		ctime = dataObj.ctime;
		etime = expTime;

		this._setRaw(key, {data: data, ctime: ctime, etime: etime});
	}

	remove(key) {
		key = this._getKey(key);
		return localStorage.removeItem(key);
	}

	clear() {
		return localStorage.clear();
	}
}

