const StockService = require("../service/stockService.js");

module.exports = {
  async createStock(req, res) {
    try {
      const data = req.body;
      const CodeByStock = await StockService.getStockByCode(data.code);
      if (CodeByStock) {
        return res.send({ message: "Code already exist" });
      } else {
        const stock = await StockService.create(data);
        res.status(200).send(stock);
      }
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getStockById(req, res) {
    try {
      const id = req.params.id;
      const stock = await StockService.getStockById(id);
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async getAllStock(req, res) {
    try {
      const stock = await StockService.getAllStock();
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async deleteStock(req, res) {
    try {
      const id = req.params.id;
      const stock = await StockService.delete(id);
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async updateStock(req, res) {
    try {
      const _id = req.params.id;
      const data = req.body;
      const stock = await StockService.update(_id, data);
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },
  async filterCategory(req, res) {
    try {
      const data = req.body;
      const stock = await StockService.filterCategory(data);
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async searchBynameOrDesignation(req, res) {
    try {
      const data = req.body;
      const stock = await StockService.searchBynameOrDesignation(data);
      res.status(200).send(stock);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
