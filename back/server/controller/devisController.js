const DevisService = require("../service/devisService.js");
const StockService = require("../service/stockService.js");

module.exports = {
  async createDevis(req, res) {
    try {
      const data = req.body;
      const DevisProducts = [];

      for (const product of data.products) {
        const stockItem = await StockService.getStockById({ _id: product._id });
        if (stockItem) {
          if (stockItem.quantite < product.quantite) {
            return res.send({ msg: "Out of stock" });
          } else {
            await StockService.update(stockItem._id, stockItem);
            const productData = {
              _id: stockItem._id,
              code: stockItem.code,
              quantite: product.quantite,
              name: stockItem.name,
              designation: stockItem.designation,
              category: stockItem.category,
              prixAchatHT: stockItem.prixAchatHT,
              prixVenteHT: stockItem.prixVenteHT,
              MargeHT: stockItem.MargeHT,
            };
            DevisProducts.push(productData);
          }
        } else {
          throw new Error("Stock item not found");
        }
      }
      const countDevis = await DevisService.countDevis();
      const DevisData = {
        to: data.to,
        from: data.from,
        count: countDevis + 1,
        products: DevisProducts,
      };

      const Devis = await DevisService.create(DevisData);

      res.status(200).send(Devis);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async getDevisById(req, res) {
    try {
      const id = req.params.id;
      const Devis = await DevisService.getDevisById(id);
      res.status(200).send(Devis);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllDevis(req, res) {
    try {
      const Devis = await DevisService.getAllDevis();
      res.status(200).send(Devis);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteDevis(req, res) {
    try {
      const id = req.params.id;
      const Devis = await DevisService.delete(id);
      res.status(200).send(Devis);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateDevis(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const Devis = await DevisService.update(_id, data);
      res.status(200).send(Devis);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteAllDevis(req, res) {
    try {
      const Devis = await DevisService.deleteAll();
      res.status(200).send(Devis);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
