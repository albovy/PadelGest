const express = require("express");
const router = express.Router();

const notLogged = require("../middleware/loggedCantAccess");
const permit = require("../middleware/permission");
const courtController = require("../controllers/CourtController.js");

/* GET users listing. */
router.get("/", courtController.showAll);
router.get("/add", permit("ADMIN"), courtController.add);
router.post("/add", permit("ADMIN"), courtController.add);
router.get("/edit/:id", permit("ADMIN"), courtController.edit);
router.post("/edit/:id", permit("ADMIN"), courtController.edit);
router.post("/delete/:id", permit("ADMIN"), courtController.delete);

//router.get('/edit:id',user.edit);

module.exports = router;
