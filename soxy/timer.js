var Stream = require('stream'),
    Util   = require('util'),
	SignalData = require('./signalData');

function SoxyTimeStream(opts) {
	opts = opts || {};

	Stream.Readable.call(this, { objectMode: true });

	this.time = opts.startTime || 0;
	this.startSignal = opts.startSignal || 0;
	this.tickLength = opts.tickLength || 10;
	this.timeLimit = opts.timeLimit || Number.POSITIVE_INFINITY;
	this.channels = opts.channels || 1;
	this.debug = opts.debug || false;
	this.curTimer = null;

	if (opts.startImmediately) {
		this.start();
	}
}

Util.inherits(SoxyTimeStream, Stream.Readable);

SoxyTimeStream.prototype.start = function() {
	this._pushTime();
};

SoxyTimeStream.prototype.stop = function() {
	clearTimeout(this.currTimer);
	this.emit('end');
};

SoxyTimeStream.prototype._setNextTick = function() {
   this.currTimer = setTimeout(this._pushTime.bind(this), this.tickLength);
};

SoxyTimeStream.prototype._pushTime = function() {
	if (this.time < this.timeLimit) {
		this._writeTimeData();
		this._setNextTick();

		++this.time;
	}
	else {
		this.stop();
	}
};

SoxyTimeStream.prototype._writeTimeData = function() {
	var signalData = new SignalData({
		time: this.time, 
		channelCount: this.channels, 
		startSignal: this.startSignal
	});

	this.push(signalData);
};

SoxyTimeStream.prototype._read = function(size) {
	// empty...
};

module.exports = SoxyTimeStream;
