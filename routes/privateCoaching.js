const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const PrivateCoachingController = require("../controllers/PrivateCoachingController.js");

router.get("/", permit("ATHLETE","ADMIN, COACH"), PrivateCoachingController.showAll);
router.get("/showInscriptions", permit("ATHLETE, COACH"), PrivateCoachingController.showMyInscriptions);
router.post("/showInscriptions", permit("ATHLETE, COACH"), PrivateCoachingController.showMyInscriptions);
router.get("/add", permit("ADMIN, COACH"), PrivateCoachingController.add);
router.post("/add", permit("ADMIN, COACH"), PrivateCoachingController.add);
router.post("/delete/:id", permit("ADMIN, COACH"), PrivateCoachingController.delete);

module.exports = router;