const {
	selectTopics,
	listEndpoints,
	selectArticles,
} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
	selectTopics().then(({ rows }) => {
		res.status(200).send({ topics: rows });
	});
};

exports.getApi = (req, res, next) => {
	res.status(200).send(listEndpoints());
};

exports.getArticles = (req, res, next) => {
	selectArticles().then(({ rows }) => {
		res.status(200).send({ articles: rows });
	});
};
