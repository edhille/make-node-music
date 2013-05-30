#!/usr/bin/env node

var Soxy = require('./soxy2'),
    SineFilter = require('./filters/simpleSine');

console.log('Ready to make sounds?');

var soxy = new Soxy({
	timer: {
		timeLimit: 1200
	}
});

soxy.addFilter(new SineFilter({ id: 'one' }));
soxy.play();
