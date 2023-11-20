const express = require("express");
const { getTopics, getApi, getArticles } = require("./api/controllers/topics.controllers");
const { handleBadPath, handleServerErrors } = require("./api/errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.all("*", handleBadPath);

app.use(handleServerErrors);

module.exports = app;
