const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const bookController = require("../controllers/BookController.js");

router.get("/", permit("ATHLETE"), bookController.show);    
router.get("/add", permit("ATHLETE"), bookController.add);
router.post("/add", permit("ATHLETE"), bookController.add);
router.post("/delete/:id", permit("ATHLETE"), bookController.delete);

module.exports = router;