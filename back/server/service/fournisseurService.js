var Fournisseur = require("../model/fournisseur");
module.exports = new (class FournisseurService {
  addFournisseur(data) {
    return Fournisseur.create(data);
  }
  getFournisseurById(id) {
    return Fournisseur.findOne({ _id: id });
  }
  getFournisseurByName(name) {
    return Fournisseur.findOne({
      name: name,
    });
  }
  getFournisseurByPhone(phone) {
    return Fournisseur.findOne({
      phone: phone,
    });
  }
  getFournisseurByAdresse(adresse) {
    return Fournisseur.findOne({
      adresse: adresse,
    });
  }
  getFournisseurByMatriculeFiscale(matriculeFiscale) {
    return Fournisseur.findOne({
      matriculeFiscale: matriculeFiscale,
    });
  }
  getAllFournisseur() {
    return Fournisseur.find();
  }
  delete(id) {
    return Fournisseur.findOneAndDelete({
      _id: id,
    });
  }
  update(_id, data) {
    return Fournisseur.findOneAndUpdate(
      {
        _id: _id,
      },
      data
    );
  }
  filterBanned(data) {
    return Fournisseur.find({
      banned: data,
    });
  }
})();
