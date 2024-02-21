const Listing = require("../models/listing");
const Review = require("../models/review");



module.exports.postReview = async(req, res)=>{
    if(!res.locals.currUser){
        console.log(req.originalUrl);
        req.flash("error", "Please login to post review");
       return res.redirect("/login");
    }
    let listing =await Listing.findById(req.params.id); //Here we get our listing, inside which our review is going to add.
    let newReview =new Review(req.body.review);  //here we create our new review.
    newReview.author = res.locals.currUser._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review added!");
    console.log("New Review saved!");
    res.redirect(`/listing/${listing._id}`);
};


module.exports.deleteReview = async(req, res)=>{
    if(!res.locals.currUser){
        console.log(req.originalUrl);
        req.flash("error", "Please login to delete review");
       return res.redirect("/login");
    }
    let {id, reviewId} = req.params;
    let currReview =await Review.findById(reviewId);
    console.log(currReview);
    if(res.locals.currUser && !(res.locals.currUser._id.equals(currReview.author._id))){
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listing/${id}`);
    }
   await Listing.findByIdAndUpdate(id, {$pull: {reviews:reviewId}});  //here pull is a operator that delete value(in this case review id) from object(in this case reviews).
   await Review.findByIdAndDelete(reviewId);
   req.flash("success", "Review deleted!");
   res.redirect(`/listing/${id}`);
};