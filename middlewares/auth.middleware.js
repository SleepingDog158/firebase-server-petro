const requireAuth = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (typeof req.session.User === "undefined") {
    return res.status(400).end("Authorization expired!");
  }
  const token = req.session.User.token;
  if (token && token !== bearerToken.split(" ")[1]) {
    return res.status(400).end("Forbiden!");
  }
  return next();
};

module.exports = { requireAuth };
