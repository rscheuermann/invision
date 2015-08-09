'use strict';

var randomMathExpression = require(srcPath + '/producer/math-randomizer').randomMathExpression;
var MATH_EXPR_REGEX = require(srcPath + '/consumer/math-evaluator').MATH_EXPR_REGEX;

/**
 * Performs the test function 1000 times for "fuzzy" random testing
 *
 * @param func
 */
var iterate = function(func) {
    return function(done) {
        for(var i = 0; i < 1000; ++i) {
            func();
        }
        done();
    }
};

describe('producer/MathRandomizer.js', function() {

    describe('randomMathExpression(minX, minY, precision)', function() {

        describe('when no parameters are specified', function() {

            it('should generate a math expression in the form "x + y = "', iterate(function() {
                expect(randomMathExpression()).to.match(MATH_EXPR_REGEX);
            }));

            it('should use a random x between 0 (inclusive) and 10 (inclusive)', iterate(function() {
                var parts = randomMathExpression().match(MATH_EXPR_REGEX);
                var x = parts[1];

                expect(x).to.be.within(0, 10);
            }));

            it('should use a random y between 0 (inclusive) and 10 (inclusive)', iterate(function() {
                var parts = randomMathExpression().match(MATH_EXPR_REGEX);
                var y = parts[3];

                expect(y).to.be.within(0, 10);
            }));

            it('should generate x and y with 2 digits of precision', iterate(function() {
                var parts = randomMathExpression().match(MATH_EXPR_REGEX);
                var x = parts[1];
                var y = parts[3];

                var xDecimals = x.split('.')[1];
                var yDecimals = y.split('.')[1];
                expect(xDecimals).to.have.length.of.at.most(2);
                expect(yDecimals).to.have.length.of.at.most(2);
            }));

            it('should use a random operator (+, -, *, or /)', iterate(function() {
                var parts = randomMathExpression().match(MATH_EXPR_REGEX);
                var operator = parts[2];
                expect(operator).to.match(/[\+\-\*\/]/);
            }));

        });

        describe('when specifying a maxX', function() {

            it('should use a random x between 0 (inclusive) and the maxX value (inclusive)', iterate(function() {
                var parts = randomMathExpression(50).match(MATH_EXPR_REGEX);
                var x = parts[1];

                expect(x).to.be.within(0, 50);
            }));

        });

        describe('when specifying a maxY', function() {

            it('should use a random y between 0 (inclusive) and the maxY value (inclusive)', iterate(function() {
                var parts = randomMathExpression(100, 50).match(MATH_EXPR_REGEX);
                var y = parts[3];

                expect(y).to.be.within(0, 50);
            }));

        });

        describe('when specifying a precision', function() {

            it('should generate x and y with at most the given number of decimal places', iterate(function() {
                var parts = randomMathExpression(10, 10, 6).match(MATH_EXPR_REGEX);
                var x = parts[1];
                var y = parts[3];

                var xDecimals = x.split('.')[1];
                var yDecimals = y.split('.')[1];
                expect(xDecimals).to.have.length.of.at.most(6);
                expect(yDecimals).to.have.length.of.at.most(6);
            }));

        });

    });

});