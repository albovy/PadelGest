const express = require("express");
const router = express.Router();

const permit = require("../middleware/permission");
const tournamentController = require("../controllers/TournamentController.js");

/* GET users listing. */
router.get("/", tournamentController.showAll);
router.get("/add", permit("ATHLETE", "ADMIN"), tournamentController.add);
router.post("/add", permit("ATHLETE","ADMIN"), tournamentController.add);
router.get("/edit/:id", permit("ADMIN"), tournamentController.edit);
router.post("/edit/:id", permit("ADMIN"), tournamentController.edit);
router.post("/delete/:id", permit("ADMIN"), tournamentController.delete);

//router.get('/edit:id',user.edit);

module.exports = router;
