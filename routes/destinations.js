const express = require("express");
const Router = express.Router({ mergeParams: true });
const routes = require("../controllers/destinations");

// Router.get("/", routes.index);

module.exports = Router;
