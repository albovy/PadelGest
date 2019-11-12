const express = require("express");
const router = express.Router();

const notLogged = require("../middleware/loggedCantAccess");
const permit = require("../middleware/permission");
const gameController = require("../controllers/GameController");

/* GET users listing. */
router.get("/", gameController.show);
router.post("/clash/:id", permit("ADMIN"), gameController.add);


//router.get('/edit:id',user.edit);

module.exports = router;