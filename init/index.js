const mongoose = require("mongoose");
const initData = require("./data.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const Listing = require("../models/listing.js");


main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB =async()=>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:"65c32921189a7cc16799ce44"})); //add owner property.
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}


 initDB();