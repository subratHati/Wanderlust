if(process.env.NODE_ENV !="production"){  //we set the if condition because we don't want to access this ".env" when our project is live on the internet.so we set a variable NODE_ENV="production" when our project is live,until that we can access our .env file.(NOTE:How to access our .env data after our project is live?We will discuss that later).
require('dotenv').config();  //to get variable value from ".env" file we have to install and require a package called "dotenv". And then we can access that variable data from a object called "process". Ex:console.log(process.env.SECRET);
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewares.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')  //we use multer package so that our server can accept multipart/form-data(which are basically any file or photo). 
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}); 
// const upload = multer({ dest: 'uploads/' })  //this line means we set our destination to "uploads" folder, so any file received by server will save into this folder(It is in our local system).But generally we don't use any folder to store our file instead we use any cloud storage.



// List Route
// router.get("/", wrapAsync(listingController.index));
  
  //Add new listing form Route
  router.get("/new",isLoggedIn, listingController.renderNewListingForm);
  
  // IMPORTANT NOTE:if some routes are looks similar to another route which contains a :id then the non :id containing route should place before the :id containing route. Otherwise the browser get confused while you request on non :id containing route. 
  
  //Show Route
  // router.get("/:id",wrapAsync(listingController.showListing));
  
  //Add new listing Route
  // router.post("/",isLoggedIn, validateListing, wrapAsync(listingController.createListing));
  
  // Edit listing form Route 
  router.get("/:id/edit",isOwner, isLoggedIn, wrapAsync(listingController.renderEditForm));
  
  // update Route 
  // router.put("/:id",isOwner, validateListing, wrapAsync(listingController.updateListing));
  
  //Delete Route
  // router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));
  // IMPORTANT NOTE: Never show the delete button if the user is not logged in .There is a bug in this button.

  // All the above are without router.route, and below we are going to implement with router.route(). where we combine all the different type request for same path.
  // Basically in router.router() method we combine all the requests which path are same but request type(get,put,post) different. 
  // IMPORTANT NOTE:Only in this page i am showing how we write code without router.route() and with router.route(), but in other page(user.js and review.js) i directly convert all the required routes into router.route() format. 
  router.route("/")
  .get(wrapAsync(listingController.index))
   .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));
  // upload.single() is a middleware that upload image in the cloudinary.
  

  router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


  module.exports = router;