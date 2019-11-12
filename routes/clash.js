const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const clashController = require("../controllers/ClashController");

router.get("/", permit("ATHLETE"), clashController.show);
router.get("/tournament/:id",permit("ATHLETE"),clashController.showTournament);    


module.exports = router;