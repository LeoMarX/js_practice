export default class CountDownTime {
	constructor(endTime, callback) {
		this.nowTime = 0;
		this.endTime = 0;
		this.time = {
			years: '',
			months: '',
			weeks: '',
			days: '',
			hours: '',
			minutes: '',
			seconds: ''
		};
	}

	countTime() {
		var diffTime = this.endTime - this.nowTime;
		this.time = {
			years: diffTime / (3600 * 24 * 365)
		};
	}

	
}