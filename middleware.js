const Listing = require("./models/listing");
const MyErrors = require('./utils/MyErrors.js');
const { listingSchema, reviewSchema } = require('./schema.js');
const Review = require("./models/review.js");

module.exports.isloggedin = (req, res, next) => {
  if (!req.isAuthenticated()) { // this a method used to autheticate that the user is registed or not and if he's not hecan't excess further.
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};
// function name is isloggedin
// module.exports = isloggedin; // ye tab likhte jab hum ek function banate like : const isloggedin = (req , res , next)=>{ and if ese banate toh require mai humko { isloggedin } nahi likhna padta , direct kuch bhi naam de sakte thSe.

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl; // humne locals mai url link save karwa liya h , taki session reboot bhi hua signup k baad toh humara path nahi khoyega.
  }
  next();
};

// making a middleware named isOwner,used to check if post is of owner or not.
module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id); // await
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }
  //compare with logged in user
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You don't have access!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

// Validation Middleware 
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);   // ✅ validate req.body
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
  next();
};

// Validation Middleware for Reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
  next();
};


// making a middleware named isAuthor,used to check if post review is deleted by creator or not.
module.exports.isAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  //compare with logged in user
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have access to delete this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};