const { checkArticle } = require("../models/article.models");
const { checkUser } = require("../models/authors.models");
const { selectComments, insertComments } = require("../models/comments.models");

exports.getComments = (req, res, next) => {
	article_id = req.params.article_id;

	const promises = [selectComments(article_id)];

	if (article_id) {
		promises.push(checkArticle(article_id));
	}

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
		.then(([resolved]) => {
			const comment = resolved[0];
			res.status(200).send({ comment });
		})
		.catch(next);
};
