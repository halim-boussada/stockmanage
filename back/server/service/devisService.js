var Devis = require("../model/devis.js");
var Stock = require("../model/stock.js");

module.exports = new (class DevisService {
  create(data) {
    return Devis.create(data);
  }
  getDevisById(id) {
    return Devis.findOne({ _id: id }).populate("products");
  }
  getAllDevis() {
    return Devis.find().populate("products");
  }
  delete(id) {
    return Devis.findOneAndDelete({ _id: id });
  }
  update(_id, data) {
    return Devis.findOneAndUpdate({ _id: _id }, data);
  }
  deleteAll() {
    return Devis.deleteMany({});
  }
  countDevis() {
    return Devis.countDocuments();
  }
})();
