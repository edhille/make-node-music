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

Filter.prototype.filter = function(chunk, encoding) {
   console.log('FilterStream(' + this.id + ')', chunk.toString());

   return chunk;
};

function FilterStream(callback) {
   Stream.Transform.call(this);

   this.on('pipe', function() {
      console.log('being piped');
   });

   this.callback = callback;
}

FilterStream.prototype = Object.create(
   Stream.Transform.prototype, 
   {
      constructor: { value: FilterStream }
   }
);

FilterStream.prototype._transform = function(chunk, encoding, done) {
   this.push(this.callback(chunk, encoding));
   done();
};

FilterStream.prototype._flush = function(done) {
   done();
};
