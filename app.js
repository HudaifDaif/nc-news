const express = require("express");
const { getCommentsById } = require("./api/controllers/comments.controllers");
const {
	getTopics,
} = require("./api/controllers/topics.controllers");
const {
	handleBadPath,
	handlePostgresErrors,
	handle404,
	handleServerErrors,
} = require("./api/errors");
const {
	patchArticleById,
	getArticles,
	getArticleById,
} = require("./api/controllers/article.controllers");
const { getApi } = require("./api/controllers/api.controllers");
const { getUsers } = require("./api/controllers/users.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);

app.use(express.json());
app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", handleBadPath);

app.use(handlePostgresErrors);
app.use(handle404);

app.use(handleServerErrors);

module.exports = app;
