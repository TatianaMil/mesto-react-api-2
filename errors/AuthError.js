class AuthError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AuthError;
