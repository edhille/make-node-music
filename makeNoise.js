#!/usr/bin/env node

var baudio = require('baudio'),
	songGenerator = require('./grooves/textGenerator'),
    player = baudio(songGenerator.generate());

console.log('Ready to make sounds?');

player.on('data', function(data) {
	console.log('data', data);
});

player.play();

/*
TODO:
	- how can streams be used to allow chaining of wave generators?
	- or, another way, is it possible to dynamically add/remove wave generators from a chain?
*/
