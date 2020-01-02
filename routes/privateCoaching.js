const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const PrivateCoachingController = require("../controllers/PrivateCoachingController.js");

router.get("/", permit("ATHLETE", "ADMIN", "COACH"), PrivateCoachingController.showAll);
router.get("/showInscriptions", permit("ATHLETE"), PrivateCoachingController.showMyInscriptions);
router.post("/showInscriptions", permit("ATHLETE"), PrivateCoachingController.showMyInscriptions);
router.get("/showCoachInscriptions", permit("COACH"), PrivateCoachingController.showCoachInscriptions);
router.get("/add", permit("ADMIN", "COACH"), PrivateCoachingController.add);
router.post("/add", permit("ADMIN", "COACH"), PrivateCoachingController.add);
router.post("/delete/:id", permit("ADMIN", "COACH"), PrivateCoachingController.delete);

module.exports = router;