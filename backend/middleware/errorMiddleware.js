const { sendError } = require("../utils/response");

const errorHandler = (err, req, res, next) => {
  console.error("❌ Error:", err.stack);

  if (err.code === "ER_DUP_ENTRY") {
    return sendError(res, "A record with this data already exists.", 409);
  }

  if (err.name === "ValidationError") {
    return sendError(res, err.message, 422);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  sendError(res, message, statusCode);
};

const notFound = (req, res, next) => {
  sendError(res, `Route ${req.originalUrl} not found`, 404);
};

module.exports = { errorHandler, notFound };
