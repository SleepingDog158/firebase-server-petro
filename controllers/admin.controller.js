const { db } = require("../connectDatabase");
const { CLIENT_ROLE } = require("../constants/user.constant");

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
  const query = await db
    .collection("products")
    .get();
  let products = [];
  query.forEach((product) => {
    if (product.exists) {
      products = [...products, product.data()];
    }
  });
  res.status(200).json({ products });
};

module.exports = {
  index,
  getClients,
  getProducts
};
