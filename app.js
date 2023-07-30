// #### Security Packages

// - [] express-rate-limiter
// - [] helmet
// - [] xss-clean
// - [] express-mongo-sanitize
// - [] cors (cookies!!!!)

require("dotenv").config();
require("express-async-errors");
const fileUpload = require("express-fileupload");
const express = require("express");
const app = express();
const connectDB = require("./db/connect");
const errorHandler = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const morgan = require("morgan");
const authRouter = require("./routes/authRoutes");
const usersRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const orderRouter = require("./routes/orderRoutes");
var cookieParser = require("cookie-parser");
const {
  authenticateUser,
  authorizedPermissions,
} = require("./middleware/authentication");

// security imports

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

const port = process.env.PORT || 8000;
app.set("trust proxy", 1);
const limiter = rateLimit({
  msLimit: 15 * 60 * 1000,
  max: 60,
});
// security
app.use(limiter);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(cookieParser(process.env.SECRET_KEY));
app.use(morgan("tiny"));
// -------------------------------------------------
// app.get("/", (req, res) => {
//   res.send("something");
// });

app.get("/api/v1", (req, res) => {
  console.log(req.signedCookies);
  res.send("salve");
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", usersRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", authenticateUser, orderRouter);
app.use(express.static("./public"));
app.use(notFound);
app.use(errorHandler);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
