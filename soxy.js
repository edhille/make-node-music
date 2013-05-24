var Stream = require('stream'),
    Util   = require('util'),
    Events = require('events'),
    spawn  = require('child_process').spawn;

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

Soxy.prototype.play = function(opts) {
   var soxyStream = new SoxyStream(),
       lastStream = new SoxyTimeStream(),
       filterCnt  = this.filters.length,
       opts = opts || {},
       i = 0;

   for (; i < filterCnt; ++i) {
      lastStream.on('error', function() {
         console.error('stream error: ', arguments);
      });

      lastStream = lastStream.pipe(this.filters[i].getStream());
   }

   soxyStream.on('soxyStream error', function() {
      console.error('stream error: ', arguments);
   });

   var handleFinish = function() {
      this.emit('done');
   };

   soxyStream.once('finish', handleFinish.bind(this));

   var ps = spawn('play', mergeArgs(opts, {
      c: 1,//this.channels.length,
      r: 1, //this.rate,
      t: 's16',
   }).concat('-'));
    
   lastStream.pipe(soxyStream).pipe(ps.stdin);
};

function SoxyStream() {
   Stream.Transform.call(this);
}

Util.inherits(SoxyStream, Stream.Transform);

SoxyStream.prototype._transform = function(buf, encoding, done) {
   var bufInt = (buf.readUInt32BE(0) << 8) + buf.readUInt32BE(1);
   //console.log('SoxyStream', bufInt);

   this.push(buf);

   done();
};

function mergeArgs(opts, args) {
    Object.keys(opts || {}).forEach(function (key) {
        args[key] = opts[key];
    });
    
    return Object.keys(args).reduce(function (acc, key) {
        var dash = key.length === 1 ? '-' : '--';
        return acc.concat(dash + key, args[key]);
    }, []);
}

function SoxyTimeStream() {
   Stream.Readable.call(this, { objectMode: true });

   this.time = 0;

   this.setNextTick();
   this.pushTime();
}

Util.inherits(SoxyTimeStream, Stream.Readable);

SoxyTimeStream.prototype.setNextTick = function() {
   setTimeout(this.pushTime.bind(this), 10);
};

SoxyTimeStream.prototype.pushTime = function() {
   //console.log('time', this.time);

   if (this.time < 100) {
      var num = this.time;
      var buf = new Buffer(8);

      //console.log('num', num);

      buf.writeUInt32BE(num >> 8, 0);
      buf.writeUInt32BE(num & 0x00ff, 1);

      //console.log('buf', buf);
      //
      this.push(buf);

      this.setNextTick();
   }
   else if(this.time === 100) {
      //console.log('ending..');
      this.push(null);
   }

   ++this.time;
};

SoxyTimeStream.prototype._read = function(size) {
   function clamp (x) {
      return Math.max(Math.min(x, Math.pow(2,15)-1), -Math.pow(2,15));
   }
};
