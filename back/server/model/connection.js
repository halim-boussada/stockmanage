const mongoose = require("mongoose");

const db = mongoose.connect(
  "mongodb+srv://halim:20028952Sami@cluster0.b1pz3.mongodb.net/stock-management?retryWrites=true&w=majority"
);
module.exports = db;
