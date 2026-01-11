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
const {listingSchema} = require('./schema.js');

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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



const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(", ");
    throw new MyErrors(400, msg);
  }
  next();
};

// Routes

app.get('/listings', wrapAsync(async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { alllistings });
}));

app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

app.post('/listings', validateListing , wrapAsync(async (req, res, next) => {
    // listingSchema.validate(req.body); // Validation moved to middleware defined above
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect('/listings');
}));

app.get('/listings/:id', wrapAsync(async (req, res) => {

    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        return res.status(404).send('Listing not found');
    }
    res.render('listings/show.ejs', { listing });
}));

app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
}));

app.put('/listings/:id', validateListing , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    res.redirect(`/listings/${listing.id}`);
}));

app.delete('/listings/:id', wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

app.use((req, res, next) => {
    next(new MyErrors(404, "Page Not Found"));
});

app.use((err, req, res, next) => { // Error handling middleware, must have 4 parameters
    // Saare errors yahan handle ho jayenge
    let { status = 500, message = "Something Went Wrong" } = err;
    res.status(status).render('error.ejs', { status, message });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});