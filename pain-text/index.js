/**
 *
 * pain text canvas
 * @param {object} options { width ,height }
 * @param {number} options.width
 * @param {number} options.height
 * @returns {number[][]} dataArray
 */
const initPain = ({ width, height }) => {
	const dataArray = [];

	for (let i = 0; i < height; i++) {
		const line = dataArray[i] = [];

		for (let j = 0; j < width; j++) {
			line.push('*');
		}
	}

	return dataArray;
};

/**
 *
 * painSquare
 * @param {number[][]} dataArray
 * @param {object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.width
 * @param {number} options.height
 * @returns {number[][]} dataArray
 */
export const painSquare = (dataArray, options) => {
	const { x, y, width, height } = options;

	for (let i = 0; i < dataArray.length; i++) {        
		if (!(i >= y && i <= y + height)) {
			continue;
		}
		const line = dataArray[i];

		for (let j = 0; j < line.length; j++) {
			if (j >= x && j <= x + width) {
				line[j] = 1;
			}
		}
	}
	return dataArray;
};

/**
 *
 * painCircle
 * @param {number[][]} dataArray
 * @param {object} options
 * @param {number} options.x
 * @param {number} options.y
 * @param {number} options.radius
 * @returns {number[][]} dataArray
 */
const painCircle = (dataArray, options) => {
	const { x, y, radius } = options;

	for (let i = 0; i < dataArray.length; i++) {
		if (!(i >= y - radius && i <= y + radius)) {
			continue;    
		}

		const line = dataArray[i];
        
		for (let j = 0; j < line.length; j++) {
			if (!(j >= x - radius && j <= x + radius)) {
				continue;
			}

			const distance = Math.sqrt(Math.pow(Math.abs(i - y), 2) + Math.pow(Math.abs(j - x), 2));

			if (distance <= radius) {
				line[j] = '·';
			}
		}
	}
	return dataArray;
};

const toString = (dataArray) => {
	return '\n' + dataArray.map(line => line.join(' ')).join('\n') + '\n';
};

const writeString = (dataArray) => {
	const el = document.createElement('div');
	el.innerHTML = dataArray.map(line => {
		return `<div class="text-line">${line.map(item => `<span class="item">${item}</span>`).join(' ')}</div>`
	}).join('\n');
	document.body.append(el);
};

const test1 = () => writeString(painSquare(initPain({ width: 100, height: 100 }), { x: 10, y: 10, width: 30, height: 30 }));

const test2 = () => writeString(painCircle(initPain({ width: 100, height: 100 }), { x: 50, y: 50, radius: 45 }));