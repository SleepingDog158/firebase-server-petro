const index = (req, res) => {
  res.send(req.session.User.role);
};

const createBill = (req, res) => {

}

module.exports = {
  index,
  createBill
};