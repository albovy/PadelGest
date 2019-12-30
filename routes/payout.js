const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const payoutController = require("../controllers/PayoutController.js");

router.get("/", permit("ATHLETE"), payoutController.info);
router.post("/", permit("ATHLETE"), payoutController.info);
router.post("/show", permit("ATHLETE"), payoutController.show);
router.get("/add", permit("ATHLETE"), payoutController.add);
router.post("/add", permit("ATHLETE"), payoutController.add);
router.get("/member", permit("ATHLETE"), payoutController.member);
router.post("/member", permit("ATHLETE"), payoutController.member);
//router.post("/delete/:id", permit("ATHLETE"), inscriptionController.delete);

module.exports = router;