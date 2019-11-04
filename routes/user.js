const express = require("express");
const router = express.Router();
const permit = require("../functions/permission");

const userController = require("../controllers/UserController.js");

router.get("/register", userController.register);
router.post("/register", userController.register);
router.get("/showAll", permit("ADMIN"), userController.showAll);

//router.get('/edit:id',user.edit);

module.exports = router;
