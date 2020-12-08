const Router = require("express").Router();
const Controller = require("../controllers/station.controllers");

Router.get("/", Controller.index);
Router.post("/createBill", Controller.createBill);

module.exports = Router;
