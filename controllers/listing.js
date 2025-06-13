const Listing = require("../models/listing");
const mongoose = require("mongoose");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

module.exports.renderNewForm =   (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ExpressError("Page Not Found", 404));
  }

  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  console.log("Listing Found:", listing);
  res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
};



module.exports.createListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
    .send();


    
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id; // Set the owner to the current user
  newListing.image = {url, filename};

newListing.geometry =  response.body.features[0].geometry;

  let savedListing =  await newListing.save();
  console.log(savedListing);

  
  req.flash("success", "New Listing created. Successfully!");

  console.log("New Listing Created:", newListing);
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params; // Ensure id parameter is defined
  const listing = await Listing.findById(id);
  if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
  }


  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res, next) => {
  try {
    console.log(" Incoming body:", req.body);
    console.log(" Incoming file:", req.file);

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "Listing updated successfully.");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.log("❌ ERROR inside updateListing", err);
    req.flash("error", err.message);
    res.redirect(`/listings/${req.params.id}`);
  }
};



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params; // Ensure id parameter is defined
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log("Deleted Listing:", deletedListing);
    req.flash("success", "Listing deleted successfully.");
    if (!deletedListing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    res.redirect("/listings");
  };