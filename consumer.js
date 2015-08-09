'use strict';

var port = process.env.PORT || 3000;
var http = require('http');

var app = require('./consumer/app')();

var server = http.createServer(app);

module.exports = {

    /**
     * Starts the server on the given port
     */
    start: function() {

        server.listen(port, function() {
            console.log('---------------------------------');
            console.log('CONSUMER STARTED');
            console.log(' - Port: ' + port);
            console.log('---------------------------------');
        });

    },

    /**
     * Stops the server
     */
    stop: function() {

        server.close(function() {
            console.log('');
            console.log('---------------------------------');
            console.log('CONSUMER STOPPED');
            console.log('---------------------------------');
        });

    }

};

process.on('SIGINT', function() {
    module.exports.stop();
});

module.exports.start();