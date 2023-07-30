const express = require("express");
const {
  getAllProducts,
  getSingleProduct,
  createProduct,
  deleteProduct,
  uploadImage,
  updateProduct,
} = require("../controllers/productController");
const { getSingleProductReviews } = require("../controllers/reviewController");
const {
  authorizedPermissions,
  authenticateUser,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post([authenticateUser, authorizedPermissions("admin")], createProduct);

router
  .route("/uploadImage")
  .post([authenticateUser, authorizedPermissions("admin")], uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .delete([authenticateUser, authorizedPermissions("admin")], deleteProduct)
  .patch([authenticateUser, authorizedPermissions("admin")], updateProduct);
router.route("/:id/reviews").get(getSingleProductReviews);
module.exports = router;
