exports.handleBadPath = (req, res, next) => {
	res.status(400).send({ msg: "Bad Request" });
};

exports.handleServerErrors = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ msg:"Internal Server Error"})
}