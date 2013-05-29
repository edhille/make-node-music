var Stream = require('stream'),
    Util   = require('util'),
    Events = require('events'),
    spawn  = require('child_process').spawn,
	SoxyTimeStream = require('./soxy/timer');

function Soxy(opts) {
	opts = opts || {};

	this.filters = opts.filters || [];
	this.timerOpts = opts.timer || {};
}

Util.inherits(Soxy, Events.EventEmitter);

Soxy.prototype.addFilter = function(filter) {
	// NOTE: should we indicate we did not add this?....
	if (!this.hasFilter(filter)) this.filters.push(filter);
};

Soxy.prototype.hasFilter = function(filter) {
	return -1 !== this.indexForFilter(filter);
};

Soxy.prototype.indexForFilter = function(filter) {
	var filterIdx = -1,
		filterLen = this.filters.length,
		i = 0;

	for (; i < filterLen; ++i) {
		if (this.filters[i].id === filter.id) {
			filterIdx = i;
			break;
		}
	} 

	return filterIdx;
};

Soxy.prototype.removeFilter = function(filter) {
	var filterIdx = this.indexForFilter(filter);

	if (filterIdx >= 0) {
		this.filters.splice(filterIdx, 1);
	}
};

Soxy.prototype.play = function(opts) {
	opts = opts || {};

	var soxyTimer = new SoxyTimeStream(this.timerOpts),
		lastStream = soxyTimer,
		filterLen = this.filters.length,
		i = 0;

	for (; i < filterLen; ++i) {
		lastStream = lastStream.pipe(this.filters[i]);
	}

	soxyTimer.start();
};

module.exports = Soxy;
