const express = require("express");
const {
  authenticateUser,
  authorizedPermissions,
} = require("../middleware/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
} = require("../controllers/userController");
const router = express.Router();
router
  .route("/")
  .get(authenticateUser, authorizedPermissions("admin", "boss"), getAllUsers);
router.route("/showMe").get(authenticateUser, showCurrentUser);
router.route("/updateUser").patch(authenticateUser, updateUser);
router.route("/updatePassword").patch(authenticateUser, updatePassword);
router.route("/:id").get(authenticateUser, getSingleUser);

module.exports = router;
