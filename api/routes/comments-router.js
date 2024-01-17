const {
	deleteCommentById,
	postComment,
	patchCommentById,
} = require("../controllers/comments.controllers");

const commentsRouter = require("express").Router();

commentsRouter
	.route("/:comment_id")
	.post(postComment)
	.delete(deleteCommentById)
	.patch(patchCommentById)

module.exports = commentsRouter;
