// NOTE: this is legacy and is not available for use (it's only reference for future implementations)
exports.generator = function(freq) {
	return function(t) {
        return t % (1 / freq) * freq * 2 - 1;
    };
};
