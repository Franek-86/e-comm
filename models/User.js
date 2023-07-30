const mongoose = require("mongoose");
const validator = require("validator");
var bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minLength: 3,
    maxLength: 8,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    // unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre("save", async function () {
  // console.log(this.modifiedPaths());
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSaltSync(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
});

userSchema.methods.checkPassword = async function (comparison) {
  const isMatching = await bcrypt.compare(comparison, this.password);

  return isMatching;
};

module.exports = mongoose.model("User", userSchema);
