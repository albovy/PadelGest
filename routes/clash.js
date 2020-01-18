const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const clashController = require("../controllers/ClashController");

router.get("/", permit("ATHLETE","COACH"), clashController.show);
router.get("/tournament/:id",permit("ATHLETE","COACH"),clashController.showTournament);    
router.get("/contact/:user1_id/:user3_id",permit("ATHLETE","COACH"),clashController.contact);


module.exports = router;