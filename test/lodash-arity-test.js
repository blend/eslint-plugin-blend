'use strict';

var eslint = require('eslint');
var rule = require('../lib/lodash-arity');
var _ = require('lodash');

new eslint.RuleTester().run('lib/lodash-arity', rule, {
  valid: [
    '_.partial(myFun, "a")',
    'notPartial(myFun)',
    '_.map(myFun, "a")'
  ],
  invalid: _.map([
    '_.partial(myFun)',
    '_.partial()',
    '_.map(myFun)',
    '_.map()'
  ], function(code) {
    return {
      code: code,
      errors: [{ message: '_.partial and _.map must be called with at least 2 arguments.' }]
    };
  })
});
