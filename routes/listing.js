const express = require('express');
const Listing = require('../models/listing.js');     
const  router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync.js');
const MyErrors = require('../utils/MyErrors.js');
const {listingSchema ,  reviewSchema } = require('../schema.js');



// Validation Middleware 
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
  next();
};


// Routes

// Index route for listings
router.get('/', wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { alllistings });
}));



// New route for listings
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Create route for listings
router.post('/', validateListing , wrapAsync(async (req, res, next) => {
    // listingSchema.validate(req.body); // Validation moved to middleware defined above
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect('/listings');
}));

// Show route for listings
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    res.render('listings/show.ejs', { listing });
}));

// Edit route for listings
router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

// Update route for listings
router.put('/:id', validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${listing.id}`);
}));

// Delete route for listings
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));


module.exports = router;