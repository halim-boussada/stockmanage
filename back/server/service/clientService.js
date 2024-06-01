var Client = require("../model/client");
module.exports = new (class ClientService {
  addClient(data) {
    return Client.create(data);
  }
  getClientById(id) {
    return Client.findOne({ _id: id });
  }
  getClientByName(name) {
    return Client.findOne({
      name: name,
    });
  }
  getClientByPhone(phone) {
    return Client.findOne({
      phone: phone,
    });
  }
  getClientByAdresse(adresse) {
    return Client.findOne({
      adresse: adresse,
    });
  }
  getClientByMatriculeFiscale(matriculeFiscale) {
    return Client.findOne({
      matriculeFiscale: matriculeFiscale,
    });
  }
  getAllClient() {
    return Client.find();
  }
  delete(id) {
    return Client.findOneAndDelete({
      _id: id,
    });
  }
  update(_id, data) {
    return Client.findOneAndUpdate(
      {
        _id: _id,
      },
      data
    );
  }
  filterBanned(data) {
    return Client.find({
      banned: data,
    });
  }
})();
