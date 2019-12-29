const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const bookController = require("../controllers/BookController.js");

router.get("/", permit("ATHLETE", "COACH"), bookController.show);    
router.get("/add", permit("ATHLETE", "COACH"), bookController.add);
router.post("/add", permit("ATHLETE", "COACH"), bookController.add);
router.post("/delete/:id", permit("ATHLETE", "COACH"), bookController.delete);

module.exports = router;