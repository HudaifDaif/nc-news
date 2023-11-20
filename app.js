const express = require("express");
const { getTopics } = require("./api/controllers/topics.controllers");
const { handleBadPath, handleServerErrors } = require("./api/errors");

const app = express();

app.get("/api/topics", getTopics);

app.all("*", handleBadPath);

app.use(handleServerErrors)

module.exports = app;
