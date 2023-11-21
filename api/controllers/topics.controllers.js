const {
	selectTopics,
	listEndpoints,
} = require("../models/topics.models");

exports.getTopics = (req, res, next) => {
	selectTopics().then(({ rows }) => {
		res.status(200).send({ topics: rows });
	});
};

exports.getApi = (req, res, next) => {
	res.status(200).send(listEndpoints());
};
