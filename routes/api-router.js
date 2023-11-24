const { getApi } = require("../api/controllers/api.controllers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getApi);

module.exports = apiRouter;
