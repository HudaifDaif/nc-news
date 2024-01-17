const {
	selectArticles,
	updateArticle,
	insertArticle,
	getArticleCount,
} = require("../models/article.models");
const { checkTopic } = require("../models/topics.models");

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;

	selectArticles(id)
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
	const { topic, sort_by, order, limit, p: page } = req.query;

	const promises = [
		selectArticles(null, topic, sort_by, order, limit, page),
		getArticleCount(limit || 10, topic),
	];

	topic && promises.push(checkTopic(topic));

	Promise.all(promises)
		.then(([articles, [total_count, pages]]) => {
			res.status(200).send({ articles, total_count, pages });
		})
		.catch(next);
};

exports.patchArticleById = (req, res, next) => {
	const id = req.params.article_id;
	const votes = req.body.inc_votes;
	const username = req.body.username;

	updateArticle(votes, id, username)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

exports.postArticle = (req, res, next) => {
	const { author, title, body, topic, article_img_url } = req.body;

	insertArticle(author, title, body, topic, article_img_url)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};
