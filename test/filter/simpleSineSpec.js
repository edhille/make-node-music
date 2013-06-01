var should = require('should'),
   SignalData = require('../../soxy/signalData'),
   SineFilter = require('../../filters/simpleSine');

describe('Simple Sine Filter Class', function() {

	describe('instantiation', function() {
		describe('defaults', function() {
			var sineFilter = null;

			beforeEach(function() {
				sineFilter = new SineFilter();
			});

			afterEach(function() {
				sineFilter = null;
			});

			it('should default to middle A for the frequency', function() {
				sineFilter.freq.should.equal(440);
			});

			it('should default to an "additive" operator', function() {
				sineFilter.type.should.equal('additive');
				sineFilter.operator(1, 0).should.equal(1);
			});
		});

		describe('custom', function() {
			it('should allow you to set a custom frequency', function() {
				var sineFilter = new SineFilter({ freq: 369.994 }); // F#

				sineFilter.freq.should.equal(369.994);
			});

			it('should allow you to set a "subtractive" operator', function() {
				var TEST_TYPE = 'subtractive',
					sineFilter = new SineFilter({ type: TEST_TYPE });
	
				sineFilter.type.should.equal(TEST_TYPE);
				sineFilter.operator(1,1).should.equal(0);
			});

			it('should allow you to set a "multiplicative" operator', function() {
				var TEST_TYPE = 'multiplicative',
					sineFilter = new SineFilter({ type: TEST_TYPE });
	
				sineFilter.type.should.equal(TEST_TYPE);
				sineFilter.operator(1,0).should.equal(0);
			});

			it('should allow you to set a "divisive" operator', function() {
				var TEST_TYPE = 'divisive',
					sineFilter = new SineFilter({ type: TEST_TYPE });
	
				sineFilter.type.should.equal(TEST_TYPE);
				sineFilter.operator(1,2).should.equal(0.5);
			});
		});
	});

	describe('signal processing', function() {
		describe('"divisive" operator', function() {
			var sineFilter = null;

			beforeEach(function() {
				sineFilter = new SineFilter({ type: 'divisive' });
			});

			afterEach(function() {
				sineFilter = null;
			});

			it('should not freak out if dividing by zero', function() {
				sineFilter.operator(1,0).should.equal(1);
			});
		});

		describe('"additive" operator', function() {
			var sineFilter = null,
				signalData = null;

			beforeEach(function() {
				sineFilter = new SineFilter();
				signalData = new SignalData();
			});

			afterEach(function() {
				sineFilter = null;
				signalData = null;
			});

			it('should return half of 440 (220) for valid appropriate input', function() {
				signalData.time = 30;

				sineFilter.updateSignal(signalData);

				// NOTE: of course this is floating-point, so it's not that precise...
				Math.ceil(signalData.channels[0]).should.equal(1);
			});
		});
	});
});
