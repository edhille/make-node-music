// NOTE: this is legacy and is not available for use (it's only reference for future implementations)
var Constants = require('./constants');

exports.generator = function(freq) {
	return function(t) {
		return Math.sin(Constants.TAU* t * freq) < 0 ? -1 : 1;
	};
};
