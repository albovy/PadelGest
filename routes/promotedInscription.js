const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const PromotedInscriptionController = require("../controllers/PromotedInscriptionController.js");

router.get("/", permit("ATHLETE", "COACH"), PromotedInscriptionController.showAll);
router.post("/add/:id", permit("ATHLETE", "COACH"), PromotedInscriptionController.add);
router.post("/delete/:id", permit("ATHLETE", "COACH"), PromotedInscriptionController.delete);

module.exports = router;