const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


 module.exports.index = async(req, res)=>{
    const allList = await Listing.find();
    res.render("listings/index.ejs", {allList});
  }

  module.exports.showListing = async(req, res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner"); //If we don't use populate then only object_id of reviews are showing. But we want all to show the whole object of reviews.
   if(!listing){ //if listing doesn't exist then we show this flash error message.
      req.flash("error", "Listing you requested for doesn't exist!");
      res.redirect("/listing");
   }
   res.render("listings/show.ejs", {listing});
};

module.exports.renderNewListingForm = (req, res)=>{  //This "isLoggedIn" is a middleware to check the user is logged in or not.
    console.log(req.user);
    res.render("listings/new.ejs");
 
   
};

module.exports.createListing = async(req, res, next)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();

    let url = req.file.path; 
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing); //basically here we create a new Listing in a different way which is simpler than the previous one.Here we extract all data from our req body through a key "listing" which is defined in "new.ejs".
    newListing.owner = req.user._id;
    newListing.image = {url, filename}; //add image data.
    newListing.geometry = response.body.features[0].geometry;  //local coordinates add.
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing added successfully!");
    res.redirect("/listing");

};

module.exports.renderEditForm = async(req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
      req.flash("error", "Listing you requested for doesn't exist!");
      res.redirect("/listing");
    }
    console.log(listing.image);
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;

    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);


    if(req.file){  //Here we check that if the user upload the image or not.If yes then execute all the below code.(Because during update, image upload is not necessary) 
    let url = req.file.path; 
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    req.flash("success", "Listing updated!");
    res.redirect(`/listing/${id}`);
};

module.exports.deleteListing = async(req, res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listing");
 };