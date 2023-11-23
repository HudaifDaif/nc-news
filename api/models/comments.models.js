const db = require("../../db/connection");

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
