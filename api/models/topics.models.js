const db = require("../../db/connection");

exports.selectTopics = () => {
	return db
		.query(
			`
        SELECT * FROM topics
        ;`
		)
		.then(({ rows }) => rows);
};

exports.checkTopic = (topic) => {
	return db
		.query(
			`
			SELECT * FROM topics
			WHERE slug = $1
			;`,
			[topic]
		)
		.then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404 });
		});
};
