#!/usr/bin/env node

var Soxy = require('./soxy'),
    SineFilter = require('./filters/simpleSine');

console.log('Ready to make sounds?');

var soxy = new Soxy({
	timer: {
		timeLimit: 200000
	}
});

soxy.addFilter(new SineFilter({ id: 'one' }));
soxy.play();
