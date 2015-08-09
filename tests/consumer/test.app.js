'use strict';

var fs = require('fs');
var request = require('supertest');

var logdir = process.env.LOGDIR;

if (!logdir) {
    throw new Error('Environment variable missing: LOGDIR');
}

describe('consumer/app', function() {

    describe('POST /compute', function() {

        var app = require(srcPath + '/consumer/app')();

        var logfile = logdir + 'consumer.log';
        var logWriteDelay = 100 // delay reading log file

        // clear the log file before every test
        beforeEach(function() {
            if(fs.existsSync(logfile)) {
                fs.truncateSync(logfile);
            }
        });

        it('should accept a mathematical expression in the form "x + y = " as POST body', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 + 2 =')
                .expect(200, done);

        });

        it('should compute the correct mathematical result of given expression', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 + 2 = ')
                .expect(200, '1 + 2 = 3', done);

        });

        it('should return the full expression with the result in the form "x + y = z"', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 + 2 = ')
                .expect(200)
                .end(function(err, res) {
                    if(err) {
                        return done(err);
                    }
                    expect(res.text).to.match(/^([\d\.\-]+)\s*([\+\-\*\/])\s*([\d\.\-]+)\s*=\s*([\d\.\-]+)$/);
                    done();
                });

        });

        it('should respond with a 406 if the content type is not "text/plain"', function(done) {

            request.agent(app)
                .post('/compute')
                .type('application/json')
                .send('1 x 2 = ')
                .expect(406, done);
        });

        it('should respond with a 400 if the math expression is invalid', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 x 2 = ')
                .expect(400, done);
        });

        it('should respond with a 405 if not using POST method', function(done) {

            request.agent(app)
                .get('/compute')
                .expect(405, done);

        });

        it('should log all requests', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 + 2 = ')
                .expect(200)
                .end(function(err) {
                    if(err) {
                        return done(err);
                    }

                    setTimeout(function() {

                        var data = fs.readFileSync(logfile);
                        expect(data.toString()).to.include('REQUEST  "POST /compute HTTP/1.1" -     - [1 + 2 = ]');
                        done();

                    }, logWriteDelay); // give winston time to finish writing to the log
                });

        });

        it('should log all responses', function(done) {

            request.agent(app)
                .post('/compute')
                .type('text/plain')
                .send('1 + 2 = ')
                .expect(200)
                .end(function(err) {
                    if(err) {
                        return done(err);
                    }

                    setTimeout(function() {

                        var data = fs.readFileSync(logfile);
                        expect(data.toString()).to.include('RESPONSE "POST /compute HTTP/1.1" - 200 - [1 + 2 = 3]');
                        done();

                    }, logWriteDelay); // give winston time to finish writing to the log
                });

        });

    });

});