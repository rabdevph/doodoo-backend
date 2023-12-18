const logErrors = (err, req, res, next) => {
  const errMessage = process.env.NODE_ENV === 'production' ? null : err.stack;

  console.error(errMessage);
  next(err);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode).json({ message: err.message });
};

module.exports = { logErrors, errorHandler };
