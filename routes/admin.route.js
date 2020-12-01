const Router = require("express").Router();
const Controller = require("../controllers/admin.controller");

Router.get("/", Controller.index);
Router.get("/getClients", Controller.getClients);
Router.get("/getProducts", Controller.getProducts);
Router.post("/createContract", Controller.createContract);

module.exports = Router;
