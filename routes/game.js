const express = require("express");
const router = express.Router();

const notLogged = require("../middleware/loggedCantAccess");
const permit = require("../middleware/permission");
const gameController = require("../controllers/GameController");

/* GET users listing. */

router.post("/clash/:id", permit("ATHLETE", "COACH"), gameController.add);
router.get("/tournament/:id",permit("ATHLETE","ADMIN", "COACH"), gameController.showForTournament);
router.post("/results/:id", permit("ADMIN"), gameController.results);


//router.get('/edit:id',user.edit);

module.exports = router;