const User = require("../models/user");

module.exports.RenderSignupForm = (req, res)=>{
    res.render("users/signup.ejs");
    };

    module.exports.signup = async(req, res)=>{
        try{
            let {username, email, password} = req.body;
            let newUser = new User({
                username:username,
                email:email,
            });
        
            let registeredUser = await User.register(newUser, password);
            console.log(registeredUser);
            req.login(registeredUser, (err)=>{   //We write this piece of code because wean our user to login automatically when he/she signup.
                if(err){
                    return next(err);
                }
                req.flash("success", "Signup completed!  WELCOME TO WANDERLUST");
                res.redirect("/listing");
            });
          
        }catch(err){
            req.flash("error", err.message);
            res.redirect("/signup");
        }
      
    };

    module.exports.renderLoginForm = (req, res)=>{
        res.render("users/login.ejs");
    };

    module.exports.login =  (req, res)=>{    //if authenticate approved by databse below lines execute if not then we set our failureFlash msg and failureRedirect page info within the middleware.
        let redirectPath;
        if(res.locals.redirectPath){  //this is when we intentionally login from listing page. 
            redirectPath = res.locals.redirectPath;
        }else{
            redirectPath = "/listing";
        }
    req.flash("success", "Welcomeback to WANDERLUST!");
    console.log(redirectPath);
      res.redirect(redirectPath);
};

module.exports.logout =  (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            next(err);
        }else{
            req.flash("success", "Logged out successfully!");
            res.redirect("/listing");
        }
       
    })
  };