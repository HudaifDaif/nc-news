const { selectTopics, selectArticleById } = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
	selectTopics().then(({ rows }) => {
		res.status(200).send({ topics: rows });
	});
};

exports.getArticleById = (req, res, next) => {
	selectArticleById(req)
		.then(({ rows }) => {
			if (!rows.length) {
				return Promise.reject({ status: 404 });
			}
			res.status(200).send({ article: rows[0] });
		})
		.catch(next);
};
