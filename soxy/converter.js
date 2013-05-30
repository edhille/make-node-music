var Stream = require('stream'),
    Util = require('util');

function SoxyConverter(opts) {
	opts = opts || {};

	this.outputFormat = opts.outputFormat || 's16';
	this.bufSize = opts.buffSize || 2;

	Stream.Transform.call(this, { objectMode: true });
}

Util.inherits(SoxyConverter, Stream.Transform);

SoxyConverter.prototype._transform = function(object, encoding, callback) {
	// TODO: transform the object.signal into something in the 
	//       appropriate rate/size for Sox to consume
	var buf = new Buffer(this.bufSize);

	buf.writeUInt16BE(object.signal, 0);

	this.push(buf);

	callback();
};

module.exports = SoxyConverter;
