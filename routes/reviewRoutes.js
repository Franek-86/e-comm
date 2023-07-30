const {
  getAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authentication");
const express = require("express");
const Router = express.Router();

Router.route("/").get(getAllReviews).post(authenticateUser, createReview);
Router.route("/:id")
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);
module.exports = Router;
