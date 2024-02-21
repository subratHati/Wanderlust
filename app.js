require('dotenv').config();
const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust" //when we use our local storage we use like this but when we use cloude storage, that process is diff.
const dburl = process.env.ATLASDB_URL;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const MongoStore = require('connect-mongo'); //express-session only work for local environment. If we want to deploy our website on internet(live) we neet a cloud session.so connect-mongo is a cloud based session store.we have to install it first from npm. 
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


const store = MongoStore.create({
    mongoUrl:dburl,
    crypto: {
        secret: process.env.SECRET, 
      },
      touchAfter:24 * 3600,
});

store.on("err", ()=>{ //If any error occur on mongo session store.
    console.log("ERROR ON MONGO SESSION STORE", err);
})

const sessionOption = {
     store,   //this line is similar to store:store,(the second store is our object created above).And we add this line because we created a session store in cloud and we want this to pass to our session.
     secret :process.env.SECRET,
     resave:false,
     saveUninitialized:true,
     cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,   //here we set the expiry date of the cookie in milisecond format.(we set 7 days here)
        maxAge:  7 * 24 * 60 * 60 * 1000,  //here we set the max age. i.e also 7 days(in mili second format).
        httpOnly: true,  //This line is for security purpose. (new we don't know its meaning) 
     },
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



main()
    .then(() => {
        console.log("Database connected");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(dburl);
}

// Root route
// app.get("/", (req, res) => {
//     res.send("Hii.. I am root");
// });

app.use(session(sessionOption));
app.use(flash());

// we write passport code after session middleware because we want session in our user.
app.use(passport.initialize()); //we write the middleware because we want our passport initialized when it creates.(Complete detail i also don't know)
app.use(passport.session());  //To connect passport with session.
passport.use(new LocalStrategy(User.authenticate())); //It means every user created by LocalStrategy must be go throuth this authenticate process.
passport.serializeUser(User.serializeUser());  //This serialize and deserialize is used because we want to serialize a user when a session start and decerialize when the session end.
passport.deserializeUser(User.deserializeUser());
// NOTE: we can also write passport portion code from scratch.Infact before when passport package was not introduced people use to write all the authenticate, serialize and decerialize logic on their own, but passport package made it easy. 


app.use((req,res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


app.get("/demoUser", async(req, res)=>{
    let fakeUser = new User({
        email:"delta99@gmail.com",
        username:"delta-student",
    });
    let registeredUser = await User.register(fakeUser, "fakeuser@11");   //register() is a static method give by passport-local-mongoose to save the user to Database.this methog takes 3 parametrs: 1.user object, 2.password, 3.if any callback we want.NOTE:It automatically check whether the username is unique or not.
    res.send(registeredUser);
});


// This is a middleware. And every time our server get a request on "/listing", this middleware send the request to "listingRouter" which is require from router folder.And in this folder all our "/listing" routes are present.
// We did this restructure because to organise things.
app.get("/", (req, res)=>{
    res.redirect("/listing");
})
app.use("/listing", listingRouter);

// This is a middleware. And every time our server get a request on "/listing/:id/reviews", this middleware send the request to "reviewsRouter" which is require from router folder.And in this folder all our "/listing" routes are present.
app.use("/listing/:id/reviews",reviewsRouter);
// NOTE: When we send request from parent router to child router, the request parameters are not being received by the child route. So we to do that we have to pass "mergeParams:true" in express.Route(); 

app.use("/", userRouter);
// This is a middleware. And every time our server get a request on "/", (for user) this middleware send the request to "userRouter" which is require from router folder.And in this folder all our "/" routes are present. NOTE:Don't confuse this ("/") with root ("/"), if we request on "/" root route will trigger because we mwntion it above this route.This is for dealing with our user related request.  

// if any of the above route not match with a server request then this route accept the request and throw error "Page not found"
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found!"));
})

// Custom error handler
app.use((err, req, res, next)=>{
    let {statusCode=500, message="Something went wrong!"} = err;
    // res.status(statusCode).send(message);
    res.render("error.ejs", {message});
})

app.listen(port, () => {
    console.log(`Server is listening to port 8080`);
});

// IMPORTANT NOTE:Before deploying our project to render.com we have to set our "engine" in package.json and mention their our node version(To stay error free).We have to add this code explicitly, our machine doesn't add this automatically.But just remember we have to add this just before uploading our project on render.com.
// Because if we add this early then may be our node version change before our project finish.(to check node version run: "node -v" on terminal).