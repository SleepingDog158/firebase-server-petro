const Router = require("express").Router();
const Controller = require("../controllers/auth.controller");

Router.post("/signUp", Controller.signUp);
Router.post("/signIn", Controller.signIn);
Router.patch("/:userId", Controller.updateInfo);

module.exports = Router;
