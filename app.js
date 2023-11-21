const express = require("express");
const {
	getTopics,
    getArticleById,
    getApi,
    getArticles
} = require("./api/controllers/topics.controllers");

const {
	handleBadPath,
	handleServerErrors,
	handle404,
    handlePostgresErrors,
} = require("./api/errors");

const { postComment, getComments } = require("./api/controllers/comments.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getComments);

app.use(express.json())

app.post("/api/articles/:article_id/comments", postComment);

app.all("*", handleBadPath);

app.use(handlePostgresErrors)
app.use(handle404);
app.use(handleServerErrors);

module.exports = app;
