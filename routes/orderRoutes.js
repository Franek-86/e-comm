const {
  authenticateUser,
  authorizedPermissions,
} = require("../middleware/authentication");
const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require("../controllers/orderController");

router
  .route("/")
  .get(authorizedPermissions("admin"), getAllOrders)
  .post(createOrder);

router.route("/showAllMyOrders").get(getCurrentUserOrders);
router.route("/:id").get(getSingleOrder).patch(updateOrder);

module.exports = router;
