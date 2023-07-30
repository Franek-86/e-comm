require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const User = require("../models/User");

const { attachCookiesToResponse, createUserToken } = require("../utils");
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new customError.BadRequestError("missing email or password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new customError.UnauthenticatedError("there is no such user");
  }
  const match = await user.checkPassword(password);
  if (!match) {
    throw new customError.UnauthenticatedError("wrong password");
  }
  // const userToken = { name: user.name, id: user._id, role: user.role };
  const userToken = createUserToken(user);

  attachCookiesToResponse({ res, user: userToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};
const register = async (req, res) => {
  const { email, password, name } = req.body;

  let isFirst = await User.countDocuments({});

  let role = isFirst === 0 ? "admin" : "user";
  let check = await User.findOne({ email });
  if (check) {
    throw new customError.BadRequestError("questa mail sta gia'");
  }
  let user = await User.create({ name, email, password, role });
  const userToken = createUserToken(user);
  attachCookiesToResponse({ res, user: userToken });
  res.status(StatusCodes.CREATED).json({ user: userToken });
};
const logout = async (req, res) => {
  res.cookie("token", "remove", {
    httpOnly: true,
    expires: new Date(Date.now() + 5 * 1000),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = { login, register, logout };
