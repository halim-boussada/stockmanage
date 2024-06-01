const ClientService = require("../service/clientService.js");

module.exports = {
  async createClient(req, res) {
    try {
      const data = req.body;
      console.log("dkdaksda" , data )
      const Client = await ClientService.addClient(data);
      res.status(200).send(Client);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getClientById(req, res) {
    try {
      const id = req.params.id;
      const Client = await ClientService.getClientById(id);
      res.status(200).send(Client);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllClient(req, res) {
    try {
      const Client = await ClientService.getAllClient();
      res.status(200).send(Client);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteClient(req, res) {
    try {
      const id = req.params.id;
      const Client = await ClientService.delete(id);
      res.status(200).send(Client);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateClient(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const Client = await ClientService.update(_id, data);
      res.status(200).send(Client);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
