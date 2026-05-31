const { sendError } = require("../utils/response");

const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, "Unauthorized.", 401);
    }
    if (!roles.includes(req.user.role)) {
      return sendError(res, `Access forbidden. Required role: ${roles.join(" or ")}.`, 403);
    }
    next();
  };
};

module.exports = roleMiddleware;
