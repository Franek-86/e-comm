require("dotenv").config();
var jwt = require("jsonwebtoken");
const createToken = ({ payload }) => {
  var token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: process.env.LIFE_TIME,
  });
  return token;
};
const verifyToken = ({ token }) => {
  const test = jwt.verify(token, process.env.SECRET_KEY);
  return test;
};

const attachCookiesToResponse = ({ res, user }) => {
  var token = createToken({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  const date = new Date(Date.now() + oneDay);
  res.cookie("token", token, {
    httpOnly: true,
    expires: date,
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
module.exports = { createToken, verifyToken, attachCookiesToResponse };
