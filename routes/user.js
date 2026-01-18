const express = require('express');
const  router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");

router.get("/signup" , (req , res) =>{
    res.render("users/signup.ejs");
});

router.post("/signup" , wrapAsync(async (req,res) =>{
    try{
        let {username , email , password} = req.body;
     const newuser = new User({email , username});
     const registeredUser =  await User.register(newuser , password); // User.register(new user , password ) are parameters used to send inside register method.
     req.flash("success" , "Welcome, You registered SuccesFully");
     res.redirect("/listings");
    }
    catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");  
    }
  
}));

router.get("/login" , (req , res) =>{
    res.render("users/login.ejs");
});

router.post(
    "/login",
    passport.authenticate("local",{ // passport.authenticate is a middleware which is used to authenticate the user.
        failureRedirect: "./login", // if suthentication fails we'll redirect to ./login only. 
        failureFlash : true // it will automatically genrate failure flash message. 
    }),
    async (req,res) =>{ 
        req.flash("success" , "Welcome Back!");
        res.redirect("/listings");
    }
);

module.exports = router;