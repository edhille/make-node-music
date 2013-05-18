var Stream = require('stream'),
    Util = require('util');

module.exports = function() {
   return new Filter();
};

function Filter() {
   Stream.Transform.call(this);

   this.on('pipe', function() {
      console.log('being piped');
   });
}

Filter.prototype = Object.create(Stream.Transform.prototype, { constructor: { value: Filter }});

Filter.prototype._transform = function(chunk, encoding, done) {
   console.log('Filter', chunk.toString());
   this.push(chunk);
   done();
};
