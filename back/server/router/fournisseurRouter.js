const router = require("express").Router();

const fournisseurController = require("../controller/fournisseurController.js");

router.post("/create", fournisseurController.createFournisseur);
router.get("/get/:id", fournisseurController.getFournisseurById);
router.get("/getAll", fournisseurController.getAllFournisseur);
router.delete("/delete/:id", fournisseurController.deleteFournisseur);
router.put("/update/:id", fournisseurController.updateFournisseur);

module.exports = router;
