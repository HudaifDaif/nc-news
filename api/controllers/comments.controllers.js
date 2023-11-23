const { checkArticle } = require("../models/article.models");
const { checkUser } = require("../models/authors.models");
const {
	selectCommentsById,
	insertComments,
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
