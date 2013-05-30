var should = require('should'),
   Stream = require('stream'),
   //Events = require('events'),
   Util = require('util'),
   SoxyTimer = require('../../soxy/timer'),
   SoxyConverter = require('../../soxy/converter');

describe('SoxyConverter', function() {

	describe('initialization', function() {

		describe('defaults', function() {
			var soxyConverter = null;

			beforeEach(function() {
				soxyConverter = new SoxyConverter();
			});

			afterEach(function() {
				soxyConverter = null;
			});

			it('should have basic buffer size for 16bit integer', function() {
				soxyConverter.bufSize.should.equal(2);
			});
		});

		describe('custom', function() {
			it('should allow us to change buffer size', function() {
				var TEST_BUF_SIZE = 4,
					soxyConverter = new SoxyConverter({
						buffSize: TEST_BUF_SIZE	
					});

				soxyConverter.bufSize.should.equal(TEST_BUF_SIZE);
			});
		});
	});

	describe('_transform', function() {
		var soxyConverter = null,
			soxyTimer = null,
			testReaderStream = null,
			transformCallbackData = null;

		function TestReaderStream() {
			Stream.Writable.call(this);
		}

		Util.inherits(TestReaderStream, Stream.Writable);

		TestReaderStream.prototype._write = function(chunk, encoding, callback) {
			transformCallbackData = chunk;

			callback();
		};

		beforeEach(function() {
			soxyConverter = new SoxyConverter();
			soxyTimer = new SoxyTimer({ startSignal: 2, timeLimit: 1 });
			testReaderStream = new TestReaderStream();
		});

		afterEach(function() {
			soxyConverter = null;
			soxyTimer = null;
			testReaderStream = null;
			transformCallbackData = null;
		});

		it('should convert signal data to Sox-compliant format', function(done) {
			soxyTimer.pipe(soxyConverter).pipe(testReaderStream);

			soxyTimer.start();

			setTimeout(function() {
				(transformCallbackData instanceof Buffer).should.be.true;

				transformCallbackData.readUInt16BE(0).should.equal(2);

				done();
			}, 30);
		});
	});
});
