/* global EasyStorage */
let es = new EasyStorage({id: 'test'});

es.set('student', 'liming', {saveTime: 3000});

console.log(es.get('student'));

setTimeout(() => {
	console.log(es.get('student'));
}, 3000);

document.body.append('Run End.');