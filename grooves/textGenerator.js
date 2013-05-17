var sample = "Some bit of text that can be converted into notes and then played",
    notes  = [],
	sineGenerators = [],
	sineGenerator = require('../waveGenerators/simpleSine'),
	BASE_NOTE_DURATION = 10000;

function buildNotesFromString(str) {
	return str.split(/\s+/).map(function(word, i) {
		var value = 0; 

		word.split('').map(function(letter, j) {
			value += word.charCodeAt(j);
		});

		console.log(word, parseFloat('.' + value));

		return { type: i, ivalue: value, fvalue: parseFloat('.' + value), duration: word.length };
	});
}

notes = buildNotesFromString(sample);

exports.generate = function() {
	var generators = [],
	    counter = 0,
		currIdx = 0,
		currGenerator;

	return function(t, i) {
		var index = 0,
			note = notes[index];

		if (counter === 0) {
			index = Math.floor(t * 2) % notes.length; 
			note = notes[index];
			counter = note.duration * BASE_NOTE_DURATION;

			currGenerator = generators[index] || sineGenerator.generator(note.ivalue);
		}

		--counter;

		return currGenerator(t);
	};
};

// use the length of the word as the multiplier for the length of the note
// use FRP on streams of words/sentences/paragraphs to alter the filters used
