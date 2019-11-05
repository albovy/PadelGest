const express = require("express");
const router = express.Router();
const permit = require("../middleware/permission");
const notLogged = require("../middleware/loggedCantAccess");

const userController = require("../controllers/UserController.js");

router.get("/", permit("ADMIN"), userController.showAll);
router.get("/edit/:id", permit("ADMIN", "ATHLETE"), userController.edit);
router.put("/edit/:id", permit("ADMIN","ATHLETE"), userController.edit);
router.post("/delete/:id", permit("ADMIN"), userController.delete);
router.get("/register", notLogged(), userController.register);
router.post("/register", notLogged(), userController.register);

//router.get('/edit:id',user.edit);

module.exports = router;
