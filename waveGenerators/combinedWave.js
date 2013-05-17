var sineGenerator = require('./simpleSine'),
    squareGenerator = require('./simpleSquare'),
    sawGenerator = require('./simpleSaw'),
    bassGenerator = require('../grooves/pulseBass'),
    melody = [ 0, -3/2, 1/5, 4/3, 7/5, 0, -5/6, 1/3 ].map(function (x) { return Math.pow(2, x) });

exports.generator = function() {
	return function(t) {
		var note = melody[Math.floor(t * 2 % melody.length)],
			sine1 = sineGenerator.generator(400 * note),
			saw1 = sawGenerator.generator(100 * note),
			square1 = squareGenerator.generator(800 * note),
			square2 = squareGenerator.generator(1),
			square3 = squareGenerator.generator(4);

		return (sine1(t) + square1(t) + saw1(t)) / 3 * (square2(t) + square3(t)) / 2;
		
		//var bass = bassGenerator.generator();

		//return bass(t);
	};
};
