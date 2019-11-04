module.exports = (...allowed) => {
  // return a middleware
  const isAllowed = role => allowed.indexOf(role) > -1;
  // return a middleware
  return (req, res, next) => {
    if (req.user && isAllowed(req.user.role)) next();
    // role is allowed, so continue on the next middleware
    else {
      res.send("/"); // user is forbidden
    }
  };
};
