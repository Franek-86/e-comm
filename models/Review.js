const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "a rate is required "],
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      trim: true,
      required: [true, "a title is required "],
      maxLength: 100,
    },
    comment: {
      type: String,
      trim: true,
      required: [true, "a title is required "],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.post("save", async function () {
  await this.constructor.calculateRatingAverage(this.product);
});
ReviewSchema.post("remove", async function () {
  await this.constructor.calculateRatingAverage(this.product);
});

ReviewSchema.statics.calculateRatingAverage = async function (id) {
  const result = await this.aggregate([
    {
      $match: {
        product: id,
      },
    },
    {
      $group: {
        _id: null,
        averageRating: {
          $avg: "$rating",
        },
        numOfRating: {
          $sum: 1,
        },
      },
    },
  ]);
  console.log("result", result);
  try {
    await this.model("Product").findOneAndUpdate(
      { _id: id },
      {
        averageRating: Math.ceil(result[0]?.averageRating || 0),
        numOfRating: result[0]?.numOfRating || 0,
      }
    );
  } catch (err) {
    console.log(err);
  }
};
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });
module.exports = mongoose.model("Review", ReviewSchema);
