'use strict';

var _ = require('lodash');
var util = require('util');
var common = require('./common');

/**
 * Detects functions of the form: function(err, ret) { if (err) return cb(err); return cb(); },
 * which can be replaced with langUtils.provide(cb).
 */
module.exports = function(context) {
  return {
    FunctionExpression: function(node) {
      if (_.isEmpty(node.params)) return;

      var errArgName = node.params[0].name;

      if (_.isEmpty(node.body.body) || node.body.body.length !== 2) return;

      var firstStatementIsIfErrCalleeName = common.detectErrorForwarder(node.body.body[0], errArgName);
      var secondStatement = node.body.body[1];

      var secondStatementIsReturnRet = (function() {
        function isReturnCall(call) {
          return call.type === 'CallExpression' &&
            call.callee.name === firstStatementIsIfErrCalleeName &&
            _.isEmpty(call.arguments);
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
          'Function of the form "function(err, x) { if (err) return %s(err); %s(); }"' +
            ' should be simplified to "langUtils.provide(%s)".',
          firstStatementIsIfErrCalleeName, firstStatementIsIfErrCalleeName, firstStatementIsIfErrCalleeName
        ));
      }
    }
  };
};
