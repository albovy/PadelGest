const express = require("express");
const router = express.Router();
const permit = require("../middleware/permission");
const StatisticController = require("../controllers/StatisticController.js");

router.get("/",permit("ADMIN"),StatisticController.show);

module.exports = router;