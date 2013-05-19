var should = require('should'),
   fs = require('fs'),
   Soxy = require('../soxy'),
   TestFilter = require('../filters/test-filter');

describe('Soxy', function() {
   var fileStream = null,
       soxy = null;;

   beforeEach(function() {
      fileStream = fs.createReadStream('test/fixtures/simple-file.txt');
      soxy = Soxy();
   });

   afterEach(function() {
      fileStream = null;
      soxy = null;
   });

   describe('"play" a file', function() {

      it('should be able to play a simple stream', function(done) {
         (function() {
            soxy.once('done', function() { done(); });
            soxy.play(fileStream);
         }).should.not.throw();
      });

      describe('Multiple plays', function() {
         var secondStream = null;

         beforeEach(function() {
            secondStream = fs.createReadStream('test/fixtures/multi-line-file.txt');
         });

         afterEach(function() {
            secondStream = null;
         });

         it('should be able to play two streams', function(done) {
            (function() {
               soxy.once('done', function() {
                  soxy.play(secondStream);
                  soxy.once('done', function() { done(); });
               });
               soxy.play(fileStream);
            }).should.not.throw();
         });
      });
   });

   describe('add filters', function() {
      var testFilter = null;

      beforeEach(function() {
         testFilter = TestFilter('one');
      });

      afterEach(function() {
         testFilter = null;
      });

      it('should be able to add filters', function(done) {
         soxy.addFilter(testFilter);

         (function() {
            soxy.once('done', function() { done(); });
            soxy.play(fileStream);
         }).should.not.throw();
      });
   });
});
