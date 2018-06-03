/**
 * @file 【链接】http://ife.baidu.com/2017/course/detail/id/15
 * 
 * let app1 = new Observer({ 
 *      name: 'youngwind', 
 *      age: 25 
 * }); 
 * let app2 = new Observer({ 
 *      university: 'bupt', 
 *      major: 'computer' 
 * });
 * 要实现的结果如下： app1.data.name '
 * 你访问了 name app.data.age = 100;  
 * 你设置了 age，新的值为100 app2.data.university 
 * 你访问了 university app2.data.major = 'science'  
 * 你设置了 major，新的值为 science
 * 
 */


/**
 * set object property
 * 
 * @param {Object} dataObj 
 * @returns {Object}
 */
function Observer(dataObj) {
    let obj = Object.assign({}, dataObj);
    
    function bindProp(prop) {
        let val = obj[prop];
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: true,
            get() {
                console.log(`你访问了 ${prop}`);
                return val;
            },
            set(newVal) {
                console.log(`你设置了 ${prop}, 新值为 ${newVal}`);
                val = newVal;
            } 
        });
    }

    Object.keys(obj).map(prop => {
        bindProp(prop);
    });

    return {data: obj};
}

/* --- test --- */
let app1 = Observer({a: 1, b: 2});
console.log(app1.data.a);
app1.data.a = 3;