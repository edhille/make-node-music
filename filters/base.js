var Stream = require('stream'),
    Events = require('events'),
    Util = require('util');

function Filter(opts) {
	opts = opts || {};

	this.id = opts.id || 'NO ID';
	this.debug = opts.debug || false;

	Stream.Transform.call(this, { objectMode: true });
	Events.EventEmitter.call(this);
}

Util.inherits(Filter, Events.EventEmitter);
Util.inherits(Filter, Stream.Transform);

Filter.prototype._transform = function(signalData, encoding, callback) {
	if (this.updateSignal) this.updateSignal(signalData);
	
	this.push(signalData);

	callback();
};

Filter.prototype._flush = function(callback) {
   callback();
};

Filter.prototype.TAU = Math.PI * 2;
Filter.prototype.DEG_TO_RAD = 0.0174532925;

module.exports = Filter;
