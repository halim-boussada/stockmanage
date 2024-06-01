const router = require("express").Router();

const devisController = require("../controller/devisController.js");

router.post("/create", devisController.createDevis);
router.get("/get/:id", devisController.getDevisById);
router.get("/getAll", devisController.getAllDevis);
router.delete("/delete/:id", devisController.deleteDevis);
router.put("/update/:id", devisController.updateDevis);
router.delete("/deleteAll", devisController.deleteAllDevis);

module.exports = router;
