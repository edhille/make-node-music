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
   this.isStarted = false;

	if (opts.startImmediately) {
		this.start();
	}
}

Util.inherits(SoxyTimeStream, Stream.Readable);

SoxyTimeStream.prototype.start = function() {
	//this._pushTime();
   this.isStarted = true;
   this._read();
};

SoxyTimeStream.prototype.stop = function() {
   this.push(null);
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
   if (!this.isStarted) return;

	if (this.time < this.timeLimit) {
		this._writeTimeData();

		++this.time;
	}
	else if (this.time === this.timeLimit) {
		this.stop();
	}
};

module.exports = SoxyTimeStream;
