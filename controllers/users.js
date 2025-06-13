const User = require("../models/user");


module.exports.renderSignupForm =  (req, res) => {
    res.render("users/signup.ejs");
    };


module.exports.signup = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        let newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log("New User Registered:", registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Hostora!");
            res.redirect("/listings");
        });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login =  async (req, res) => {
    req.flash("success", "Welcome back to Hostora!");
    res.redirect(res.locals.redirectUrl); 
};

module.exports.logout =  (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listings");
    });
};