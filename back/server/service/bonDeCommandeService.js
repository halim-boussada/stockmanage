var Bon = require("../model/bonDeLivraison.js");
var Stock = require("../model/stock.js");

module.exports = new (class BonService {
  create(data) {
    return Bon.create(data);
  }
  getBonById(id) {
    return Bon.findOne({ _id: id }).populate("products");
  }
  getAllBon() {
    return Bon.find().populate("products");
  }
  delete(id) {
    return Bon.findOneAndDelete({ _id: id });
  }
  update(_id, data) {
    return Bon.findOneAndUpdate({ _id: _id }, data);
  }
  deleteAll() {
    return Bon.deleteMany({});
  }
  countBon() {
    return Bon.countDocuments();
  }
})();
