#!/usr/bin/env node

var soxy = require('./soxy')(),
    filter = require('./filters/test-filter'),
    fs = require('fs'),
    fsStreamOne = fs.createReadStream('./package.json');

console.log('Ready to make sounds?');

soxy.addFilter(filter({ id: 'one' }));
soxy.play(fsStreamOne);

fsStreamOne.once('end', function() {
   var fsStreamTwo = fs.createReadStream('./README.md');

   soxy.addFilter(filter({ id: 'two' }));

   try {
      soxy.play(fsStreamTwo);
   }
   catch(e) {
      console.error(e);
   }
});
