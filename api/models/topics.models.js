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
