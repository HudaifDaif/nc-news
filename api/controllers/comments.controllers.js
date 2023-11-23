const { checkArticle } = require("../models/article.models");
const {
	selectCommentsById,
	insertComments,
	deleteCommentRowById,
	checkComment,
} = require("../models/comments.models");
const { checkUser } = require("../models/authors.models");

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

	Promise.all(promises).then(() => {
		res.status(204).send();
	}).catch(next);
};

exports.postComment = (req, res, next) => {
	article_id = req.params.article_id;
	author = req.body.username;
	body = req.body.body;

	const promises = [insertComments([article_id, author, body])];

	if (article_id && author) {
		promises.push(checkArticle(article_id));
		promises.push(checkUser(author));
	}

	Promise.all(promises)
		.then(([resolvedComment]) => {
			const comment = resolvedComment[0];
			res.status(200).send({ comment });
		})
		.catch(next);
};
