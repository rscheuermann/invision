'use strict';

var operators = ['+', '-', '*', '/'];
var equals = '=';

/**
 * Returns a random number between min (inclusive) and max (inclusive)
 *
 * @param min {float,number} Minimum number (inclusive)
 * @param max {float,number} Maximum number (inclusive)
 * @returns {float,number}
 */
var rand = function(min, max) {
    return min + (Math.random() * (max - min));
};

/**
 * Returns a random element from the specified array
 *
 * @param arr {string[]} - The array to choose the random value from
 * @returns {*} A random value in the array
 */
var sample = function(arr) {
    return arr[Math.floor(Math.random()*arr.length)];
};

module.exports = {

    /**
     * Returns a random simple math expression, in the form "x + y = "
     *  where x is a random number between 0 (inclusive) and maxX (inclusive), with precision (num decimals)
     *    and the operator is randomly chosen from +, -, *, and /
     *    and y is a random number between 0 (inclusive) and maxY (inclusive), with precision (num decimals)
     *
     * @param {float} [maxX=10] - The max (inclusive) value of x, (optional, defaults to 10)
     * @param {float} [maxY=10] - The max (inclusive) value of y, (optional, defaults to 10)
     * @param {int} [precision=2] - The precision of random x and y (optional, defaults to 2)
     * @returns {string} - The math expression, in the form "x + y = "
     */
    randomMathExpression: function(maxX, maxY, precision) {
        maxX = maxX || 10;
        maxY = maxY || 10;
        precision = (typeof(precision) !== 'undefined') ? precision : 2;

        var x = rand(0, maxX).toFixed(precision);
        var y = rand(0, maxY).toFixed(precision);
        var operator = sample(operators);

        return x + ' ' + operator + ' ' + y + ' ' + equals + ' ';
    }

};