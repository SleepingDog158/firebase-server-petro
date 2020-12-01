const Router = require("express").Router();
const Controller = require("../controllers/admin.controller");

Router.get("/", Controller.index);
Router.get("/getClients", Controller.getClients);
Router.get("/getProducts", Controller.getProducts);

module.exports = Router;
