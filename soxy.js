var Stream = require('stream'),
    Util = require('util'),
    Events = require('events');

module.exports = function() {
   return new Soxy();
};

function Soxy() {
   this.filters = [];
}

Util.inherits(Soxy, Events.EventEmitter);

Soxy.prototype.addFilter = function(filter) {
   this.filters.push(filter);
};

Soxy.prototype.play = function(inStream) {
   var soxyStream = new SoxyStream(),
       lastStream = inStream,
       filterCnt = this.filters.length,
       i = 0;

   for (; i < filterCnt; ++i) {
      lastStream.on('error', function() {
         console.error('stream error: ', arguments);
      });
      lastStream = lastStream.pipe(this.filters[i]);
   }

   soxyStream.on('error', function() {
      console.error('stream error: ', arguments);
   });

   var handleFinish = function() {
      this.emit('done');
   };

   soxyStream.once('finish', handleFinish.bind(this));

   lastStream.pipe(soxyStream);
};

function SoxyStream() {
   Stream.Transform.call(this);
   this.readable = true;
}

SoxyStream.prototype = Object.create(
   Stream.Transform.prototype, 
   {
      constructor: { value: SoxyStream }
   }
);

SoxyStream.prototype._transform = function(chunk, encoding, done) {
   console.log('SoxyStream', chunk.toString());
   this.push(chunk);
   done();
};
