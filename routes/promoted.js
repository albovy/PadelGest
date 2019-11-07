const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const PromotedGameController = require("../controllers/PromotedGameController.js");

router.get("/", permit("ADMIN"), PromotedGameController.showAll);
router.get("/add", permit("ADMIN"), PromotedGameController.add);
router.post("/add", permit("ADMIN"), PromotedGameController.add);
router.post("/delete/:id", permit("ADMIN"), PromotedGameController.delete);

module.exports = router;