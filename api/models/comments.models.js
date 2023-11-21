const db = require("../../db/connection");
const format = require("pg-format");

exports.selectComments = (article_id) => {
	article_id
		? (whereArticleId = `WHERE article_id = ${article_id}`)
		: (whereArticleId = "");

	const formattedComments = format(
		`
                SELECT * FROM comments
                %s
                ORDER BY created_at DESC
                ;`,
		whereArticleId
	);

	return db.query(formattedComments).then(({ rows }) => rows);
};
