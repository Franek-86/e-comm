const customError = require("../errors");

const checkPermissions = (requestingUser, requestedId) => {
  // console.log("first", requestingUser);
  // console.log("second", requestedId);
  // console.log(typeof requestedId);
  if (requestingUser.role === "admin") return;
  if (requestingUser.userId === requestedId.toString()) return;
  throw new customError.UnauthorizedError("not authorized to view this");
};

module.exports = checkPermissions;
