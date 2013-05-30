var Filter = require('./base.js'),
    Util = require('util');

function SineFilter(opts) {
	opts = opts || {};

	this.freq = opts.freq || 440; // middle-A
	this.type = opts.type || 'additive'; // additive|substractive|multiplicative|divisive

	this.operator = this._buildOperator(this.type);

	Filter.call(this, opts);
}

Util.inherits(SineFilter, Filter);

SineFilter.prototype.updateSignal = function(signalData) {
	var channelCount = signalData.channels.length,
		timeInRad = this.DEG_TO_RAD * signalData.time,
		i = 0;

	for (; i < channelCount; ++i) {
		// NOTE: other examples have used sin(TAU * t * freq)...
		signalData.channels[i] = this.operator((Math.sin(timeInRad) * this.freq), signalData.channels[i]);
	}
};

SineFilter.prototype._buildOperator = function(type) {
	switch (type) {
		case 'additive':
			return function additive(newValue, existingValue) { return newValue + existingValue };
		case 'subtractive':
			return function subtractive(newValue, existingValue) { return newValue - existingValue };
		case 'multiplicative':
			return function multiplicative(newValue, existingValue) { return newValue * existingValue };
		case 'divisive':
			return function divisive(newValue, existingValue) {
				existingValue = existingValue || 1;
				return newValue / existingValue;
			};
		default:
			// TODO: how to handle this error?
			return function unknown(newValue, existingValue) { return newValue + existingValue };
	}
}

module.exports = SineFilter;
