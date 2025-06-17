if(process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const dbURL = process.env.ATLASDB_URL;

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const helmet = require("helmet");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR IN MONGO SESSION STORE!!!", err);
});


const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie : {
   expires : Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
   maxAge : 7 * 24 * 60 * 60 * 1000, // 3 days
   httpOnly : true, // Helps prevent XSS attacks
  },
};

main()
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("DB Connection Error:", err));

async function main() {
  await mongoose.connect(dbURL);
}

// Middleware and View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); // Use ejsMate for EJS templating
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

// Root Route
app.get("/", (req, res) => {
  res.redirect("/listings");
});



app.use(session(sessionOptions));
app.use(flash());

app.use(helmet());

app.use((req, res, next) => {
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://api.mapbox.com;
    style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com https://fonts.googleapis.com https://api.mapbox.com;
    font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    img-src 'self' blob: data: https://res.cloudinary.com https://images.unsplash.com;
    connect-src 'self' https://api.mapbox.com https://events.mapbox.com;
    worker-src 'self' blob:;
  `.replace(/\s{2,}/g, ' ').trim();
  
  res.setHeader("Content-Security-Policy", csp);
  next();
});




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; 
  next();
}
);

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



// Catch-all 404 handler (FIXED)
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.message = "Something is wrong with your input.";
    err.statusCode = 400;
  }
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error", { message });
});


// Start the Server
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});