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

exports.updateCommentById = async (votes, comment_id, username) => {
	if (!Number(votes)) return Promise.reject({ status: 400 });

	const checkVote = await db.query(
		`
		SELECT * FROM votes
		WHERE username = $1
		AND comment_id = $2
		;`,
		[username, comment_id]
	);

	const userVote = checkVote.rows[0];
	const newVoteValue = userVote ? userVote.vote_value + votes : votes;

	if (newVoteValue === -1 || newVoteValue === 0 || newVoteValue === 1) {
		const formattedQuery = format(
			`
			UPDATE comments
			SET votes = votes + %s
			WHERE comment_id = %s
			RETURNING *
			;`,
			votes,
			comment_id
		);

		const { rows } = await db.query(formattedQuery);

		if (userVote) {
			await db.query(
				`
				UPDATE votes
				SET vote_value = %s
				WHERE username = %s
				AND comment_id = %s
				;`,
				[newVoteValue, username, comment_id]
			);
		} else {
			await db.query(
				`
				INSERT INTO votes
				(username, comment_id, vote_value)
				VALUES
				($1, $2, $3)
				;`,
				[username, comment_id, newVoteValue]
			);
		}

		return !rows.length ? Promise.reject({ status: 404 }) : rows[0];
	} else {
		return Promise.reject({ status: 400 });
	}
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
