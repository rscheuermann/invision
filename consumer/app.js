'use strict';

var connect = require('connect');
var bodyParser = require('body-parser');
var MathEvaluator = require('./math-evaluator');
var logger = require('../lib/logger').consumer;

var STATUS_METHOD_NOT_ALLOWED = 405;
var STATUS_NOT_ACCEPTABLE = 406;
var STATUS_BAD_REQUEST = 400;
var STATUS_OK = 200;

module.exports = function () {

    var app = connect();

    /**
     * PARSE BODY
     *
     * Parses the body as plain text
     */
    app.use(bodyParser.text());

    /**
     * LOG REQUEST
     */
    app.use(function (req, res, next) {
        logger.info('REQUEST  "' + req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '" - ' + '    - [' + req.body + ']');
        next();
    });

    /**
     * POST /compute
     *
     * Calculates the result of a mathematical expression in the form "x + y = "
     *
     * Supports addition (+), subtraction (-), multiplication (*), and division (/)
     *
     * Supports negative, positive, floating point numbers (decimals)
     *
     * @accepts Content-Type: text/plain
     * @body {string} Math expression in the form "x + y = "
     * @response {string}
     *   Content-Type: text/plain
     *   Body: x + y = z
     *
     */
    app.use('/compute', function (req, res, next) {

        if (req.method !== 'POST') {
            res.statusCode = STATUS_METHOD_NOT_ALLOWED;
            res.end();
            return next();
        }

        if (req.headers['content-type'] !== 'text/plain') {
            res.statusCode = STATUS_NOT_ACCEPTABLE;
            res.end();
            return next();
        }

        var body = req.body;
        MathEvaluator.evaluateString(body)
            .then(function (computedResult) {

                res.statusCode = STATUS_OK;

                // store result on response object (for logging)
                res.body = body + computedResult; // "1 + 2 = 3"

                res.end(res.body);
                next();
            })
            .catch(function (error) {

                res.statusCode = STATUS_BAD_REQUEST;

                // store result on response object (for logging)
                res.body = 'Invalid syntax: ' + error.toString();

                res.end(res.body);
                next();
            });

    });

    /**
     * LOG RESPONSE
     */
    app.use(function (req, res, next) {
        logger.info('RESPONSE "' + req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '" - ' + res.statusCode + ' - [' + (res.body ? res.body : '') + ']');
        next();
    });

    /**
     * LOG ANY MIDDLEWARE ERRORS
     */
    app.use(function onerror(err, req, res, next) {
        logger.error('"' + req.method + ' ' + req.url + ' HTTP/' + req.httpVersion + '" - [' + req.body + '] - ' + err);
        next();
    });

    return app;

};