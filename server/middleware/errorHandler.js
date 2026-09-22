/**
 * Custom error class for expected, "operational" failures (bad input,
 * not found, unauthorized, upstream AI failure, etc.) so controllers
 * can `throw new AppError('message', 404)` and let this middleware
 * translate it into a clean JSON response.
 */
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  console.error('❌', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((v) => v.message).join(', ');
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with that ${field} already exists`;
  }

  // Never leak internal/stack details for unexpected (non-operational) errors
  if (!err.isOperational && process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Something went wrong on our end. Please try again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = { AppError, errorHandler, notFound, asyncHandler };
