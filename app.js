const express = require('express');
const app = express();
const PORT = process.env.PORT || 7700;
const path = require('path');
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/projectdb';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const MyErrors = require('./utils/MyErrors.js');
const session = require("express-session");
const flash = require('connect-flash');

const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');


app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const sessionOptions = {
    secret:"mysafekey",
    resave: false,
    saveUninitialized : true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // this time is in miliseconds.
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, // to prevent cross scripting attacts.
    }
}; 
app.use(session(sessionOptions));
app.use(flash()); // we have to use flash before routes bcoz hum unko routes mai use karte hai.

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();// if next nahi lagaya toh yahi stuck reh jayega.
});

// MongoDB Connection
async function main() {
    await mongoose.connect(MONGO_URI);
}

main().then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


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

// Use listing routes
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

// Error Handling Middleware
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
