const { checkArticle } = require("../models/article.models");
const { selectComments } = require("../models/comments.models");

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
