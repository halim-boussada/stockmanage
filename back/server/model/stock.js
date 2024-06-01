const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const StockSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
    },
    name: String,
    designation: String,
    category: String,
    prixAchatHT: Number,
    prixVenteHT: Number,
    stockMin: Number,
    MargeHT: Number,
    quantite: Number,
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", StockSchema);

module.exports = Stock;
