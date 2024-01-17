const { getApi } = require("../controllers/api.controllers");

const apiRouter = require("express").Router();

apiRouter.route("/").get(getApi);

module.exports = apiRouter;
