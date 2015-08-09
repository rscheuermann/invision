'use strict';

var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var winston = require('winston');

var logDir = process.env.LOGDIR || './logs';

/**
 * Create the log directory, if it doesn't exist
 */
if(!fs.existsSync(logDir)) {
    mkdirp.sync(logDir);
}

/**
 * Configure the logger for the consumer
 */
winston.loggers.add('consumer', {
    console: {
        level: 'error'
    },
    file: {
        filename: path.join(logDir, 'consumer.log'),
        level: 'info',
        json: false,
        tailable: true
    }
});

/**
 * Configure the logger for the producers
 */
winston.loggers.add('producers', {
    console: {
        level: 'error'
    },
    file: {
        filename: path.join(logDir, 'producers.log'),
        level: 'info',
        json: false,
        tailable: true
    }
});

module.exports = {
    consumer: winston.loggers.get('consumer'),
    producers: winston.loggers.get('producers')
};