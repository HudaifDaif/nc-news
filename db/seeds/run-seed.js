const {
	topicData,
	userData,
	articleData,
	commentData,
} = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
	return seed(topicData, userData, articleData, commentData).then(() =>
		db.end()
	);
};

runSeed();
