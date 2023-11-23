const db = require("../../db/connection");

exports.checkUser = (username) => {
	return db
		.query(
			`
    SELECT * FROM users
    WHERE username = $1
    ;`,
			[username]
		)
		.then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404 });
		});
};
