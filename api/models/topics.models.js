const db = require("../../db/connection");

exports.selectTopics = () => {
	return db.query(`
        SELECT * FROM topics
        ;`);
};

exports.selectArticleById = (req) => {
	id = req.params.article_id;
        
	return db.query(
		`
        SELECT * FROM articles
        WHERE article_id = $1
        ;`,
		[id]
	);
};
