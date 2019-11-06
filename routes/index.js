const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", {
    title: "Express",
    user: req.user,
    expressFlash: req.flash("error"),
    sessionFlash: res.locals.sessionFlash
  });
});

module.exports = router;
