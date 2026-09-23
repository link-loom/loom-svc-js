/**
 * Authentication handlers of this service (optional).
 *
 * A route picks one with `auth: '<name>'` in its route config; `auth: 'public'`
 * (or no `auth`) leaves it open. The legacy `protected` flag keeps working.
 * A route that names a handler not listed here answers 500 instead of running open.
 */
module.exports = {
  default: require('./default/default.auth'),
};
