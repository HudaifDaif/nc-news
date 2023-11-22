const { checkArticle } = require("../models/article.models");
const { selectCommentsById } = require("../models/comments.models");

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
