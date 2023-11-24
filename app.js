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
const apiRouter = require("./routes/api-router");
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");
const topics = require("./db/data/test-data/topics");
const topicsRouter = require("./routes/topics-router");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

app.use("/api/topics", topicsRouter);

app.use("/api/users", usersRouter);

app.all("*", handleBadPath);

app.use(handlePostgresErrors);
app.use(handleCustomErrors);

app.use(handleServerErrors);
app.use(express.json());

module.exports = app;
