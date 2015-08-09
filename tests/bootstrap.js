'use strict';

/**
 * Set global variables for mocha tests
 *
 */

var chai = require('chai');
chai.use(require('chai-as-promised'));

global.expect = chai.expect;

global.sinon = require('sinon');

global.srcPath = __dirname + '/../';