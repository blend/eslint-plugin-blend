'use strict';

var eslint = require('eslint');
var rule = require('../lib/collapse-trivial-function');

var MSG = 'Function of the form "function(err, x) { if (err) return cb(err); cb(null, x) }" ' +
      'should be simplified to "cb"';

new eslint.RuleTester().run('lib/collapse-trivial-function', rule, {
  valid: [
    'var x = function(err, ret) { if (err) { console.log("yo"); return cb(err); } return cb(null, ret); }',
    'var x = function(err, ret) { if (err) { console.log("yo"); return cb(err); } cb(null, ret); }',
    'var x = function(err, ret) { if (err) { return cb(err); } fun(null, ret); }',
    'var x = function(err, ret) { if (err) { return; } cb(null, ret); }',
    'var x = function(err, ret) { if (err) { return cb(); } cb(null, ret); }',
    'var x = function(err, ret) { if (ret) { return cb(err); } cb(null, ret); }'
  ],
  invalid: [{
    code: 'var x = function(err, ret) { if (err) { return cb(err); } cb(null, ret); }',
    errors: [{ message: MSG }]
  }, {
    code: 'var x = function(err, ret) { if (err) { return cb(err); } return cb(null, ret); }',
    errors: [{ message: MSG }]
  }, {
    code: 'var x = function(err, ret) { if (err) return cb(err); return cb(null, ret); }',
    errors: [{ message: MSG }]
  }, {
    code: 'var x = function(err, ret) { if (err) { return yo(err); } return yo(null, ret); }',
    errors: [{
      message: 'Function of the form "function(err, x) { if (err) return yo(err); yo(null, x) }" ' +
        'should be simplified to "yo"'
    }]
  }]
});
