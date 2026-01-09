const express = require('express');
const Listing = require('./models/listing.js');
const app = express();
const PORT = process.env.PORT || 7700;
const path = require('path');
const mongoose = require('mongoose');
const MONGO_URI = 'mongodb://localhost:27017/projectdb';
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

async function main() {
    await mongoose.connect(MONGO_URI);
}

main().then(() =>{
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

// Routes

app.get('/listings', async (req, res) => {
    try {
        const alllistings = await Listing.find({});
        res.render('listings/index.ejs', { alllistings });
    } catch (err) {
        res.status(500).send('Server Error');
    }   
});

app.get('/listings/new' , (req, res) => {
    res.render('listings/new.ejs');
});

app.post('/listings' , async (req, res) => {
    try {
        const newListing = new Listing(req.body);
        console.log(newListing);
        await newListing.save();
        res.redirect('/listings');
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

app.get('/listings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).send('Listing not found');
        }
        res.render('listings/show.ejs', { listing });
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});
 
app.get('/listings/:id/edit', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render('listings/edit.ejs', { listing });
});

app.put('/listings/:id', async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body, { runValidators: true });
    res.redirect(`/listings/${listing.id}`);
});

app.delete('/listings/:id', async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});