exports.generator = function(freq) {
	return function(t) {
        return t % (1 / freq) * freq * 2 - 1;
    };
};
