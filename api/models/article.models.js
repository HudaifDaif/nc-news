const db = require("../../db/connection");

exports.checkArticle = (article_id) => {
	return db
		.query(
			`
    SELECT * FROM articles
    WHERE article_id = $1
    ;`,
			[article_id]
		)
		.then(({ rows }) => {
			if (!rows.length) return Promise.reject({ status: 404 });
		});
};

exports.selectArticleById = (id) => {
	return db
		.query(
			`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`,
			[id]
		)
		.then(({ rows }) => rows);
};

exports.selectArticles = () => {
	return db.query(`
        SELECT title, articles.author, articles.article_id, topic,
        articles.created_at, articles.votes, article_img_url,
        COUNT(comments.comment_id) AS comment_count
        FROM articles
        LEFT OUTER JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY title, articles.author, articles.article_id
        ORDER BY articles.created_at DESC
        ;`);
};

exports.updateArticle = (votes, id) => {
	return db
		.query(
			`
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        ;`,
			[votes, id]
		)
		.then(({ rows }) => rows[0]);
};
