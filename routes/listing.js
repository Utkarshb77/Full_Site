const express = require('express');
const Listing = require('../models/listing.js'); 
const Review = require('../models/listing.js');     
const router = require('express').Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema ,  reviewSchema } = require('../schema.js');
const {isloggedin, isOwner , validateListing , isAuthor} = require ("../middleware.js");

const listingController = require("../controllers/listing.js"); // hum ab conntrollers k listing.js ke andar se callbacks utha k yaha paas karenge.

// Routes

// Index route for listings
router.get('/', wrapAsync(listingController.index)); // hum controllers k andar ka index function yaha call kar rahe hai. (we have shifted this callback into controllers to make file readable.)

// New route for listings
router.get('/new',isloggedin , listingController.NewlistingForm);

// Create route for listings
router.post('/', isloggedin , validateListing , wrapAsync(listingController.createListing));

// Show route for listings
router.get('/:id', wrapAsync(listingController.ShowListing)); // humne yaha jo callback banaya tha usko controllers k andar listing.js k andar ShowRoute function banake use kiya h yaha. 

// Edit route for listings
router.get('/:id/edit', isloggedin, isOwner , wrapAsync(listingController.editForm));

// Update route for listings
router.put('/:id', isloggedin , isOwner ,validateListing , wrapAsync(listingController.updatelisting));


// Delete route for listings
router.delete('/:id', isloggedin ,wrapAsync(listingController.destroylisting));


module.exports = router;
