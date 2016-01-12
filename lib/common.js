'use strict';

var _ = require('lodash');

/**
 * @returns the name of the callback function it is forwarding to, or
 *   null if it is not an error forwarder.
 */
function detectErrorForwarder(stmt, errArgName) {
  var isIfErr = stmt.type === 'IfStatement' &&
        stmt.test.type === 'Identifier' &&
        stmt.test.name === errArgName;

  if (isIfErr && stmt.consequent) {
    var detectReturnCbErr = function(node) {
      if (node.type === 'ReturnStatement' && node.argument) {
        var arg = node.argument;
        if (arg.type === 'CallExpression' &&
            !_.isEmpty(arg.arguments) &&
            arg.arguments[0].name === errArgName) {
          return arg.callee.name;
        }
      }
      return null;
    };

    var consequent = stmt.consequent;
    if (consequent.type === 'BlockStatement') {
      return consequent.body && consequent.body.length === 1 && detectReturnCbErr(consequent.body[0]);
    } else if (consequent.type === 'ReturnStatement') {
      return detectReturnCbErr(consequent);
    }
  }

  return null;
}

module.exports = {
  detectErrorForwarder: detectErrorForwarder
};
