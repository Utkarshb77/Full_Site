const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", saveRedirectUrl , wrapAsync(async (req, res , next) => {
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
}));

router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

router.post(
    "/login",
    saveRedirectUrl ,
    passport.authenticate("local", { // passport.authenticate is a middleware which is used to authenticate the user.
        failureRedirect: "/login", // if suthentication fails we'll redirect to ./login only. 
        failureFlash: true // it will automatically genrate failure flash message. 
    }),
    async (req, res) => {
        req.flash("success", "Welcome Back!");
        const redirectedUrl = res.locals.redirectUrl || "/listings";
        delete req.session.redirectUrl;
        res.redirect(redirectedUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You are logged out now.");
        res.redirect("/listings");
    })
});
module.exports = router;