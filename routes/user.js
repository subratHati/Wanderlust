const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares.js");
const userController = require("../controllers/user.js");


router.route("/signup")
.get( userController.RenderSignupForm)   // signup form route
.post( wrapAsync(userController.signup));   // signup route

router.route("/login")
.get(userController.renderLoginForm)  // Login form route

// login post route
.post(saveRedirectUrl, passport.authenticate(  //passport.authenticate() is a middleware provided by passport package, which is automatically authenticate the user given credentials with the database.
"local", 
{failureRedirect:"/login",
 failureFlash:true}),
userController.login);


router.get("/logout", userController.logout);



module.exports = router;