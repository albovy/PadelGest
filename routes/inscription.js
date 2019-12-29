const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const inscriptionController = require("../controllers/InscriptionController.js");

router.get("/", permit("ATHLETE", "COACH"), inscriptionController.show);
router.post("/tournament/:id", permit("ATHLETE", "COACH"), inscriptionController.add);
router.post("/delete/:id", permit("ATHLETE", "COACH"), inscriptionController.delete);

module.exports = router;
