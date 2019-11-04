const express = require("express");
const router = express.Router();

const notLogged = require("../middleware/loggedCantAccess");
const authController = require("../controllers/AuthController.js");

/* GET users listing. */
router.get("/", notLogged(), authController.authenticate);
router.post("/", notLogged(), authController.authenticate);

//router.get('/edit:id',user.edit);

module.exports = router;
