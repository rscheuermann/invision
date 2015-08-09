'use strict';

var request = require('supertest');

describe('consumer.js', function() {

    it('should run as a standalone NodeJS server', function(done) {

        var server;

        expect(function() {
            server = require(srcPath + '/consumer');
        }).not.to.throw(Error);

        request('http://localhost:'+(process.env.PORT || 3000))
            .post('/compute')
            .type('text/plain')
            .send('1+1=')
            .expect(200)
            .end(function() {
                server.stop();
                done();
            });

    });

});