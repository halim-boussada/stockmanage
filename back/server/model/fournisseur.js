const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const FournisseurSchema = new mongoose.Schema(
  {
    name: String,
    phone: String,
    adresse: String,
    matriculeFiscale: String,
  },
  {
    timestamps: true,
  }
);

const Fournisseur = mongoose.model("Fournisseur", FournisseurSchema);

module.exports = Fournisseur;
