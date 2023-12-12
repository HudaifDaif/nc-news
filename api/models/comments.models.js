const db = require("../../db/connection");
const format = require("pg-format");

exports.selectCommentsById = (article_id, limit, page) => {
	const limitClause = limit ? `LIMIT ${limit}` : `LIMIT 10`;
	const offsetClause = page
		? `OFFSET ${(limit || 10) * (page - 1)}`
		: `OFFSET 0`;

	const formattedQuery = format(
		`
            SELECT * FROM comments
            WHERE article_id = %s 
            ORDER BY created_at DESC
			%s
			%s
            ;`,
		article_id,
		limitClause,
		offsetClause
	);

	return db.query(formattedQuery).then(({ rows }) => rows);
};

exports.insertComments = (article_id, author, body) => {
	if (!/\w+/.test(author) || !/\w+/.test(body)) {
		return Promise.reject({ status: 400 });
	}

	const commentValues = [article_id, author, body];

	return db
		.query(
			`
			INSERT INTO comments
			(article_id, author, body)
			VALUES
			($1, $2, $3)
			RETURNING *
			;`,
			commentValues
		)
		.then(({ rows }) => rows);
};

exports.deleteCommentRowById = (id) => {
	return db.query(
		`
			DELETE FROM comments
			WHERE comment_id = $1
			;`,
		[id]
	);
};

exports.checkComment = (id) => {
	return db
		.query(
			`
			SELECT * FROM comments
			WHERE comment_id = $1
			;`,
			[id]
		)
		.then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404 });
		});
};

exports.updateCommentById = (votes, id) => {
	if (!Number(votes)) return Promise.reject({ status: 400 });

	const formattedQuery = format(
		`
		UPDATE comments
		SET votes = votes + %s
		WHERE comment_id = %s
		RETURNING *
		;`,
		votes,
		id
	);

	return db.query(formattedQuery).then(({ rows }) => {
		return rows.length ? rows[0] : Promise.reject({ status: 404 });
	});
};

exports.getCommentCount = (limit, article_id) => {
	return db
		.query(
			`
			SELECT count(*) FROM comments
			WHERE article_id = $1
			;`,
			[article_id]
		)
		.then(({ rows }) => [rows[0].count, Math.ceil(rows[0].count / limit)]);
};
