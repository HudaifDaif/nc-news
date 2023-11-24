const db = require("../../db/connection");
const format = require("pg-format");

exports.selectUsers = (username) => {
	whereUser = username ? `WHERE username = '${username}'` : ``;

	const formattedQuery = format(
		`
	SELECT * FROM users
	%s
	;`,
		whereUser
	);

	return db.query(formattedQuery).then(({ rows }) => {
		if (!rows.length) return Promise.reject({ status: 404 });

		return rows.length > 1 ? { users: rows } : { user: rows[0] };
	});
};
