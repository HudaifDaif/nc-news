const db = require("../../db/connection");
const format = require("pg-format");

exports.selectCommentsById = (article_id) => {
	return db
		.query(
			`
            SELECT * FROM comments
            WHERE article_id = $1 
            ORDER BY created_at DESC
            ;`,
			[article_id]
		)
		.then(({ rows }) => rows);
};

exports.insertComments = (commentValues) => {
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
