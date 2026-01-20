// we'll store all listing route callbacks here

const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const alllistings = await Listing.find({});
    res.render('listings/index.ejs', { alllistings });
};

module.exports.NewlistingForm =  (req, res) => { // isloggedin is passed as middleware to chech if perso is loged in or not.
    res.render('listings/new.ejs');
};


module.exports.ShowListing =  async (req, res) => {
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
};

module.exports.createListing = async (req, res, next) => {
    // listingSchema.validate(req.body); // Validation moved to middleware defined above
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // use: when we create a listing then uske owner ki id leli h .
    await newListing.save();
    req.flash("success" , "New Listing Created");
    res.redirect('/listings');
};

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing ){
        req.flash("error" , "Listing you requested for does not Exists!");
        return res.redirect("/listings");
    }
    res.render('listings/edit.ejs', { listing });
};

module.exports.updatelisting = async (req, res) => {
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
};

module.exports.destroylisting = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Post deleted"); // agar hum key ka same name rakhenge toh ab humko new flash msg banane ki zaroorat nahi h . jo route call hoga uske hisaab se flash call ho jayega.
    res.redirect('/listings');
};