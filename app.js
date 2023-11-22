const express = require("express");
const {
	getTopics,
    getApi,
    getArticles
} = require("./api/controllers/topics.controllers");
const {
	handleBadPath,
	handleServerErrors,
	handle404,
    handlePostgresErrors,
} = require("./api/errors");
const { patchArticleById, getArticleById } = require("./api/controllers/article.controllers");
const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById);

app.use(express.json())
app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", handleBadPath);

app.use(handlePostgresErrors)
app.use(handle404);
app.use(handleServerErrors);

module.exports = app;
