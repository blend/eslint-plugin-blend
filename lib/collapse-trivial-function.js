'use strict';

var _ = require('lodash');
var util = require('util');
var common = require('./common');

/**
 * Detects functions of the form "function(err, ret) { if (err) return cb(err); return cb(null, ret); }".
 */
module.exports = function(context) {
  return {
    FunctionExpression: function(node) {
      if (node.params.length !== 2 || _.isEmpty(node.body)) return;

      var errArgName = node.params[0].name;
      var secondArgName = node.params[1].name;

      if (_.isEmpty(node.body.body) || node.body.body.length !== 2) return;

      var firstStatementIsIfErrCalleeName = common.detectErrorForwarder(node.body.body[0], errArgName);
      var secondStatement = node.body.body[1];

      var secondStatementIsReturnRet = (function() {
        function isReturnCall(call) {
          if (call.type !== 'CallExpression') return false;

          var args = call.arguments;
          if (call.callee.name !== firstStatementIsIfErrCalleeName || args.length !== 2) return false;

          var arg0 = args[0];
          var arg1 = args[1];
          return arg0.type === 'Literal' && arg0.value === null &&
            arg1.type === 'Identifier' && arg1.name === secondArgName;
        }

        if (secondStatement.type === 'ExpressionStatement') {
          return isReturnCall(secondStatement.expression);
        } else if (secondStatement.type === 'ReturnStatement' && secondStatement.argument) {
          return isReturnCall(secondStatement.argument);
        }

        return false;
      })();

      if (firstStatementIsIfErrCalleeName && secondStatementIsReturnRet) {
        context.report(node, util.format(
          'Function of the form "function(err, x) { if (err) return %s(err); %s(null, x) }"' +
            ' should be simplified to "%s"',
          firstStatementIsIfErrCalleeName, firstStatementIsIfErrCalleeName, firstStatementIsIfErrCalleeName
        ));
      }
    }
  };
};
