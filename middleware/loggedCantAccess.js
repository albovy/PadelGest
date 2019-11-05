module.exports = () => {
  return (req, res, next) => {
    if (req.user) {
      req.flash('error', 'Ya estás logueado');
      res.redirect("/");
    } else {
      next();
    }
  };
};
