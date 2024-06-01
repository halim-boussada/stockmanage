const router = require("express").Router();

const BonController = require("../controller/bonDeCommandeController.js");

router.post("/create", BonController.createBon);
router.get("/get/:id", BonController.getBonById);
router.get("/getAll", BonController.getAllBon);
router.delete("/delete/:id", BonController.deleteBon);
router.put("/update/:id", BonController.updateBon);
router.delete("/deleteAll", BonController.deleteAllBon);

module.exports = router;
