'use strict';

var requestsPerSecond = process.env.REQS_PER_SECOND || 10;
var consumerURL = process.env.CONSUMER_URL || 'http://localhost:3000/compute';

var MathRandomizer = require('./producer/math-randomizer');

var agent = require('./producer/http-agent');

/**
 * Perform the POST request with a random math expression
 */
var post = function() {

    // NOTE: ordinarily, I'd use superagent to make this request, but I wrote it using vanilla Node
    //       in order to keep external dependencies low and remain true to the spirit of the test
    agent.post({
        url: consumerURL,
        headers: {
            'Content-Type': 'text/plain'
        },
        body: MathRandomizer.randomMathExpression()
    });

};

// the loop
var loop;

module.exports = {

    /**
     * Starts the producer, making requests at X reqs/s
     */
    start: function() {

        // make one request immediately
        post();

        // start looping requests
        loop = setInterval(post,  1000/requestsPerSecond);

        console.log('---------------------------------');
        console.log('PRODUCER STARTED');
        console.log(' - URL: ' + consumerURL);
        console.log(' - Reqs/sec: ' + requestsPerSecond);
        console.log('---------------------------------');
    },

    /**
     * Stops the producer
     */
    stop: function() {
        clearTimeout(loop);

        console.log('');
        console.log('---------------------------------');
        console.log('PRODUCER STOPPED');
        console.log('---------------------------------');
    }

};

process.on('SIGINT', function() {
    module.exports.stop();
});

module.exports.start();