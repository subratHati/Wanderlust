const express = require("express");
const router = express.Router({mergeParams:true});  //express routers are a way to organise express application such that our primary app.js file doesn't become bloated.It is not compulsary but its a good practice to do.
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middlewares.js");
const { postReview, deleteReview } = require("../controllers/review.js");
const reviewController = require("../controllers/review.js");



// Review post route 
router.post("/", validateReview, wrapAsync(reviewController.postReview));

// review delete Router 
router.delete("/:reviewId",isAuthor, reviewController.deleteReview);

module.exports = router;