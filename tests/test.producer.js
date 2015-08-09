'use strict';

var agent = require(srcPath + '/producer/http-agent');

describe('producer.js', function() {

    beforeEach(function() {
        this.sandbox = sinon.sandbox.create();
    });

    afterEach(function() {
        this.sandbox.restore();

        var required = require.resolve(srcPath + '/producer');
        delete require.cache[required];
    });

    it('should run as a standalone NodeJS service', function() {

        this.sandbox.mock(agent).expects('post').atLeast(1);

        expect(function() {
            var loop = require(srcPath + '/producer');
            loop.stop();
        }).not.to.throw(Error);

    });

    it('should make 10 requests/sec to the consumer', function(done) {

        var mock = this.sandbox.mock(agent).expects('post').atLeast(10);

        var loop = require(srcPath + '/producer');

        setTimeout(function() {
            loop.stop();

            mock.verify();
            done();

        }, 1000);

    });

});