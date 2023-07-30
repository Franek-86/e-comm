const customErrors = require("../errors");
const { verifyToken } = require("../utils/jwt");
const authenticateUser = (req, res, next) => {
  const token = req.signedCookies.token;
  if (token) {
    try {
      const userToken = verifyToken({ token });

      const { name, id: userId, role } = userToken;
      req.user = { name, userId, role };
      next();
    } catch (error) {
      throw new customErrors.UnauthenticatedError("not authenticated user");
    }
  } else {
    throw new customErrors.UnauthenticatedError("not authenticated user");
  }
};

const authorizedPermissions = (...rest) => {
  return (req, res, next) => {
    const userToken = req.user;

    if (rest.includes(userToken.role)) {
      next();
    } else {
      throw new customErrors.UnauthorizedError("nn e' admin");
    }
  };
};
module.exports = { authenticateUser, authorizedPermissions };
