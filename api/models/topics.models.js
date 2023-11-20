const db = require("../../db/connection");
const endpoints = require("../../endpoints");

exports.selectTopics = () => {
	return db.query(`
        SELECT * FROM topics
        ;`);
};

exports.listEndpoints = () => {
	return endpoints;
};
