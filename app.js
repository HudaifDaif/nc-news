const express = require("express");
const { getApi } = require("./api/controllers/api.controllers");
const { getTopics } = require("./api/controllers/topics.controllers");
const { getComments } = require("./api/controllers/comments.controllers");
const {
	getArticles,
	getArticleById,
} = require("./api/controllers/article.controllers");
const {
	handleBadPath,
	handlePostgresErrors,
	handle404,
	handleServerErrors,
} = require("./api/errors");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id/comments", getComments);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.all("*", handleBadPath);

app.use(handlePostgresErrors);
app.use(handle404);

app.use(handleServerErrors);

module.exports = app;
