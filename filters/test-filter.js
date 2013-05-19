var Stream = require('stream'),
    Util = require('util');

module.exports = function(id) {
   return new Filter(id);
};

function Filter(id) {
   this.id = id;
}

Filter.prototype.getStream = function() {
   return new FilterStream(this.id);
};

function FilterStream(id) {
   Stream.Transform.call(this);

   this.on('pipe', function() {
      console.log('being piped');
   });

   this.id = id;
}

FilterStream.prototype = Object.create(Stream.Transform.prototype, { constructor: { value: FilterStream }});

FilterStream.prototype._transform = function(chunk, encoding, done) {
   console.log('FilterStream(' + this.id + ')', chunk.toString());
   this.push(chunk);
   done();
};

FilterStream.prototype._flush = function(done) {
   done();
};
