const express = require('express');
const Listing = require('../models/listing.js'); 
const Review = require('../models/listing.js');     
const router = require('express').Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync.js');
const {listingSchema ,  reviewSchema } = require('../schema.js');
const {isloggedin, isOwner , validateListing , isAuthor} = require ("../middleware.js");

// Routes

// Index route for listings
router.get('/', wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { alllistings });
}));


// New route for listings
router.get('/new',isloggedin ,  (req, res) => { // isloggedin is passed as middleware to chech if perso is loged in or not.
    res.render('listings/ new.ejs');
});

// Create route for listings
router.post('/', isloggedin , validateListing , wrapAsync(async (req, res, next) => {
    // listingSchema.validate(req.body); // Validation moved to middleware defined above
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // use: when we create a listing then uske owner ki id leli h .
    await newListing.save();
    req.flash("success" , "New Listing Created");
    res.redirect('/listings');
}));

// Show route for listings
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: 'reviews',
        populate:{
            path :"author",
        }
    })
    .populate("owner");
    if(!listing ){
        req.flash("error" , "Listing you requested for does not Exists!");
        return res.redirect("/listings");
    }
    res.render('listings/show.ejs', { listing });
}));

// Edit route for listings
router.get('/:id/edit', isloggedin, isOwner , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing ){
        req.flash("error" , "Listing you requested for does not Exists!");
        return res.redirect("/listings");
    }
    res.render('listings/edit.ejs', { listing });
}));

// Update route for listings
router.put('/:id', isloggedin , isOwner ,validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    // create a middleware for this in middleware.js
    // let listing = Listing.findById(id); 
    // if(!listing.owner.equals(res.locals.currUser._id)){
    //     res.flash("error" , "you don't have excess");
    //     return res.redirect(`/listings/${listing.id}`);
    // }
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    req.flash("success" , "Post Updated. ");
    res.redirect(`/listings/${listing.id}`);
}));


// Delete route for listings
router.delete('/:id', isloggedin ,wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Post deleted"); // agar hum key ka same name rakhenge toh ab humko new flash msg banane ki zaroorat nahi h . jo route call hoga uske hisaab se flash call ho jayega.
    res.redirect('/listings');
}));


module.exports = router;
