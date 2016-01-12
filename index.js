'use strict';

module.exports = {
  rules: {
    'collapse-trivial-function': require('./lib/collapse-trivial-function'),
    'lodash-arity': require('./lib/lodash-arity'),
    'provide-no-return-value': require('./lib/provide-no-return-value'),
    'lodash-use-object-predicate': require('./lib/lodash-use-object-predicate'),
    'lodash-map-predicate': require('./lib/lodash-map-predicate'),
    'lodash-use-pick': require('./lib/lodash-use-pick')
  },

  rulesConfig: {
    'collapse-trivial-function': 2,
    'lodash-arity': 2,
    'provide-no-return-value': 2,
    'lodash-use-object-predicate': 2,
    'lodash-map-predicate': 2,
    'lodash-use-pick': 2
  }
};
