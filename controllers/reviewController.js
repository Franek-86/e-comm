const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");

const Product = require("../models/Product");
const Review = require("../models/Review");
const { checkPermissions } = require("../utils");

const getAllReviews = async (req, res) => {
  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name price company ",
    })
    .populate({ path: "user", select: "name" });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const reviewId = req.params.id;
  const singleReview = await Review.findOne({ _id: reviewId });
  if (!singleReview) {
    throw new customError.NotFoundError(
      `there is no review with the id of ${reviewId}`
    );
  }
  res.status(StatusCodes.OK).json(singleReview);
};
const createReview = async (req, res) => {
  console.log(req.body);
  const productId = req.body.product;
  req.body.user = req.user.userId;
  const isValidProduct = await Product.findOne({ _id: productId });
  if (!isValidProduct) {
    throw new customError.BadRequestError(
      `there is no product with id of ${productId}`
    );
  }
  const checkIfUnique = await Review.findOne({
    product: productId,
    user: req.user.userId,
  });
  console.log(checkIfUnique);
  if (checkIfUnique) {
    throw new customError.BadRequestError(
      `use can only send one review per product`
    );
  }
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json(review);
};
const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review) {
    throw new customError.NotFoundError(
      `there is no review with id of ${req.params.id}`
    );
  }
  checkPermissions(req.user, req.params.id);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "review has been deleted" });
};
const updateReview = async (req, res) => {
  const { title, rating, comment } = req.body;
  const reviewId = req.params.id;
  let review = await Review.findOne({ _id: reviewId });
  if (!review) {
    throw new customError.NotFoundError(
      `there is no review with id of ${req.params.id}`
    );
  }

  checkPermissions(req.user, req.params.id);
  review.title = title;
  review.rating = rating;
  review.comment = comment;
  console.log(review);
  await review.save();
  res.status(StatusCodes.OK).json({ msg: "review has been updated" });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
module.exports = {
  getAllReviews,
  getSingleReview,
  createReview,
  deleteReview,
  updateReview,
  getSingleProductReviews,
};
