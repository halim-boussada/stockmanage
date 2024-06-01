const router = require("express").Router();

const stockController = require("../controller/stockController.js");

router.post("/create", stockController.createStock);
router.get("/get/:id", stockController.getStockById);
router.get("/getAll", stockController.getAllStock);
router.delete("/delete/:id", stockController.deleteStock);
router.put("/update/:id", stockController.updateStock);
router.post("/filter", stockController.filterCategory);
router.post("/search", stockController.searchBynameOrDesignation);

module.exports = router;
