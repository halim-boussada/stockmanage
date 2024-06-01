const FournisseurService = require("../service/fournisseurService.js");

module.exports = {
  async createFournisseur(req, res) {
    try {
      const data = req.body;
      const fournisseur = await FournisseurService.addFournisseur(data);
      res.status(200).send(fournisseur);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getFournisseurById(req, res) {
    try {
      const id = req.params.id;
      const fournisseur = await FournisseurService.getFournisseurById(id);
      res.status(200).send(fournisseur);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllFournisseur(req, res) {
    try {
      const fournisseur = await FournisseurService.getAllFournisseur();
      res.status(200).send(fournisseur);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteFournisseur(req, res) {
    try {
      const id = req.params.id;
      const fournisseur = await FournisseurService.delete(id);
      res.status(200).send(fournisseur);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateFournisseur(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const fournisseur = await FournisseurService.update(_id, data);
      res.status(200).send(fournisseur);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
