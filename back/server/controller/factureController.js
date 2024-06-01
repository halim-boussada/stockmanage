const FactureService = require("../service/factureService.js");
const StockService = require("../service/stockService.js");

module.exports = {
  async createFacture(req, res) {
    try {
      const data = req.body;
      const factureProducts = [];

      for (const product of data.products) {
        const stockItem = await StockService.getStockById({ _id: product._id });
        if (stockItem) {
          if (stockItem.quantite < product.quantite) {
            return res.send({ msg: "Out of stock" });
          } else {
            stockItem.quantite -= product.quantite;
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
            factureProducts.push(productData);
          }
        } else {
          throw new Error("Stock item not found");
        }
      }
      countFacture = await FactureService.countFacture();
      const factureData = {
        to: data.to,
        from: data.from,
        count: countFacture + 1,
        products: factureProducts,
      };

      const facture = await FactureService.create(factureData);

      res.status(200).send(facture);
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  async getFactureById(req, res) {
    try {
      const id = req.params.id;
      const facture = await FactureService.getFactureById(id);
      res.status(200).send(facture);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllFacture(req, res) {
    try {
      const facture = await FactureService.getAllFacture();
      res.status(200).send(facture);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteFacture(req, res) {
    try {
      const id = req.params.id;
      const facture = await FactureService.delete(id);
      res.status(200).send(facture);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateFacture(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const facture = await FactureService.update(_id, data);
      res.status(200).send(facture);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteAllFacture(req, res) {
    try {
      const facture = await FactureService.deleteAll();
      res.status(200).send(facture);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
