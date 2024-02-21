const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
    },
});

userSchema.plugin(passportLocalMongoose);   //we use this plugin because it add some additional features to our user schema.Like it will automatically created our username and password field.which are secured also.It also added some additional methods.To read in detail search "passport-Local-Mongoose" in npm website.

module.exports = mongoose.model("User", userSchema);