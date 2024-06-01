const router = require("express").Router();

const factureController = require("../controller/factureController.js");

router.post("/create", factureController.createFacture);
router.get("/get/:id", factureController.getFactureById);
router.get("/getAll", factureController.getAllFacture);
router.delete("/delete/:id", factureController.deleteFacture);
router.put("/update/:id", factureController.updateFacture);
router.delete("/deleteAll", factureController.deleteAllFacture);

module.exports = router;
