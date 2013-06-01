var Stream = require('stream'),
    Util   = require('util'),
    Events = require('events'),
    spawn  = require('child_process').spawn,
	SoxyTimeStream = require('./soxy/timer'),
	SoxyConverterStream = require('./soxy/converter');

function Soxy(opts) {
	opts = opts || {};

	this.filters = opts.filters || [];
	this.timerOpts = opts.timer || {};
	this.converterOpts = opts.converter || { bitDepth: 16, sampleRate: 44100 };

	if (!this.timerOpts.channels) this.timerOpts.channels = 1;
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

function mergeArgs(opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });
    
    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}

Soxy.prototype.play = function(opts) {
	opts = opts || {};

	var soxyTimer = new SoxyTimeStream(this.timerOpts),
		lastStream = soxyTimer,
		converterStream = new SoxyConverterStream(this.converterOpts),
		filterLen = this.filters.length,
		i = 0;

	for (; i < filterLen; ++i) {
		lastStream = lastStream.pipe(this.filters[i]);
	}

	lastStream = lastStream.pipe(converterStream);

   var playOpts = mergeArgs(opts, {
		c: this.timerOpts.channels,
		r: converterStream.sampleRate,
		t: converterStream.format
	});

	var ps = spawn('play', playOpts.concat('-'));

   lastStream.pipe(ps.stdin);

	soxyTimer.start();
};

module.exports = Soxy;
