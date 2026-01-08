const mongoose = require('mongoose');
const initData = require('./data.js');
 
const Listing = require('../models/listing.js');

const MONGO_URI = 'mongodb://localhost:27017/projectdb';

async function main() {
    await mongoose.connect(MONGO_URI);
}

main().then(() =>{
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

const initDB = async () => {
  await Listing.deleteMany({});
  console.log("Cleared existing listings");
  await Listing.insertMany(initData.sampleListings);
  console.log("Database initialized with listing data");
  mongoose.connection.close();
};

main()
  .then(initDB)
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });