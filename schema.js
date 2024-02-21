// This is a schema validator. To get this we have to first install "joi" from npm.
// The main purpose of it is to validate our schema in server side.
// In simple meaning we set our validators in html to prevent any null input while creating a new listing by the user but after that
// anyone can set a null input using api call.So we have to handle this problem also from server side.So that we use "joi" to prevent this.

const joi = require("joi");

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description : joi.string().required(),
        price : joi.number().required().min(0),
        country : joi.string().required(),
        location : joi.string().required(),
        image : joi.string().allow("",null)
    }).required()
})


// This is a validator schema for reviews
module.exports.reviewSchema = joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required()

    }).required()
})