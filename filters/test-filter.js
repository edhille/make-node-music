var Stream = require('stream'),
    Util = require('util');

module.exports = function(id) {
   return new Filter(id);
};

function Filter(id) {
   this.id = id;
}

Filter.prototype.getStream = function() {
   return new FilterStream(this.filter.bind(this));
};

Filter.prototype.decodeInt = function(buf) {
   return (buf.readUInt32BE(0) << 8) + buf.readUInt32BE(1);
};

Filter.prototype.filter = function(buf, encoding) {
   console.log('FilterStream(' + this.id + ')', this.decodeInt(buf));

   return buf;
};

function FilterStream(callback) {
   Stream.Transform.call(this);

   this.on('pipe', function() {
      //console.log('being piped');
   });
   this.on('error', function() {
      console.log('FilterStream error');
   });

   this.callback = callback;
}

Util.inherits(FilterStream, Stream.Transform);

FilterStream.prototype._transform = function(chunk, encoding, done) {
   this.push(this.callback(chunk, encoding));
   done();
};

FilterStream.prototype._flush = function(done) {
   done();
};
