'use strict';

var logdir = process.env.LOGDIR;

if (!logdir) {
    throw new Error('Environment variable missing: LOGDIR');
}

var nock = require('nock');
var fs = require('fs');

var agent = require(srcPath + '/producer/http-agent');

describe('producer/agent', function () {

    describe('post', function () {

        var logfile = logdir + 'producers.log';
        var logWriteDelay = 100; // delay reading log file

        // clear the log file before every test
        beforeEach(function() {
            if(fs.existsSync(logfile)) {
                fs.truncateSync(logfile);
            }
        });

        it('should fail if not passed a request object', function () {

            expect(function () {
                agent.post();
            }).to.throw('Required parameter `requestObj` must be an object');

        });

        it('should fail if not passed a url property', function () {

            expect(function () {
                agent.post({});
            }).to.throw('Required requestObj property `url` is missing');

        });

        it('should make a POST request to the given "url" property', function (done) {

            var mock = nock('http://localhost')
                .post('/compute1', '1 + 2 =')
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute1',
                body: '1 + 2 =',
                headers: {
                    'Content-Type': 'text/plain'
                },
                callback: function (err) {
                    if(err) {
                        return done(err);
                    }

                    expect(mock.isDone()).to.be.true; // verify the request was made
                    done();
                }
            });
        });

        it('should set HTTP headers on the request from the "headers" property', function(done) {

            var mock = nock('http://localhost')
                .matchHeader('Test-Header', 'TEST')
                .post('/compute2', '1 + 2 =')
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute2',
                body: '1 + 2 =',
                headers: {
                    'Content-Type': 'text/plain',
                    'Test-Header': 'TEST'
                },
                callback: function (err) {
                    if(err) {
                        return done(err);
                    }

                    expect(mock.isDone()).to.be.true; // verify the request was made
                    done();
                }
            });

        })

        it('should pass the "body" property as the POST data', function(done) {

            var mock = nock('http://localhost')
                .post('/compute3', 'BODY CONTENTS')
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute3',
                body: 'BODY CONTENTS',
                callback: function (err) {
                    if(err) {
                        return done(err)
                    }

                    expect(mock.isDone()).to.be.true; // verify the request was made
                    done();
                }
            });
        });

        it('should call the "callback" property upon receiving a response', function(done) {
            nock('http://localhost')
                .post('/compute4')
                .reply(200);

            agent.post({
                url: 'http://localhost/compute4',
                callback: function (err, res) {
                    if(err) {
                        return done(err);
                    }

                    expect(res).to.be.ok; // verify the request was made
                    done();
                }
            });
        });

        it('should not fail if "callback" is unspecified', function() {
            nock('http://localhost')
                .post('/compute5')
                .reply(200);

            expect(function() {
                agent.post({
                    url: 'http://localhost/compute5'
                });
            }).not.to.throw();
        });

        it('should log an error if the response code is not 200', function(done) {

            nock('http://localhost')
                .post('/compute6', '')
                .reply(400);

            agent.post({
                url: 'http://localhost/compute6',
                body: '',
                callback: function () {
                    setTimeout(function() {

                        var data = fs.readFileSync(logfile)
                        expect(data.toString()).to.include('Encountered error response')
                        done()

                    }, logWriteDelay) // give winston time to finish writing to the log
                }
            });

        })

        it('should log an error if unable to process the request', function(done) {

            agent.post({
                url: 'http://localhosX/compute7',
                body: 'nothing',
                callback: function () {
                    setTimeout(function() {

                        var data = fs.readFileSync(logfile)
                        expect(data.toString()).to.include('Encountered problem making request')
                        done()

                    }, logWriteDelay) // give winston time to finish writing to the log
                }
            });
        });

        it('should log the request', function(done) {

            nock('http://localhost')
                .post('/compute8', '1 + 2 = ')
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute8',
                body: '1 + 2 = ',
                callback: function (err) {
                    if(err) {
                        return done(err);
                    }

                    setTimeout(function() {

                        var data = fs.readFileSync(logfile);
                        expect(data.toString()).to.include('REQUEST  "POST http://localhost/compute8" -     - [1 + 2 = ]');
                        done();

                    }, logWriteDelay); // give winston time to finish writing to the log
                }
            });
        });

        it('should log the response', function(done) {

            nock('http://localhost')
                .post('/compute9', '1 + 2 = ')
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute9',
                body: '1 + 2 = ',
                callback: function (err) {
                    if(err) {
                        return done(err);
                    }

                    setTimeout(function() {

                        var data = fs.readFileSync(logfile);
                        expect(data.toString()).to.include('RESPONSE "POST http://localhost/compute9" - 200 - [1 + 2 = 3]');
                        done();

                    }, logWriteDelay); // give winston time to finish writing to the log
                }
            });

        });

        it('should log the total time in ms of the request', function(done) {

            nock('http://localhost')
                .post('/compute10', '1 + 2 = ')
                .delay(200) // delay 200ms
                .reply(200, '1 + 2 = 3');

            agent.post({
                url: 'http://localhost/compute10',
                body: '1 + 2 = ',
                callback: function (err) {
                    if(err) {
                        return done(err);
                    }

                    setTimeout(function() {

                        var data = fs.readFileSync(logfile);

                        // last 6 chars of the file should be in the format "208ms\n"
                        expect(parseInt(data.toString().substr(-6))).to.be.gte(200);
                        done();

                    }, logWriteDelay); // give winston time to finish writing to the log
                }
            });

        });

    });


});
