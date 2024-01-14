//This class takes ours custom messages call javascript builtIn error class to produce error with customize message
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "Fail" : "Error";
    this.message = message;
    this.success = false;
    this.Operational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
