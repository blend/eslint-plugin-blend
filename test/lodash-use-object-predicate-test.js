'use strict';

var eslint = require('eslint');
var rule = require('../lib/lodash-use-object-predicate');

new eslint.RuleTester().run('lib/lodash-use-object-predicate', rule, {
  valid: [
    '_.find([], { x: 1 })',
    '_.find([], function(x) { return x.y > z; })',
    '_.find([], function(x) { x.y === z; })',
    '_.find([], function(x) { return true; })',
    '_.notAFunction([], function(x) { return x.y === z; })'

    // TODO (em) Don't fail on case where p is used in the matched value.
    // '_.every(arr, function(p) { return p.value === obj[p._id] };})'
  ],
  invalid: [{
    code: '_.find([], function(x) { return x.y === z; })',
    errors: [{ message: 'Lodash call can be rewritten to: _.find([], { y: z })' }]
  }, {
    code: '_.find([1,2,3], function(x) { return x.y === z; })',
    errors: [{ message: 'Lodash call can be rewritten to: _.find([1,2,3], { y: z })' }]
  }, {
    code: '_.find([], function(x) { return x.y === "hi"; })',
    errors: [{ message: 'Lodash call can be rewritten to: _.find([], { y: "hi" })' }]
  }]
});
