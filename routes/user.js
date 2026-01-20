const express = require('express');
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/user.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", saveRedirectUrl , wrapAsync(userController.signup)); //humne yaha jo callback banaya tha usko controllers k andar user.js k andar signup function banake use kiya h yaha. 

router.get("/login", userController.loginform); //humne yaha jo callback banaya tha usko controllers k andar user.js k andar loginform function banake use kiya h yaha. 

router.post(
    "/login",
    saveRedirectUrl ,
    passport.authenticate("local", { // passport.authenticate is a middleware which is used to authenticate the user.
        failureRedirect: "/login", // if suthentication fails we'll redirect to ./login only. 
        failureFlash: true // it will automatically genrate failure flash message. 
    }),
    userController.login);

router.get("/logout", userController.logout);

module.exports = router;