class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ConflictError;
