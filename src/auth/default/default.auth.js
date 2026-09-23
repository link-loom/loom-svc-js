/**
 * Example authentication handler: accepts `Authorization: Bearer <JWT>` signed
 * with `config.server.secret` and returns the token claims as the principal.
 *
 * Contract: `authenticate({ req, params, headers })` returns a Link Loom
 * response — `success(principal)` lets the request through and the route
 * handler receives `principal`; `error(message, { status })` rejects it.
 */
class DefaultAuthHandler {
  constructor(dependencies) {
    /* Base Properties */
    this._dependencies = dependencies;
    this._utilities = this._dependencies.utilities;
    this._console = this._dependencies.console;

    /* Custom Properties */
    this._jwt = this._dependencies.jwt;
    this._secret = this._dependencies.config?.server?.secret;
  }

  async authenticate({ headers }) {
    const authorization = headers?.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
      return this._utilities.io.response.error('Provide a bearer token', {
        status: 401,
      });
    }

    if (!this._secret) {
      return this._utilities.io.response.error(
        'Authentication is not configured',
        { status: 500 },
      );
    }

    try {
      const claims = this._jwt.verify(
        authorization.slice('Bearer '.length),
        this._secret,
      );

      return this._utilities.io.response.success({
        subject: claims.sub,
        claims,
      });
    } catch (error) {
      return this._utilities.io.response.error('Invalid or expired token', {
        status: 401,
      });
    }
  }
}

module.exports = DefaultAuthHandler;
