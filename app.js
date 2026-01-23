if(process.env.NODE_ENV != "production"){ // means hamara project jab production phase mai jayega toh we'll not use dotenv.
    require("dotenv").config();
}

const express = require('express');
const app = express();
const PORT = process.env.PORT || 7700;
const path = require('path');
const mongoose = require('mongoose');

// const MONGO_URI = 'mongodb://localhost:27017/projectdb';
const dburl = process.env.ATLASDB_URL;

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const MyErrors = require('./utils/MyErrors.js');

const session = require("express-session");
const MongoStore = require("connect-mongo").default;


const flash = require('connect-flash');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require("./routes/user.js");

app.engine('ejs', ejsMate);
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
 
const store = MongoStore.create({
  mongoUrl: dburl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,  // it is the interval between session updates
});


store.on("error" , ()=>{ // if koi error aa jata h toh it will be visible here.
    console.log("Error in Mongo Session Store" , err);
})

const sessionOptions = {
    store : store, 
    secret:process.env.SECRET,
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
// passport session ko use karte h toh there should be session implemented.
app.use(passport.initialize()); // compulsory line
app.use(passport.session());  // we use this taaki har request ko pata ho ki ye konse session ka part h or hum usse firse login naa karwaye.
passport.use(new LocalStrategy(User.authenticate())); // Authenticate fucntion is used in Passport's local Strategy.

passport.serializeUser(User.serializeUser()); // to serialize a session (means user se related information session mai store karwate h means serialize a User).
passport.deserializeUser(User.deserializeUser()); // to deserialize a session (means user se related information session se hatate hai means deserialize a User).



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; // humne user store karwaliya h inside currUser.
  next();// if next nahi lagaya toh yahi stuck reh jayega.
});

// MongoDB Connection
async function main() {
    await mongoose.connect(dburl);
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
app.use('/listings', listingRouter);
app.use('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);

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
