exports.handleBadPath = (req, res, next) => {
	res.status(404).send({ msg: "Not Found" });
};

exports.handleServerErrors = (err, req, res, next) => {
	console.log(err);
	res.status(500).send({ msg: "Internal Server Error" });
};

exports.handle404 = (err, req, res, next) => {
	err.status === 404 ? res.status(404).send({ msg: "Not Found" }) : next(err);
};

exports.handlePostgresErrors = (err, req, res, next) => {
	if (err.code === "22P02" || err.code === "42703")
		res.status(400).send({ msg: "Bad Request" });
	else next(err);
};
