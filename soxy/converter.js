var Stream = require('stream'),
    Util = require('util');

function SoxyConverter(opts) {
	opts = opts || {};

	this.bitDepth = opts.bitDepth || 16;
	this.sampleRate = opts.sampleRate || 44100;
	this.isSigned = typeof opts.signed === 'undefined' ? true : opts.signed;
	this.isFloat = opts.float || false;

	this.bufSize = Math.floor(this.bitDepth / 8);

	this.format = this._buildFormat();
	this.bufWriter = this._setupBufWriter();

	Stream.Transform.call(this, { objectMode: true });
}

Util.inherits(SoxyConverter, Stream.Transform);

SoxyConverter.prototype._transform = function(signalData, encoding, callback) {
	// TODO: transform the object.signal into something in the 
	//       appropriate rate/size for Sox to consume
	var buf = new Buffer(this.bufSize * signalData.channels.length);

	this._loadBuffer(buf, signalData);

	this.push(buf);

	callback();
};

SoxyConverter.prototype._buildFormat = function() {
	var format = this.isFloat ? 'f' :
					this.isSigned ? 's' : 'u';

	return format + this.bitDepth;
};

SoxyConverter.prototype._setupBufWriter = function() {
	switch (this.format) {
		case 's16':
			return Buffer.prototype.writeInt16LE;
		case 'u16':
			return Buffer.prototype.writeUInt16LE;
		default:
			// TODO: probably should error in some manner as this default is not likely a good idea
			return Buffer.prototype.writeInt16LE;
	}
};

SoxyConverter.prototype._loadBuffer = function(buf, signalData) {

	// NOTE: this is a heavy refactoring of code from baudio which I still do not entirely understand...

    function normalizeIntValue(rawValue, boundingValue) {
      rawValue = Math.round(rawValue * boundingValue);

      return Math.max(Math.min(rawValue, boundingValue - 1), -boundingValue);
    }

	function normalizeFloatValue(rawValue, boundingValue) {
		if (isNaN(rawValue)) return 0;

		return rawValue > 0 ? Math.min(boundingValue - 1, Math.floor((boundingValue * rawValue) - 1)) : 
								Math.max(-boundingValue, Math.ceil((boundingValue * rawValue) - 1));
	}
    
	var i = 0,
		j = 0,
		boundingValue = Math.pow(2, this.bitDepth - 1),
		rawChannelSignal = 0,
		signalValue = 0;

    for (var i = 0; i < buf.length; i += 2) {
      rawChannelSignal = signalData.channels[(i / 2) % signalData.channels.length];

      signalvalue = 0;

      if (this.isFloat) {
         signalValue = normalizeFloatValue(rawChannelSignal, boundingValue);
      }
      else {
         signalValue = normalizeIntValue(rawChannelSignal, boundingValue);
      }
        
      this.bufWriter.call(buf, signalValue, i);
    }
};

module.exports = SoxyConverter;
