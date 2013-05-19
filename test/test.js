var should = require('should'),
   fs = require('fs'),
   Soxy = require('../soxy');

describe('Soxy', function() {
   var fileStream = null;

   beforeEach(function() {
      fileStream = fs.createReadStream('test/fixtures/simple-file.txt');
   });

   afterEach(function() {
      fileStream = null;
   });

   describe('"play" a file', function() {
      var soxy = null;

      beforeEach(function() {
         soxy = Soxy();
      });

      afterEach(function() {
         soxy = null;
      });

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
      it('should be able to add filters...');
   });
});
