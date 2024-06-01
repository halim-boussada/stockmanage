const mongoose = require("mongoose");
const db = require("./connection.js");
mongoose.Promise = global.Promise;

const ClientSchema = new mongoose.Schema(
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

const Client = mongoose.model("Client", ClientSchema);

module.exports = Client;
