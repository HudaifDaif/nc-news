exports.handleBadPath = (req, res, next) => {
	res.status(404).send({ msg: "Not Found" });
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal Server Error" });
};

exports.handleCustomErrors = (err, req, res, next) => {
	if (err.status === 404) res.status(404).send({ msg: "Not Found" });
	else if (err.status === 400) res.status(400).send({ msg: "Bad Request" });
	else next(err);
};

exports.handlePostgresErrors = (err, req, res, next) => {
	if (err.code === "22P02" || err.code === "23502" || err.code === "42703") {
		res.status(400).send({ msg: "Bad Request" });
	} else if (err.code === "23503") {
		res.status(404).send({ msg: "Not Found" });
	} else next(err);
};
