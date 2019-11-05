const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const inscriptionController = require("../controllers/InscriptionController.js");

router.get("/", permit("ATHLETE"), inscriptionController.show);
router.post("/tournament/:id", permit("ATHLETE"), inscriptionController.add);
router.post("/delete/:id", permit("ATHLETE"), inscriptionController.delete);

module.exports = router;
