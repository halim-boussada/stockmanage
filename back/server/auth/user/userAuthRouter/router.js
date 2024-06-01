const router = require("express").Router();
const userController = require("../userAuthController/controller.js");

router.post("/signup", userController.signUpUser);
router.post("/signin", userController.login);
router.post("/verify", userController.verify);
router.get("/", userController.getUsers);
router.get("/getUserById/:id", userController.getUserById);
router.delete("/:id", userController.delet);
router.put("/:id", userController.update);
module.exports = router;
