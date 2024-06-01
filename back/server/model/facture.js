const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;
const FactureSchema = new mongoose.Schema(
  {
    to: String,
    from: String,
    PaimentMethod: String,
    timbreFiscal: Boolean,
    giveRemise: Boolean,
    Remise: Number,
    count: Number,

    products: [
      {
        code: String,
        name: String,
        designation: String,
        category: String,
        prixAchatHT: Number,
        prixVenteHT: Number,
        MargeHT: String,
        quantite: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Facture = mongoose.model("Facture", FactureSchema);

module.exports = Facture;
