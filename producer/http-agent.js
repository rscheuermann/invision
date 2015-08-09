'use strict';

var url = require('url');
var http = require('http');
var logger = require('../lib/logger').producers;

/**
 * Wrapper method for buffering the body contents of the HTTP response,
 *  used to simplify readability of the callback to http.request below
 *
 * @param callback(err, res, body)
 * @returns {Function} Callback function for http.request
 */
var readResBody = function (callback) {

    return function (res) {

        // do not buffer response body for non-200 responses
        if (res.statusCode !== 200) {
            return callback(new Error(res.statusCode + ' ' + res.statusMessage));
        }

        var body = '';
        res.on('data', function (data) {

            // read the chunked response data into the body string
            body += data.toString();
        });
        res.on('end', function () {

            // pass the response and complete body contents to the callback
            callback(null, res, body);
        });

    };

};

module.exports = {

    /**
     * Basic method for making a POST HTTP request, using native Node 'http' module
     *
     * @param requestObj {object} An object describing the request, required
     * @option url {string} URL to request (required)
     * @option body {string} The data to send in the POST body (optional)
     * @option headers {object} Object containing headers to send with the request (optional)
     * @option callback {function(err, res, resBody)} Callback passed the response (optional)
     *
     */
    post: function (requestObj) {
        if (typeof requestObj !== 'object') {
            throw new Error('Required parameter `requestObj` must be an object');
        }

        var requestUrl = requestObj.url;

        if (requestUrl) {

            // parse the URL into its respective parts
            var urlParts = url.parse(requestUrl);

            // in ES6, this would be a simple Object.assign to merge 2 objects...
            requestObj.hostname = urlParts.hostname;
            requestObj.port = urlParts.port;
            requestObj.path = urlParts.path; // includes query string, if any

            // remove the url property, to prevent conflict
            delete requestObj.url;

        } else {
            throw new Error('Required requestObj property `url` is missing');
        }

        var callback = requestObj.callback || function() {};

        var postData = requestObj.body;

        requestObj.method = 'POST';

        // start a request timer
        var startTime = Date.now();

        // construct the request, with callback for the response
        var req = http.request(requestObj, readResBody(function (err, res, resBody) {
            if (err) {
                logger.error('Encountered error response: ' + err);

                callback(err);
                return;
            }

            // log the response, with total time in ms
            // RESPONSE "POST http://localhost:3000/compute" - 200 - [8.42 * 3.68 = 30.9856] 2ms
            logger.info('RESPONSE "' + requestObj.method + ' ' + requestUrl + '" - ' + res.statusCode + ' - [' + resBody + '] ' + (Date.now() - startTime) + 'ms');

            // response complete, call the callback
            callback(null, res, resBody);
        }));

        // handle any errors establishing the connection or making the request
        req.on('error', function (e) {
            logger.error('Encountered problem making request: ' + e.message);

            // response complete, pass err to callback
            callback(e);
        });

        req.write(postData);

        // log the request
        // REQUEST  "POST http://localhost:3000/compute" -     - [8.42 * 3.68 = ]
        logger.info('REQUEST  "' + requestObj.method + ' ' + requestUrl + '" - ' + '    - [' + postData + ']');

        req.end();

    }

};