'use strict';

/**
 * Matches a string for a math expression, in the form "x + y = "
 *
 * x and y can be positive or negative whole or floating point numbers ([\d\.\-]+)
 *
 * Allowed operators are +, -, *, and / ([\+\-\*\/])
 *
 * Zero or more spaces around operators, numbers, or the = symbol are acceptable
 *
 * @type {RegExp}
 */
var MATH_EXPR_REGEX = /\s*([\d\.\-]+)\s*([\+\-\*\/])\s*([\d\.\-]+)\s*=\s*/;

/**
 * Adds, subtracts, multiplies, and divides 2 numbers according to string operator
 *
 *  e.g. (firstNum + secondNum)
 *
 * @param firstNum {float,number} The first number
 * @param operator {string} Supports '+', '-', '*', and '/'
 * @param secondNum {float,number} The second number to compute
 * @returns {float,number}
 */
var compute = function(firstNum, operator, secondNum) {

    switch(operator) {

        default:
        case '+':
            return firstNum + secondNum;

        case '-':
            return firstNum - secondNum;

        case '*':
            return firstNum * secondNum;

        case '/':
            return firstNum / secondNum;

    }

};

module.exports = {

    /**
     * The regular expression that matches against a valid math equation this module accepts
     *
     * Exported for reference and unit tests
     */
    MATH_EXPR_REGEX: MATH_EXPR_REGEX,

    /**
     * Evaluates a math expression represented as a string
     *
     * Addition is supported using syntax:
     *
     *    "1 + 2 = "
     *
     * Subtraction:
     *
     *    "2 - 1 = "
     *
     * Multiplication:
     *
     *    "1 * 2 = "
     *
     * Division:
     *
     *    "1 / 2 = "
     *
     * Negative numbers and numbers containing decimals are supported
     *
     * @param mathExpression {string}  - String containing math expression
     * @returns {Promise}
     * @resolves {float} The results of the math expression
     * @rejects {Error} When the expression cannot be parsed
     *
     */
    evaluateString: function(mathExpression) {

        // written to return a Promise in order to emulate an asynchronous operation
        return new Promise(function(resolve,reject){

            mathExpression = mathExpression.toString().trim();

            var expressionParts = mathExpression.match(MATH_EXPR_REGEX);

            if(!expressionParts) {
                return reject(new Error('`' + mathExpression + '` must be in the form of a math expression, e.g. `2+3=`'));
            }

            var firstNum = parseFloat(expressionParts[1]);
            var operator = expressionParts[2];
            var secondNum = parseFloat(expressionParts[3]);

            return resolve(compute(firstNum, operator, secondNum));

        });

    }

};