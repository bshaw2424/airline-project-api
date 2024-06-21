const express = require("express");
const Router = express.Router({ mergeParams: true });
const routes = require("../controllers/airlines");
const serverless = require("serverless-http");

Router.get("/", routes.index);
Router.get("/info", routes.destinationIndex);
Router.get("/:slug", routes.showPage);

module.exports = Router;
