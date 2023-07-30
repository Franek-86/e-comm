const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a name"],
      trim: true,
      maxLength: [15, "name can't be that long"],
    },
    price: {
      type: Number,
      required: [true, "please set a price"],
      default: 0,
    },
    description: {
      type: String,
      maxLength: [500, "description can't be that long"],
    },
    image: {
      type: String,
      required: [true, "please set a pic"],
      default: "/uploads/example.jpeg",
    },
    category: {
      type: String,
      required: [true, "please set a category"],
      enum: ["office", "kitchen", "bedroom"],
    },
    company: {
      type: String,
      enum: {
        values: ["ikea", "marcos", "liddy"],
        message: "this `{VALUE}` is not accepted",
      },
    },
    colors: {
      type: [String],
      default: ["#222"],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    freeShipping: {
      type: Boolean,
      required: [true, "please set if is free shipping"],
      default: false,
    },
    inventory: {
      type: Number,
      default: 15,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfRating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

productSchema.pre("remove", async function (next) {
  await this.model("Review").deleteMany({ product: this._id });
});

module.exports = mongoose.model("Product", productSchema);
