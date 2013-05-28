var Stream = require('stream'),
    Util = require('util');

module.exports = function(id) {
   return new Filter(id);
};

function Filter(opts) {
   opts = opts || {};

   this.id = opts.id || '';
   this.chunkSize = opts.chunkSize || 16;
}

Filter.prototype.getStream = function() {
   return new FilterStream(this.filter.bind(this));
};

Filter.prototype.filter = function(signalData) {
   var newSignal = Math.floor(Math.random() * this.chunkSize);

   newSignal *= Math.random() > 0.5 ? -1 : 1;

   signalData.signal += newSignal;

   signalData.signal = this._normalizeSignal(signalData.signal);

   console.log('FilterStream(' + this.id + ').filter', signalData);

   return signalData;
};

Filter.prototype._normalizeSignal = function(signal) {
    if (isNaN(signal)) return 0;

    var limitSignalValue  = Math.pow(2, this.chunkSize - 2);

    return signal > 0
        ? Math.min(limitSignalValue - 1, Math.floor((limitSignalValue * signal) - 1))
        : Math.max(-limitSignalValue, Math.ceil((limitSignalValue * signal) - 1));
};

function FilterStream(callback) {
   Stream.Transform.call(this, { objectMode: true });

   this.on('error', function(err) {
      console.log('FilterStream error', err);
   });

   this.callback = callback;
}

Util.inherits(FilterStream, Stream.Transform);

FilterStream.prototype._transform = function(signalData, encoding, done) {
   var newSignalData = this.callback(signalData, encoding);
   console.log('FilterStream (transform)', newSignalData);

   this.push(newSignalData);

   done();
};

FilterStream.prototype._flush = function(done) {
   done();
};
