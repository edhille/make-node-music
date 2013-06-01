var Filter = require('./base.js'),
    Util = require('util');

function SineFilter(opts) {
	opts = opts || {};

	this.freq = opts.freq || 440; // middle-A
	this.type = opts.type || 'additive'; // additive|substractive|multiplicative|divisive
   this.sampleRate = opts.sampleRate || 44100;
   this.precalc = this.TAU * this.freq
	this.operator = this._buildOperator(this.type);
   this.cache = [];

	Filter.call(this, opts);
}

Util.inherits(SineFilter, Filter);

SineFilter.prototype.updateSignal = function(signalData) {
	var channelCount = 0,
       cacheKey = signalData.time % this.sampleRate,
		 i = 0;

   // TODO: test cache...
   if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = [];
      channelCount = signalData.channels.length;
      for (; i < channelCount; ++i) {
         this.cache[cacheKey][i] = this.operator(Math.sin(this.precalc * (signalData.time / this.sampleRate)), signalData.channels[i]);
      }
   }

   signalData.channels = this.cache[cacheKey];
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
