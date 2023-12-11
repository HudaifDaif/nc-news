const express = require("express");
const cors = require("cors");
const {
	handleBadPath,
	handlePostgresErrors,
	handleCustomErrors,
	handleServerErrors,
} = require("./api/errors");
const apiRouter = require("./routes/api-router");
const articlesRouter = require("./routes/articles-router");
const usersRouter = require("./routes/users-router");
const commentsRouter = require("./routes/comments-router");
const topicsRouter = require("./routes/topics-router");

const app = express();

app.use(cors());
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

module.exports = app;
