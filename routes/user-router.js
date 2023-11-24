const { getUsers } = require("../api/controllers/users.controllers");

const usersRouter = require("express").Router();

usersRouter.route("/").get(getUsers);

module.exports = usersRouter;
