const Router = require("express").Router();
const Controller = require("../controllers/client.controller");

Router.get("/", Controller.index);
Router.get("/getDrivers", Controller.getDrivers);

module.exports = Router;
