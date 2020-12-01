const { db } = require("../connectDatabase");
const { DRIVER_ROLE } = require("../constants/user.constant");

const index = (req, res) => {
  res.send(req.session.User.role);
};

const getDrivers = async (req, res) => {
  const query = await db
    .collection("users")
    .where("role", "==", DRIVER_ROLE)
    .get();
  let drivers = [];
  query.forEach((driver) => {
    if (driver.exists) {
      drivers = [...drivers, driver.data()];
    }
  });
  res.status(200).json({ drivers });
};

module.exports = {
  index,
  getDrivers,
};
