const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
 



// Validate middleware for listingSchema
module.exports.validateListing = (req, res, next)=>{
    let {error} = listingSchema.validate(req.body);

    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=>el.message).join(",");  //This line is written because when there is multiple error msg comes then it will organise all messages and show them all in a row separated by comma(,).
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

// validate middleware for reviewSchema
module.exports.validateReview = (req, res, next)=>{
    let {error} = reviewSchema.validate(req.body);

    if(error){
        console.log(error);
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}




module.exports.isLoggedIn = (req, res, next) => {
    req.session.redirectPath = req.originalUrl;
    console.log(req.session.redirectPath);
    if (!req.isAuthenticated()) {   //The isAuthenticated() method checks that the user is logged in for the current session or not.This method is also provided by passport.
        req.flash("error", "You must be logged in first!");
        res.redirect("/login");
    }
    next();

}

// when we wand to access a route without login and we have to login to access that route then our logic automatically redirect us to login page but after login we want our user to redirect the page for which he/she want to login.So this moddleware will help to do that.
// Basically this middleware assign the page url(to which the user want to go) from session to locals because after authentication our session data will delete.so we also call this middleware before authentication function call in : user.js post login route. 
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectPath) {  //this if condition is optional. we can directly assign our session data to locals.
        res.locals.redirectPath = req.session.redirectPath;
    }
    next();
}

 module.exports.isOwner = async(req, res, next)=>{
      let { id } = req.params;
      let currListing = await Listing.findById(id);
      if (res.locals.currUser && !currListing.owner._id.equals(res.locals.currUser._id)) {
          req.flash("error", "Only owner can modify this property!");
          return res.redirect(`/listing/${id}`);
      }

     next();
 }


 module.exports.isAuthor = async(req, res, next)=>{
    let {id, reviewId } = req.params;
    let currReview = await Review.findById(reviewId);
    if (res.locals.currUser && !currReview.author._id.equals(res.locals.currUser._id)) {
        req.flash("error", "Only owner can delete the review!");
        return res.redirect(`/listing/${id}`);
    }

   next();
}
