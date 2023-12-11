const { checkArticle } = require("../models/article.models");
const {
	selectCommentsById,
	insertComments,
	deleteCommentRowById,
	checkComment,
	updateCommentById,
	getCommentCount,
} = require("../models/comments.models");
const { checkUser } = require("../models/authors.models");

exports.getCommentsById = (req, res, next) => {
	article_id = req.params.article_id;
	const { limit, p: page } = req.query;

	const promises = [
		selectCommentsById(article_id, limit, page),
		getCommentCount(limit || 10, article_id),
		checkArticle(article_id),
	];

	Promise.all(promises)
		.then((resolved) => {
			const comments = resolved[0];
			const [total_count, pages] = resolved[1];

			if (page > pages) return Promise.reject({ status: 404 });
			res.status(200).send({ comments, total_count, pages });
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

exports.patchCommentById = (req, res, next) => {
	const votes = req.body.inc_votes;
	const id = req.params.comment_id;

	updateCommentById(votes, id)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};
