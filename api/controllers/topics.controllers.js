const { selectTopics, selectArticleById ,listEndpoints, selectArticles} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
	selectTopics().then((rows) => {
		res.status(200).send({ topics: rows });
	});
};

exports.getArticleById = (req, res, next) => {
	id = req.params.article_id;

	selectArticleById(id)
		.then((rows) => {
			if (!rows.length) {
				return Promise.reject({ status: 404 });
			}
			res.status(200).send({ article: rows[0] });
		})
		.catch(next);
}

exports.getApi = (req, res, next) => {
	res.status(200).send(listEndpoints());
};

exports.getArticles = (req, res, next) => {
	selectArticles().then(({ rows }) => {
		res.status(200).send({ articles: rows });
	});
};
