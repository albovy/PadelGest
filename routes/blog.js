const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const blogController = require("../controllers/BlogController.js");

router.get("/", permit("ATHLETE", "ADMIN", "COACH"), blogController.showAll);
router.get("/show/:id", permit("ATHLETE", "ADMIN", "COACH"), blogController.show);
router.get("/add", permit("ADMIN", "COACH"), blogController.add);
router.post("/add", permit("ADMIN", "COACH"), blogController.add);
router.get("/edit/:id", permit("ADMIN", "COACH"), blogController.edit);
router.post("/edit/:id", permit("ADMIN", "COACH"), blogController.edit);
router.post("/delete/:id", permit("ADMIN", "COACH"), blogController.delete);

module.exports = router;