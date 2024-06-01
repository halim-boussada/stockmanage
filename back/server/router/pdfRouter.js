const express = require("express");
const router = express.Router();
const pdfController = require("../controller/pdfController.js");

router.post("/get", pdfController.generatePDF);
router.post("/get/devis", pdfController.generatePDFDevis);
router.post("/get/bon", pdfController.generatePDFBon);

module.exports = router;
