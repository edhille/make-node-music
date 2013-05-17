var sineWaveGenerator = require('../waveGenerators/simpleSine');

exports.generator = function() {
	var sine1 = sineWaveGenerator.generator(200),
	    sine2 = sineWaveGenerator.generator(201);

	return function(t) {
		return sine1(t) + sine2(t);
	};
};
