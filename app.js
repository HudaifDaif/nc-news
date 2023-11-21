const express = require("express");
const { getTopics, getApi } = require("./api/controllers/topics.controllers");
const { handleBadPath, handleServerErrors, handle404, handlePostgresErrors } = require("./api/errors");
const { getComments } = require("./api/controllers/comments.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id/comments", getComments);

app.all("*", handleBadPath);

app.use(handle404)
app.use(handlePostgresErrors)
app.use(handleServerErrors);

module.exports = app;
