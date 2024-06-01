var Facture = require("../model/facture.js");
var Stock = require("../model/stock.js");

module.exports = new (class FactureService {
  create(data) {
    return Facture.create(data);
  }
  getFactureById(id) {
    return Facture.findOne({ _id: id }).populate("products");
  }
  getAllFacture() {
    return Facture.find().populate("products");
  }
  delete(id) {
    return Facture.findOneAndDelete({ _id: id });
  }
  update(_id, data) {
    return Facture.findOneAndUpdate({ _id: _id }, data);
  }
  deleteAll() {
    return Facture.deleteMany({});
  }
  countFacture() {
    return Facture.countDocuments();
  }
})();
