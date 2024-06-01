const BonService = require("../service/bonDeCommandeService.js");
const StockService = require("../service/stockService.js");

module.exports = {
  async createBon(req, res) {
    try {
      const data = req.body;
      const BonProducts = [];

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
            BonProducts.push(productData);
          }
        } else {
          throw new Error("Stock item not found");
        }
      }
      const countBon = await BonService.countBon();
      const BonData = {
        to: data.to,
        from: data.from,
        count: countBon + 1,
        products: BonProducts,
      };

      const Bon = await BonService.create(BonData);

      res.status(200).send(Bon);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async getBonById(req, res) {
    try {
      const id = req.params.id;
      const Bon = await BonService.getBonById(id);
      res.status(200).send(Bon);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllBon(req, res) {
    try {
      const Bon = await BonService.getAllBon();
      res.status(200).send(Bon);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteBon(req, res) {
    try {
      const id = req.params.id;
      const Bon = await BonService.delete(id);
      res.status(200).send(Bon);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateBon(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const Bon = await BonService.update(_id, data);
      res.status(200).send(Bon);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteAllBon(req, res) {
    try {
      const Bon = await BonService.deleteAll();
      res.status(200).send(Bon);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
