const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const clasificationController = require("../controllers/ClasificationController");

router.get("/tournament/:id", permit("ATHLETE"), clasificationController.showClasificationTournmanet);
  


module.exports = router;