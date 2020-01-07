const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const PrivateCoachingInscriptionController = require("../controllers/PrivateCoachingInscriptionController.js");

router.get("/", permit("ATHLETE"), PrivateCoachingInscriptionController.showAll);
router.post("/add/:id/:amount", permit("ATHLETE"), PrivateCoachingInscriptionController.add);
router.post("/delete/:id", permit("ATHLETE"), PrivateCoachingInscriptionController.delete);

module.exports = router;