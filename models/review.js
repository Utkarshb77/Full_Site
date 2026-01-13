const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
    type: String
    },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    },
    created_At: {
    type: Date,
    default: Date.now, 
    }
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
// This is the review model. and everylisting can have multiple reviews, means 1 to many relationship.