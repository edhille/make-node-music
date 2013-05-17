#!/usr/bin/env node

var baudio = require('baudio'),
	//waveGenerator = require('./waveGenerators/combinedWave'),
	//waveGenerator = require('./waveGenerators/simpleSine'),
	songGenerator = require('./grooves/textGenerator'),
    player = baudio(songGenerator.generate(400));

console.log('Ready to make sounds?');

player.play();
