const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const clasificationController = require("../controllers/ClasificationController");

router.get("/tournament/:id", permit("ATHLETE", "COACH"), clasificationController.showClasificationTournmanet);
  


module.exports = router;