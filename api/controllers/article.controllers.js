const { selectArticles, updateArticle } = require("../models/article.models");
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
	const topic = req.query.topic;
	const sort = req.query.sort_by;
	const order = req.query.order;

	const promises = [selectArticles(null, topic, sort, order)];

	topic && promises.push(checkTopic(topic));

	Promise.all(promises)
		.then((resolved) => {
			const rows = resolved[0];
			res.status(200).send({ articles: rows });
		})
		.catch(next);
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
