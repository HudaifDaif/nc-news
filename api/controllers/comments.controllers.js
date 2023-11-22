const { checkArticle } = require("../models/article.models");
const {
	selectCommentsById,
	deleteCommentRowById,
	checkComment,
} = require("../models/comments.models");

exports.getCommentsById = (req, res, next) => {
	article_id = req.params.article_id;

	const promises = [selectCommentsById(article_id), checkArticle(article_id)];

	Promise.all(promises)
		.then((resolved) => {
			const comments = resolved[0];
			res.status(200).send({ comments });
		})
		.catch(next);
};

exports.deleteCommentById = (req, res, next) => {
	comment_id = req.params.comment_id;

	const promises = [
		deleteCommentRowById(comment_id),
		checkComment(comment_id),
	];

	Promise.all(promises)
		.then(() => {
			res.status(204).send();
		})
		.catch(next);
};
