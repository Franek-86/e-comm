const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");

const Product = require("../models/Product");
const Order = require("../models/Order");
const { checkPermissions } = require("../utils");

// #### Get All Orders and Get Single Order

// - [] getAllOrders - admin only
// - [] getSingleOrder - chechPermissions

// #### Get Current User Orders

// - [] find orders where user is equal to req.user.userId

// #### Update Order

// - [] get order id
// - [] get paymentIntentId (req.body)
// - [] get order
// - [] if does not exist - 404
// - [] check permissions
// - [] set paymentIntentId and status as 'paid'
// - [] order.save()

const getAllOrders = async (req, res) => {
  const allOrders = await Order.find({});
  if (allOrders.length < 0) {
    throw new customError.BadRequestError("no orders yet");
  }
  res.status(StatusCodes.OK).json(allOrders);
};
const getSingleOrder = async (req, res) => {
  const singleOrder = await Order.findOne({ _id: req.params.id });
  if (!singleOrder) {
    throw new customError.NotFoundError(req.params.id);
  }

  // if (req.user.id !== singleOrder.user) {
  //   throw new customError.UnauthorizedError(`not authorized to see this order`);
  // }
  checkPermissions(req.user, singleOrder.user);
  res.status(StatusCodes.OK).json(singleOrder);
};
const getCurrentUserOrders = async (req, res) => {
  console.log(req.user.userId);
  const currentUserOrders = await Order.find({ user: req.user.userId });
  if (currentUserOrders.length === 0) {
    throw new customError.NotFoundError("there are no orders for you to show");
  }
  res.status(StatusCodes.OK).json(currentUserOrders);
};
const fakeStripeFunction = (amount, currency) => {
  const clientSecret = "thisIsTheSecret";
  return { amount, clientSecret };
};
const createOrder = async (req, res) => {
  console.log(req.body);
  const { items: cartItems, tax, shippingFee } = req.body;
  let orderItems = [];
  let subtotal = 0;
  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct || dbProduct.length < 0) {
      throw new customError.BadRequestError("there is no product with such id");
    }
    if (!tax || !shippingFee) {
      throw new customError.BadRequestError("missing tax or shipping fee");
    }
    const { name, price, _id, image } = dbProduct;
    console.log(price, image, _id);
    subtotal += dbProduct.price * item.amount;
    const newItem = {
      name,
      image,
      price,
      amount: item.amount,
      product: _id,
      image,
    };
    orderItems = [...orderItems, newItem];
  }
  const total = subtotal + tax + shippingFee;
  const secret = fakeStripeFunction(total, "used");
  const order = await Order.create({
    orderItems,
    subtotal,
    tax,
    shippingFee,
    total,
    clientSecret: secret.clientSecret,
    user: req.user.userId,
  });
  res.status(StatusCodes.CREATED).json(order);
};

const updateOrder = async (req, res) => {
  console.log(req.params.id);

  const orderToUpdate = await Order.findOne({ _id: req.params.id });

  if (!orderToUpdate) {
    throw new customError.NotFoundError("not found");
  }
  orderToUpdate.paymentIntentId = "someRandomId";
  orderToUpdate.status = "paid";
  orderToUpdate.save();

  checkPermissions(req.user, orderToUpdate.user);
  res.status(StatusCodes.OK).json(orderToUpdate);
};
module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
