'use strict';

var logger = require(srcPath + '/lib/logger');

describe('lib/logger', function() {

    it('should export a "consumer" logger with info, error, and warn methods', function() {
        expect(logger.consumer).to.respondTo('info');
        expect(logger.consumer).to.respondTo('error');
        expect(logger.consumer).to.respondTo('warn');
    });

    it('should configure a "producers" logger with info, error, and warn methods', function() {
        expect(logger.producers).to.respondTo('info');
        expect(logger.producers).to.respondTo('error');
        expect(logger.producers).to.respondTo('warn');
    });

});