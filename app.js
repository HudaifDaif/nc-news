const express = require("express");
const {
	getCommentsById,
	deleteCommentById,
	postComment,
} = require("./api/controllers/comments.controllers");
const { getApi } = require("./api/controllers/api.controllers");
const { getTopics } = require("./api/controllers/topics.controllers");
const {
	handleBadPath,
	handlePostgresErrors,
	handleCustomErrors,
	handleServerErrors,
} = require("./api/errors");
const {
	patchArticleById,
	getArticles,
	getArticleById,
} = require("./api/controllers/article.controllers");
const { getUsers } = require("./api/controllers/users.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id/comments", getCommentsById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.get("/api/users", getUsers);
app.delete("/api/comments/:comment_id", deleteCommentById);

app.use(express.json());

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.all("*", handleBadPath);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);

app.use(handleServerErrors);
app.use(express.json());

module.exports = app;
