var Stream = require('stream'),
    Events = require('events'),
    Util = require('util');

function Filter(opts) {
	opts = opts || {};

	this.id = opts.id || 'NO ID';

	Stream.Transform.call(this, { objectMode: true });
	Events.EventEmitter.call(this);
}

Util.inherits(Filter, Events.EventEmitter);
Util.inherits(Filter, Stream.Transform);

Filter.prototype._transform = function(object, encoding, callback) {
	if (this.updateSignal) this.updateSignal(object);
	
	callback();
};

module.exports = Filter;
