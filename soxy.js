var Stream = require('stream'),
    Util = require('util');

module.exports = function() {
   return new Soxy();
};

function Soxy() {
   Stream.Transform.call(this);

   this.readable = true;
}

Soxy.prototype = Object.create(Stream.Transform.prototype, { constructor: { value: Soxy }});

Soxy.prototype._transform = function(chunk, encoding, done) {
   console.log('Soxy', chunk.toString());
   this.push(chunk);
   done();
};

Soxy.prototype.addFilter = function(filter) {
   this.pipe(filter);
};

Soxy.prototype.play = function(inStream) {
   inStream.pipe(this);
};
