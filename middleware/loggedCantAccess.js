module.exports = () => {
  return (req, res, next) => {
    if (req.user) {
      res.redirect("/");
    } else {
      next();
    }
  };
};
