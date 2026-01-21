const express = require('express');
const Listing = require('../models/listing.js');
const Review = require('../models/listing.js');
const router = require('express').Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const { isloggedin, isOwner, validateListing, isAuthor } = require("../middleware.js");
const listingController = require("../controllers/listing.js"); // hum ab conntrollers k listing.js ke andar se callbacks utha k yaha paas karenge.

if(process.env.NODE_ENV != "production"){ // means hamara project jab production phase mai jayega toh we'll not use dotenv.
    require("dotenv").config();
}

const multer = require('multer'); // a middleware used to make bck understand how multipart/form 
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

// Routes
// mergeing all "/" routes into 1 single route. with different different methods (get,post,...)
// Index route for listings
router.route("/")
    .get(wrapAsync(listingController.index)) // hum controllers k andar ka index function yaha call kar rahe hai. (we have shifted this callback into controllers to make file readable.)
    .post(isloggedin, validateListing, upload.single("listing[image]") , wrapAsync(listingController.createListing)
);

// New route for listings
router.get('/new', isloggedin, listingController.NewlistingForm); // hum controllers k andar ka index function yaha call kar rahe hai. (we have shifted this callback into controllers to make file readable.)

// Show route for listings
router.route('/:id')
    .get(wrapAsync(listingController.ShowListing))  // humne yaha jo callback banaya tha usko controllers k andar listing.js k andar ShowRoute function banake use kiya h yaha. 
    .put(isloggedin, isOwner, validateListing, wrapAsync(listingController.updatelisting)) // Update route for listings
    .delete(isloggedin, wrapAsync(listingController.destroylisting));// Delete route for listings

// Edit route for listings
router.get('/:id/edit', isloggedin, isOwner, wrapAsync(listingController.editForm));

module.exports = router;