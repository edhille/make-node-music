var Constants = require('./constants');

exports.generator = function(freq) {
	return function(t) {
		return Math.sin(Constants.TAU * t * freq);
	};
};
