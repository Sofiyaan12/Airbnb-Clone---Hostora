const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/hostora";

main()
    .then(() => {
        console.log("Connected to DB");
        initDB(); // Keep this here for when you run `node init/index.js`
    })
    .catch((err) => {
        console.error("Connection error:", err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ( { ...obj, owner: "6849de069b9856410246c5d3" }));
    await Listing.insertMany(initData.data);
    console.log("Listings initialized");
};