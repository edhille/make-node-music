var should = require('should'),
   Stream = require('stream'),
   Events = require('events'),
   Util = require('util'),
   Soxy = require('../soxy2');
   Filter = require('../filters/base');

describe('Base Filter Class', function() {
	
	describe('instantation', function() {
		
		describe('default', function() {
			var filter = null;

			beforeEach(function() {
				filter = new Filter();
			});

			afterEach(function() {
				filter = null;
			});

			it('should have a default id', function() {
				filter.id.should.equal('NO ID');
			});

			it('should be a Transform Stream', function() {
				(filter instanceof Stream.Transform).should.be.true;
			});

			it('should be an Event Emitter', function() {
				(filter instanceof Events.EventEmitter).should.be.true;
			});
		});

		describe('configured', function() {
			
			it('should set an id if we pass it', function() {
				var testId = 'TEST';
				var filter = new Filter({ id: testId });

				filter.id.should.equal(testId);
			});
		});

		describe('_transform', function() {
			var filter = null;
			
			beforeEach(function() {
				filter = new Filter({ id: 'TEST' });
			});

			afterEach(function() {
				filter = null;
			});

			it('should not alter the given signal data by default', function() {
				var signalData = { time: 0, signal: 0 },
					calledCallback = false;
				
				filter._transform(signalData, null, function() {
					calledCallback = true;
				});

				calledCallback.should.be.true;
			});
		});
	});

	describe('subclassing', function() {
		var subFilter = null,
			timeData = [],
			TEST_ID = 'TEST_SUBCLASS';

		function TestFilterSubclass(opts) {
			Filter.apply(this, arguments);
		}

		Util.inherits(TestFilterSubclass, Filter);
		
		TestFilterSubclass.prototype.updateSignal = function(signalData) {
			++signalData.signal;

			timeData.push(signalData);
		};

		beforeEach(function() {
			subFilter = new TestFilterSubclass({ id: TEST_ID });
		});

		afterEach(function() {
			subFilter = null;
			timeData = [];
		});

		it('should be an instance of a Filter', function() {
			(subFilter instanceof Filter).should.be.true;
		});

		it('should have an id that we assigned', function() {
			subFilter.id.should.equal(TEST_ID);
		});

		it('should update the siganl data passed in for transformation', function() {
			var signalData = { time: 0, signal: 0 },
				callbackCalled = false;

			subFilter._transform(signalData, null, function() {
				callbackCalled = true;
			});

			callbackCalled.should.be.true;
			signalData.signal.should.equal(1);
		});
	});
});
