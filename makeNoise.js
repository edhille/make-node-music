#!/usr/bin/env node

var soxy = require('./soxy')(),
    filter = require('./filters/test-filter'),
    fs = require('fs'),
    fsStreamOne = fs.createReadStream('./package.json');

console.log('Ready to make sounds?');

soxy.addFilter(filter('one'));
soxy.play(fsStreamOne);

fsStreamOne.once('end', function() {
   var fsStreamTwo = fs.createReadStream('./README.md');

   console.log('yo');
   soxy.addFilter(filter('two'));

   try {
      soxy.play(fsStreamTwo);
   }
   catch(e) {
      console.error(e);
   }
});

/*
TODO:
	- how can streams be used to allow chaining of wave generators?
	- or, another way, is it possible to dynamically add/remove wave generators from a chain?
*/


/*
 *
 *  (someFile) ===> [parse tokens] ===> [add/remove filter based upon token] ===> [send to sox]
 */
