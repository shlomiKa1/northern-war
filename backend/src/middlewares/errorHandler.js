export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;
  const error = err.message || err || "Internal Server Error";
  return res.status(status).send(error);
}
