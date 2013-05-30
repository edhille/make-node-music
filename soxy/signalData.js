function SignalData(opts) {
	opts = opts || {};
	
	var i = 0,
		channelCount = opts.channelCount || 1,
		startSignal = typeof opts.startSignal === 'undefined' ? 0 : opts.startSignal;

	this.time = opts.time || 0;
	this.channels = [];

	for (; i < channelCount; ++i) {
		this.channels.push(startSignal);
	}
}

module.exports = SignalData;
