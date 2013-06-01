var should = require('should'),
   Stream = require('stream'),
   //Events = require('events'),
   Util = require('util'),
   SoxyTimer = require('../../soxy/timer'),
   SineFilter = require('../../filters/simpleSine'),
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

			it('should have basic format for signed 16bit integer', function() {
				soxyConverter.format.should.equal('s16');
			});

			it('should have a Buffer write method to write signed 16bit, little-endian values', function() {
				soxyConverter.bufWriter.should.equal(Buffer.prototype.writeInt16LE);
			});
		});

		describe('custom', function() {
			it('should allow us to change format to unsigned', function() {
				var TEST_FORMAT = 'u16',
					soxyConverter = new SoxyConverter({
						signed: false
					});

				soxyConverter.format.should.equal(TEST_FORMAT);
				soxyConverter.bufWriter.should.equal(Buffer.prototype.writeUInt16LE);
			});
		});
	});

	describe('_transform', function() {
		var soxyConverter = null,
			soxyTimer = null,
			testFilter = null,
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
			soxyTimer = new SoxyTimer({ startSignal: 0, startTime: 30, timeLimit: 31 });
			testFilter = new SineFilter({ debug: true });
			testReaderStream = new TestReaderStream();
		});

		afterEach(function() {
			soxyConverter = null;
			soxyTimer = null;
			testFilter = null;
			testReaderStream = null;
			transformCallbackData = null;
		});

		it('should convert signal data to Sox-compliant format', function(done) {
			soxyTimer.pipe(testFilter).pipe(soxyConverter).pipe(testReaderStream);

			soxyTimer.start();

			setTimeout(function() {
				should.exist(transformCallbackData);

				transformCallbackData.should.be.an.instanceOf(Buffer);

				transformCallbackData.readInt16LE(0).should.equal(31207);

				done();
			}, 30);
		});
	});
});
