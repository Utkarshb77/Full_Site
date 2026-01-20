const express = require('express');
const Listing = require('../models/listing.js');     
const router = express.Router({ mergeParams: true }); // mergeParams: true means to access :id from parent router
const wrapAsync = require('../utils/wrapAsync.js');
const MyErrors = require('../utils/MyErrors.js');
const Review = require('../models/review.js');
const {validateReview, isloggedin, isAuthor} = require("../middleware.js");

// listings/:id/reviews no need to write this full path here because in app.js we have already used '/listings' as a prefix for this router
// Post route for reviews
router.post('/', isloggedin , validateReview, wrapAsync(async (req, res) => { 
    const { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "New Review Created.");
    res.redirect(`/listings/${listing.id}`);
}));

// Delete review route
// router.delete('/:reviewId', isloggedin , isAuthor , wrapAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//   await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });// Remove reference from listing. 
//     // pull operator is used to remove from an array all instances of a value or values that match a specified condition.
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success" , "Review Deleted ");
//     res.redirect(`/listings/${id}`);
// }));


router.delete("/:reviewId", isloggedin, isAuthor, wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
}));

module.exports = router; 