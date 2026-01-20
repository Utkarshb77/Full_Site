const express = require('express');
const Listing = require('../models/listing.js');     
const router = express.Router({ mergeParams: true }); // mergeParams: true means to access :id from parent router
const wrapAsync = require('../utils/wrapAsync.js');
const MyErrors = require('../utils/MyErrors.js');
const Review = require('../models/review.js');
const {validateReview, isloggedin, isAuthor} = require("../middleware.js");

const reviewConntroller = require("../controllers/reviews.js");

// listings/:id/reviews no need to write this full path here because in app.js we have already used '/listings' as a prefix for this router

// Post route for reviews
router.post('/', isloggedin , validateReview, wrapAsync(reviewConntroller.CreateReview)); // humne yaha jo callback banaya tha usko controllers k andar review.js k andar CreateReview function banake use kiya h yaha. 

// Delete review route
router.delete("/:reviewId", isloggedin, isAuthor, wrapAsync(reviewConntroller.DeleteReview)); // DeleteReview naam ka function bana diya h iside conntrollers/reviews.js and using it here.

module.exports = router; 