const express = require('express');
const Listing = require('../models/listing.js');     
const  router = require('express').Router();
const wrapAsync = require('../utils/wrapAsync.js');
const MyErrors = require('../utils/MyErrors.js');
const {listingSchema ,  reviewSchema } = require('../schema.js');



// Validation Middleware 
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);   // ✅ validate req.body
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
    req.flash("success" , "New Listing Created");
    res.redirect('/listings');
}));

// Show route for listings
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if(!listing ){
        req.flash("error" , "Listing you requested for does not Exists!");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing });
}));

// Edit route for listings
router.get('/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing ){
        req.flash("error" , "Listing you requested for does not Exists!");
        return res.redirect("/listings");
    }
    res.render('listings/edit.ejs', { listing });
}));

// Update route for listings
router.put('/:id', validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    req.flash("success" , "Post Updated. ");
    res.redirect(`/listings/${listing.id}`);
}));

// Delete route for listings
router.delete('/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Post deleted"); // agar hum key ka same name rakhenge toh ab humko new flash msg banane ki zaroorat nahi h . jo route call hoga uske hisaab se flash call ho jayega.
    res.redirect('/listings');
}));


module.exports = router;