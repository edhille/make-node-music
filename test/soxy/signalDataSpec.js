var should = require('should'),
   SignalData = require('../../soxy/signalData');

describe('SignalData', function() {
	describe('default instantiation', function() {
		var signalData = null;

		beforeEach(function() {
			signalData = new SignalData();
		});

		afterEach(function() {
			signalData = null;
		});

		it('should have a time of zero', function() {
			signalData.time.should.equal(0);
		});

		it('should have a one channel with a value of zero', function() {
			signalData.channels.should.have.lengthOf(1);
			signalData.channels[0].should.equal(0);
		});
	});

	describe('custom instantiation', function() {
		it('should allow for custom time value', function() {
			var signalData = new SignalData({ time: 23 });

			signalData.time.should.equal(23);
		});

		it('should allow for custom initial value for channel', function() {
			var signalData = new SignalData({ startSignal: 23 });
	
			signalData.channels[0].should.equal(23);
		});

		it('should allow for custom number of channels', function() {
			var signalData = new SignalData({ channelCount: 2 });

			signalData.channels.should.have.lengthOf(2);
		});
	});
});
