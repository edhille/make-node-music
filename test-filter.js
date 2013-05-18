var Stream = require('stream'),
    Util = require('util');

module.exports = function(id) {
   return new Filter(id);
};

function Filter(id) {
   Stream.Transform.call(this);

   this.on('pipe', function() {
      console.log('being piped');
   });

   this.id = id;
}

Filter.prototype = Object.create(Stream.Transform.prototype, { constructor: { value: Filter }});

Filter.prototype._transform = function(chunk, encoding, done) {
   console.log('Filter(' + this.id + ')', chunk.toString());
   this.push(chunk);
   done();
};
