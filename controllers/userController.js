require("dotenv").config();
const { StatusCodes } = require("http-status-codes");
const customError = require("../errors");
const User = require("../models/user");
const {
  attachCookiesToResponse,
  createUserToken,
  checkPermissions,
} = require("../utils");

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");

  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  checkPermissions(req.user, user._id);
  if (!user) {
    throw new customError.NotFoundError(
      `there is no user with id of ${req.params.id} `
    );
  }

  // res.json(user);
  res.status(StatusCodes.OK).json(user);
};
const showCurrentUser = async (req, res) => {
  const user = req.user;
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    throw new customError.BadRequestError("type both email and name");
  }

  const { userId } = req.user;

  // -------
  const user = await User.findOne({ _id: userId });
  user.name = name;
  user.email = email;
  user.save();
  const userToken = createUserToken(user);
  attachCookiesToResponse({ res, user: userToken });
  res.status(StatusCodes.OK).json({ user: userToken });
};
const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new customError.BadRequestError(
      "missing either new or old password or both"
    );
  }

  let user = await User.findOne({ _id: req.user.userId });
  const checkMatching = await user.checkPassword(oldPassword);

  if (!checkMatching) {
    throw new customError.UnauthenticatedError("passwords are not matching");
  }
  user.password = newPassword;
  // await User.findOneAndUpdate(
  //   { _id: req.user.userId },
  //   { password: newPassword }
  // );
  await user.save();

  res.json(user);
};
// const updateUser = async (req, res) => {
//   const { name, email } = req.body;
//   if (!name || !email) {
//     throw new customError.BadRequestError("type both email and name");
//   }

//   const { userId } = req.user;

//   res.status(StatusCodes.OK).json({ user: userToken });
//   const user = await User.findByIdAndUpdate(
//     { _id: userId },
//     { name, email },
//     {
//       returnDocument: "after",
//       // new: true,
//       runValidators: true,
//     }
//   );
//   const userToken = createUserToken(user);
//   attachCookiesToResponse({ res, user: userToken });
//   res.status(StatusCodes.OK).json({ user: userToken });
// };
module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updatePassword,
};
