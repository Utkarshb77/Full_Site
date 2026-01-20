// // we'll store all user route callbacks here

const User = require("../models/user")

module.exports.signup = async (req, res , next) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ email, username });
        const registeredUser = await User.register(newuser, password); // User.register(new user , password ) are parameters used to send inside register method.
        req.login( registeredUser , (err) => { // this will automatically login after the signUp.
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome, You registered SuccesFully");
            const redirectedUrl = res.locals.redirectUrl || "/listings"; // Post-login page is saved inside middleware.js (bck:51 video:5)
            delete req.session.redirectUrl;
            res.redirect(redirectedUrl);
        })
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.loginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome Back!");
        const redirectedUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectedUrl);
};

module.exports.logout =  (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    })
};