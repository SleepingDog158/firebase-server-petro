const { db, firebase } = require("../connectDatabase");
const { CLIENT_ROLE } = require("../constants/user.constant");
const ContractSchema = require("../models/Contract.model");
const { validate } = require("../common/validateSchema");
const { INACTIVE } = require("../constants/contract.constanst");

const index = (req, res) => {
  res.send(req.session.User.role);
};

const getClients = async (req, res) => {
  const query = await db
    .collection("users")
    .where("role", "==", CLIENT_ROLE)
    .get();
  let clients = [];
  query.forEach((client) => {
    if (client.exists) {
      clients = [...clients, client.data()];
    }
  });
  res.status(200).json({ clients });
};

const getProducts = async (req, res) => {
  const query = await db.collection("products").get();
  let products = [];
  query.forEach((product) => {
    if (product.exists) {
      products = [...products, product.data()];
    }
  });
  res.status(200).json({ products });
};

const createContract = async (req, res) => {
  let params = {
    ...req.body,
    createdDate: new Date(Date.now()),
    status: INACTIVE,
  };
  const error = await validate(params, ContractSchema);
  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
  params = {
    ...params,
    createdDate: firebase.firestore.Timestamp.fromDate(
      new Date(params.createdDate)
    ),
    startDate: firebase.firestore.Timestamp.fromDate(
      new Date(params.startDate)
    ),
    endDate: firebase.firestore.Timestamp.fromDate(new Date(params.endDate)),
  };

  const newContract = await db.collection("contracts").add(params);
  if (newContract) {
    return res.status(200).json({
      contractId: newContract.id,
      message: "Contract written",
    });
  }
};

module.exports = {
  index,
  getClients,
  getProducts,
  createContract,
};
