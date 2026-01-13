const express = require('express');
const Listing = require('./models/listing.js');
const app = express();
const PORT = process.env.PORT || 7700;
const path = require('path');
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/projectdb';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const MyErrors = require('./utils/MyErrors.js');
const {listingSchema ,  reviewSchema } = require('./schema.js');
const Review = require('./models/review.js');

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
async function main() {
    await mongoose.connect(MONGO_URI);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));


// app.get('/testListing', async (req, res) => {
//     let sampleTesting = new Listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing.",
//         price: 100,
//         location: "Sample Location",
//         country: "Sample Country"
//     });

//     await sampleTesting.save();
//     console.log("Sample was saved");
//     res.send("successful testing");
// });

// Validation Middleware 
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
  next();
};

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
    if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
    next();
};


// Routes
// Index route for listings
app.get('/listings', wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { alllistings });
}));

// New route for listings
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});
// Create route for listings
app.post('/listings', validateListing , wrapAsync(async (req, res, next) => {
    // listingSchema.validate(req.body); // Validation moved to middleware defined above
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect('/listings');
}));

// Show route for listings
app.get('/listings/:id', wrapAsync(async (req, res) => {

    const { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    res.render('listings/show.ejs', { listing });
}));

// Edit route for listings
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));
// Update route for listings
app.put('/listings/:id', validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${listing.id}`);
}));

// Delete route for listings
app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// Post route for reviews
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => { 
    const { id } = req.params;
    const listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing.id}`);
}));

// Delete review route
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Remove reference from listing. 
    // pull operator is used to remove from an array all instances of a value or values that match a specified condition.
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));
 
// Error Handling Middle  eware
app.use((req, res, next) => {
    next(new MyErrors(404, "Page Not Found"));
});

// Generic Error Handler
app.use((err, req, res, next) => { // Error handling middleware, must have 4 parameters
    // Saare errors yahan handle ho jayenge
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render('error.ejs', { status, message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 