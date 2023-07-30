const Product = require("../models/Product");
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors/index");
const path = require("path");
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  if (products.length === 0) {
    throw new customError.NotFoundError("there are no products available");
  }
  res.status(StatusCodes.OK).json({ products, counts: products.length });
};
const getSingleProduct = async (req, res) => {
  console.log(req.params.id);
  const product = await Product.findOne({ _id: req.params.id }).populate(
    "reviews"
  );
  console.log(product);
  if (!product) {
    throw new customError.NotFoundError(
      `there is no product with id of ${req.params.id}`
    );
  }
  res.status(StatusCodes.OK).json(product);
};
const updateProduct = async (req, res) => {
  console.log(req.body);
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    { returnDocument: "after", runValidators: true }
  );
  res.status(StatusCodes.OK).json(product);
};
const createProduct = async (req, res) => {
  const user = req.user.userId;
  req.body.user = user;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json(product);
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product) {
    throw new customError.NotFoundError("there is no such product");
  }
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: "product removed" });
};
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new customError.NotFoundError("no file uploaded");
  }
  const file = req.files.test;
  const maxSize = 1024 * 1024;
  console.log(file);
  if (!file.mimetype.startsWith("image")) {
    throw new customError.NotFoundError("please upload an image");
  }
  if (file.size > maxSize) {
    throw new customError.NotFoundError(
      "please upload an image with smaller size"
    );
  }
  let testPath = path.join(__dirname, "../public/uploads/", file.name);
  console.log("aooo", testPath);
  file.mv(testPath, (err) => {
    if (err) {
      throw new customError.BadRequestError("something went wrong");
    }
    return res.json({ path: `/uploads/${file.name}` });
  });
};
module.exports = {
  getAllProducts,
  getSingleProduct,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadImage,
};
