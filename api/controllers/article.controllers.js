const { selectArticleById, selectArticles, updateArticle } = require("../models/article.models");

exports.getArticleById = (req, res, next) => {
	const id = req.params.article_id;

	selectArticleById(id)
		.then((rows) => {
			if (!rows.length) {
				return Promise.reject({ status: 404 });
			}
			res.status(200).send({ article: rows[0] });
		})
		.catch(next);
};

exports.getArticles = (req, res, next) => {
	selectArticles().then(({ rows }) => {
		res.status(200).send({ articles: rows });
	});
};

exports.patchArticleById = (req, res, next) => {
   const id = req.params.article_id;
    const votes = req.body.inc_votes
    
    updateArticle(votes, id).then(article => {
        res.status(200).send({article})
    })
}