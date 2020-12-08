const validateSchema = require("../common/validateSchema");
const { db } = require("../connectDatabase");
const { DRIVER_ROLE, CLIENT_PREFIX } = require("../constants/user.constant");
const { validate } = require("../common/validateSchema");
const DivideContractSchema = require("../models/DivideContract");

const index = (req, res) => {
  res.send(req.session.User.role);
};

// client get drivers
const getDrivers = async (req, res) => {
  const query = await db
    .collection("users")
    .where("role", "==", DRIVER_ROLE)
    .where("clientId", "==", req.session.User.typeId)
    .get();
  let drivers = [];
  query.forEach((driver) => {
    if (driver.exists) {
      drivers = [...drivers, driver.data()];
    }
  });
  res.status(200).json({ drivers });
};

const divideContract = async (req, res) => {
  res.send(req.body.contractId);
  // const { contractId, drivers } = req.body;
  // if (contractId) {
  //   if (!drivers) return res.status(400).json({ message: "Driver not found!" });
  //   drivers.forEach(async (driver) => {
  //     const error = await validate(driver, DivideContractSchema);
  //     if (error) {
  //       return res.status(400).json({ message: error });
  //     }
  //   });
  // } else {
  //   return res.status(400).json({ message: "Cannot find contract!" });
  // }
};

// contractId
// drivers: [
//   {
//     driverId,
//     limit,
//     remain,
//     maxTransaction
//   }
// ]

module.exports = {
  index,
  getDrivers,
  divideContract,
};
