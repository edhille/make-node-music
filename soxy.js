var Stream = require('stream'),
    Util = require('util');

module.exports = function() {
   return new Soxy();
};

function Soxy() {
   Stream.Transform.call(this);

   this.readable = true;
   this.filters = [];
}

Soxy.prototype = Object.create(Stream.Transform.prototype, { constructor: { value: Soxy }});

Soxy.prototype._transform = function(chunk, encoding, done) {
   console.log('Soxy', chunk.toString());
   this.push(chunk);
   done();
};

Soxy.prototype.addFilter = function(filter) {
   this.filters.push(filter);
};

Soxy.prototype.play = function(inStream) {
   var lastStream = inStream,
       filterCnt = this.filters.length,
       i = 0;

   for (; i < filterCnt; ++i) {
      lastStream = lastStream.pipe(this.filters[i]);
   }

   lastStream.pipe(this);
};
