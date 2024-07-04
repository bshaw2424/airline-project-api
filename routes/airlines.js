const express = require("express");
const Router = express.Router({ mergeParams: true });
const routes = require("../controllers/airlines");

Router.get("/", routes.index);
Router.get("/info", routes.destinationIndex);
Router.get("/:slug", routes.showPage);

module.exports = Router;
