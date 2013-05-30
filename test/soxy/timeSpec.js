var should = require('should'),
    Stream = require('stream'),
	Util = require('util'),
    SoxyTimer = require('../../soxy/timer');

describe('SoxyTimer', function() {
	
	describe('instantiation', function() {
		
		describe('default', function() {
			var soxyTimer = null;

			beforeEach(function() {
				soxyTimer = new SoxyTimer();
			});

			afterEach(function() {
				soxyTimer = null;
			});

			it('should have no limit to time', function() {
				soxyTimer.timeLimit.should.equal(Infinity);
			});

			it('should start at time zero', function() {
				soxyTimer.time.should.equal(0);
			});

			it('should tick length of 10ms', function() {
				soxyTimer.tickLength.should.equal(10);
			});

			it('should start signal at zero', function() {
				soxyTimer.startSignal.should.equal(0);
			});

			it('should have only one channel', function() {
				soxyTimer.channels.should.equal(1);
			});
		});

		describe('configured', function() {
		
			it('should allow arbitrary channels', function() {
				var TEST_CHANNELS = 100;
				var soxyTime = new SoxyTimer({ channels: TEST_CHANNELS});

				soxyTime.channels.should.equal(TEST_CHANNELS);
			});
		
			it('should allow arbitrary start time', function() {
				var startTime = 100;
				var soxyTime = new SoxyTimer({ startTime: startTime });

				soxyTime.time.should.equal(startTime);
			});
		
			it('should allow arbitrary start signal', function() {
				var startSignal = 100;
				var soxyTime = new SoxyTimer({ startSignal: startSignal });

				soxyTime.startSignal.should.equal(startSignal);
			});
		
			it('should allow arbitrary time limit', function() {
				var timeLimit = 100;
				var soxyTime = new SoxyTimer({ timeLimit: timeLimit });

				soxyTime.timeLimit.should.equal(timeLimit);
			});
		
			it('should allow arbitrary time tick length', function() {
				var tickLength = 100;
				var soxyTime = new SoxyTimer({ tickLength: tickLength });

				soxyTime.tickLength.should.equal(tickLength);
			});
		
			it('should allow time to start right away', function(done) {
				var soxyTime = new SoxyTimer({ startImmediately: true, timeLimit: 1 });

				setTimeout(function() {
					soxyTime.time.should.be.greaterThan(0);
					done();
				}, this.tickLength);
			});
		});
	});

	describe('generated time stream', function() {
		var soxyTimer = null;
		var timeReader = null;
		var objRead = [];

		function TimeReader() {
			Stream.Writable.call(this, { objectMode: true });
		}
		
		Util.inherits(TimeReader, Stream.Writable);

		TimeReader.prototype._write = function(object, encoding, callback) {
			objRead.push(object);
			callback();
		};

		beforeEach(function() {
			soxyTimer = new SoxyTimer({
				timeLimit: 2,
				debug: true
			});
		});

		afterEach(function() {
			soxyTimer = null;
			timeReader = null;
		});

		it('should be able to read as stream of time objects', function(done) {
			var reader = new TimeReader();
			
			objRead.should.have.lengthOf(0);

			soxyTimer.pipe(reader);
			soxyTimer.start();

			setTimeout(function() {
				objRead.should.have.lengthOf(2);
				done();
			}, (soxyTimer.timeLimit * soxyTimer.tickLength) + 1);
		});
	});
});
