var Stream = require('stream'),
    Util   = require('util'),
    Events = require('events'),
    spawn  = require('child_process').spawn;

module.exports = function() {
   return new Soxy();
};

// Soxy Class

function Soxy(opts) {
   opts = opts || {};

   this.filters = [];
   this.channels = [];

   this.size = opts.size || 2048;
   this.rate = opts.rate || 44000;
   this.chunkSize = opts.chunkSize || 16;
}

Util.inherits(Soxy, Events.EventEmitter);

Soxy.prototype.addFilter = function(filter) {
   filter.chunkSize = this.chunkSize;

   this.filters.push(filter);
};

Soxy.prototype.play = function(opts) {
   var soxyStream = new SoxyStream({ chunkSize: this.chunkSize }),
       lastStream = new SoxyTimeStream(),
       filterCnt  = this.filters.length,
       opts = opts || {},
       i = 0;

   for (; i < filterCnt; ++i) {
      lastStream.on('error', function(err) {
         console.error('stream error: ', err);
      });

      lastStream = lastStream.pipe(this.filters[i].getStream());
   }

   soxyStream.on('error', function(err) {
      console.error('soxyStream error: ', err);
   });

   var handleFinish = function() {
      this.emit('done');
   };

   soxyStream.once('finish', handleFinish.bind(this));

   var ps = spawn('echo');
/*   var ps = spawn('play', mergeArgs(opts, {
      c: 1,//this.channels.length,
      r: this.rate,
      t: 's32',// + this.chunkSize,
   }).concat('-'));*/
    
   ps.stdin.on('error', function(err) {
      console.error('soxy.ps error: ', err);
   });

   try {
   lastStream.pipe(soxyStream).pipe(ps.stdin);
   } catch(e) {
      console.err(e);
   }
};

// SoxyStream Class

function SoxyStream(opts) {
   opts = opts || {};

   Stream.Transform.call(this, { objectMode: true });

   this.chunkSize = opts.chunkSize || 16;

   switch(this.chunkSize) {
      default:
         this.writeBufFn = Buffer.prototype.writeInt16BE;
         break;
   }
}

Util.inherits(SoxyStream, Stream.Transform);

SoxyStream.prototype._transform = function(signalData, encoding, done) {
   console.log('SoxyStream In', signalData);

   //var outBuf = new Buffer(this.chunkSize / 8);
   var outBuf = new Buffer(2);
   console.log('buf.length', outBuf.length);

   this.writeBufFn.call(outBuf, signalData.signal, 0);

   console.log('SoxyStream Out', outBuf);

   this.push(outBuf);

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

// SoxyTimeStream Class

function SoxyTimeStream() {
   Stream.Readable.call(this, { objectMode: true });

   this.time = 0;
   this.hasData = false;

   this.setNextTick();
   this.pushTime();
}

Util.inherits(SoxyTimeStream, Stream.Readable);

SoxyTimeStream.prototype.setNextTick = function() {
   setTimeout(this.pushTime.bind(this), 10);
};

SoxyTimeStream.prototype.pushTime = function() {
   ++this.time;
   this.hasData = true;
};

SoxyTimeStream.prototype._read = function(size) {
   if (this.hasData) {
      if (this.time < 100) {
         this.push({ time: this.time, signal: 0 });

         this.setNextTick();
      }
      else if(this.time === 100) {
         //console.log('ending..');
         this.push(null);
      }
   }

   this.hasData = false;
};
