const {
	selectArticleById,
	selectArticles,
	updateArticle,
} = require("../models/article.models");

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;
	const hasCommentCount = req.query.comment_count === "true" ? true : false;

	const articleModel = hasCommentCount ? selectArticles : selectArticleById;

	articleModel(id)
		.then((rows) => {
			if (!rows.length) {
				return Promise.reject({ status: 404 });
			}
			const article = rows[0];
			
			if (article.comment_count)
				article.comment_count = Number(article.comment_count);
			
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.getArticles = (req, res, next) => {
	selectArticles().then((rows) => {
		res.status(200).send({ articles: rows });
	});
};

exports.patchArticleById = (req, res, next) => {
	const id = req.params.article_id;
	const votes = req.body.inc_votes;

	updateArticle(votes, id)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};
