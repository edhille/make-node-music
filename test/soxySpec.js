var should = require('should'),
   Events = require('events'),
   Util = require('util'),
   Soxy = require('../soxy2'),
   Filter = require('../filters/base');

describe('Soxy', function() {

	describe('instantiation', function() {

		it('should be an Event Emitter', function() {
			var soxy = new Soxy();

			(soxy instanceof Events.EventEmitter).should.be.true;
		});

		it('should set up instance with no filters by default', function() {
			var soxy = new Soxy();
			
			soxy.filters.should.have.lengthOf(0);
		});

		it('should allow for filters in the constructor', function() {
			var soxy = new Soxy({
				filters: [
					Filter({ id: 'one' }),
					Filter({ id: 'two' })
				]
			});

			soxy.filters.should.have.lengthOf(2);
		});

		it('should default to no timer options', function() {
			var soxy = new Soxy();
			soxy.timerOpts.should.not.be.undefined;
		});

		it('should allow for custom timer options', function() {
			var soxy = new Soxy({
				timer: {
					timeLimit: 1
				}
			});
			soxy.timerOpts.should.not.be.undefined;
			soxy.timerOpts.timeLimit.should.equal(1);
		});
	});

	describe('filter management', function() {
		var soxy = null,
			filterOne = null,
			filterTwo = null;

		beforeEach(function() {
			filterOne = new Filter({ id: 'one' });
			filterTwo = new Filter({ id: 'two' });

			soxy = new Soxy({
				filters: [
					filterOne
				]
			});
		});

		afterEach(function() {
			soxy = null;
		});

		it('should allow for adding filters', function() {
			soxy.filters.should.have.lengthOf(1);

			soxy.addFilter(filterTwo);

			soxy.filters.should.have.lengthOf(2);
		});

		it('should not add a filter with the same id as one already there', function() {
			var dupFilter = new Filter({ id: soxy.filters[0].id });

			soxy.filters.should.have.lengthOf(1);

			soxy.addFilter(dupFilter);

			soxy.filters.should.have.lengthOf(1);
		});

		it('should allow for removal of filters', function() {
			soxy.filters.should.have.lengthOf(1);

			soxy.removeFilter(filterOne);

			soxy.filters.should.have.lengthOf(0);
		});
	});

	describe('play', function() {

		var soxy = null;
		var timeData = [];

		function TestFilterSubclass(opts) {
			Filter.apply(this, arguments);
		}

		Util.inherits(TestFilterSubclass, Filter);
		
		TestFilterSubclass.prototype.updateSignal = function(signalData) {
			++signalData.signal;

			timeData.push(signalData);
		};

		beforeEach(function() {
			soxy = new Soxy({
				timer: {
					timeLimit: 1,
					tickLength: 1
				}
			});

			soxy.addFilter(new TestFilterSubclass({ id: 'INHERIT_TEST' }));
		});

		afterEach(function() {
			soxy = null;
			timeData = [];
		});


		it('should be able to alter signal data', function(done) {
			// TODO: should also allow setting timer options in play (without overriding default)
			soxy.play();

			setTimeout(function() {
				timeData.should.have.lengthOf(1);
				timeData[0].signal.should.equal(1);
				done();
			}, 30);
		});
	});
});
