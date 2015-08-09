'use strict';

var evaluateString = require(srcPath + '/consumer/math-evaluator').evaluateString;

describe('consumer/MathEvaluator.js', function() {

    describe('evaluateString(mathExpression)', function() {

        describe('when given an addition expression in the form "x + y = "', function() {
            it('should resolve the addition of floating point numbers', function() {
                expect(evaluateString('1.45 + 2.25 = ')).to.eventually.eql(3.7);
            });

            it('should resolve the addition of positive whole numbers', function() {
                expect(evaluateString('4 + 3 =')).to.eventually.eql(7);
            });

            it('should resolve the addition of negative whole numbers', function() {
                expect(evaluateString('-1 + -3 =')).to.eventually.eql(-4);
            });
        });

        describe('when given a subtraction expression in the form "x - y = "', function() {
            it('should resolve the subtraction of floating point numbers', function() {
                expect(evaluateString('1.45 - 2.25 = ')).to.eventually.eql(-0.8);
            });

            it('should resolve the subtraction of positive whole numbers', function() {
                expect(evaluateString('8 - 2 = ')).to.eventually.eql(6);
            });

            it('should resolve the subtraction of negative whole numbers', function() {
                expect(evaluateString('-5 - -6 = ')).to.eventually.eql(-11);
            });
        });

        describe('when given a multiplication expression in the form "x * y = "', function() {
            it('should resolve the multiplication of floating point numbers', function() {
                expect(evaluateString('3 * 4 = ')).to.eventually.eql(12);
            });

            it('should resolve the multiplication of positive whole numbers', function() {
                expect(evaluateString('3 * 4 = ')).to.eventually.eql(12);
            });

            it('should resolve the multiplication of negative whole numbers', function() {
                expect(evaluateString('-3 * -4 = ')).to.eventually.eql(-12);
            });
        });

        describe('when given a division expression in the form "x / y = "', function() {
            it('should resolve the division of floating point numbers', function() {
                expect(evaluateString('4.50 / 4 = ')).to.eventually.eql(1.5);
            });

            it('should resolve the division of positive whole numbers', function() {
                expect(evaluateString('3 / 4 = ')).to.eventually.eql(0.75);
            });

            it('should resolve the division of negative whole numbers', function() {
                expect(evaluateString('-8 / 2 = ')).to.eventually.eql(-4);
            });
        });

        it('should reject any expressions not in the form "x + y = "', function() {
            expect(evaluateString('1 ^ 2 = '))
                .to.be.rejectedWith('`1 ^ 2 = ` must be in the form of a math expression, e.g. `2+3=`');
            expect(evaluateString('1 + 2'))
                .to.be.rejectedWith('`1 + 2` must be in the form of a math expression, e.g. `2+3=`');
            expect(evaluateString('-2 ='))
                .to.be.rejectedWith('`-2=` must be in the form of a math expression, e.g. `2+3=`');
        });

        it('should optionally accept spaces around the operator', function() {
            expect(evaluateString('1 + 2=')).to.eventually.eql(3);
            expect(evaluateString('1+ 2=')).to.eventually.eql(3);
            expect(evaluateString('1 +2=')).to.eventually.eql(3);
            expect(evaluateString('1+2=')).to.eventually.eql(3);
        });

        it('should optionally accept spaces around the =', function() {
            expect(evaluateString('1+2 = ')).to.eventually.eql(3);
            expect(evaluateString('1+2 =')).to.eventually.eql(3);
        });
    });

});