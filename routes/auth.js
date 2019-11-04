const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController.js");

/* GET users listing. */
router.get("/", authController.authenticate);
router.post("/", authController.authenticate);

//router.get('/edit:id',user.edit);

module.exports = router;
