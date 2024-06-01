const router = require("express").Router();

const ClientController = require("../controller/clientController.js");

router.post("/create", ClientController.createClient);
router.get("/get/:id", ClientController.getClientById);
router.get("/getAll", ClientController.getAllClient);
router.delete("/delete/:id", ClientController.deleteClient);
router.put("/update/:id", ClientController.updateClient);

module.exports = router;
