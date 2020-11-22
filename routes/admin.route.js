const Router = require("express").Router();
const Controller = require("../controllers/admin.controller");

Router.get("/", Controller.index);

module.exports = Router;
