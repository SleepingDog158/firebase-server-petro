const requireAuth = (req, res, next) => {
  const bearerToken = req.headers["authorization"];
  if (typeof req.session.User === "undefined") {
    return res.status(400).json({ message: "Authorization expired!" }).end();
  }
  if (!bearerToken || bearerToken.trim() === "") {
    return res.status(400).json({ message: "Not authorization!" }).end();
  }
  const token = req.session.User.token;
  if (token && token !== bearerToken.split(" ")[1]) {
    return res.status(400).json({ message: "Forbiden!" }).end();
  }
  return next();
};

module.exports = { requireAuth };
