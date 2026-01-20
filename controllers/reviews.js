// we'll store all review route callbacks here


const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.CreateReview =  async (req, res) => { 
    const { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created.");
    res.redirect(`/listings/${listing.id}`);
};

module.exports.DeleteReview =  async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  // pull operator is used to remove from an array all instances of a value or values that match a specified condition.
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};