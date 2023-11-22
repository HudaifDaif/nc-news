const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const {
	topicData,
	userData,
	articleData,
	commentData,
} = require("../db/data/test-data");

const endpoints = require("../endpoints.json");

beforeEach(() => seed(topicData, userData, articleData, commentData));

afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET /api/topics", () => {
		it("200: should respond with an object containing topic objects with keys of 'slug' and 'description'", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					body.topics.forEach((topic) => {
						expect(topic).toMatchObject({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
		it("400: should respond with a message of 'Not Found' when the path is not a valid endpoint", () => {
			return request(app)
				.get("/api/topic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET api/articles/:article_id", () => {
		it("200: should respond with an object with a key of article, containing the corresponding article object", () => {
			return request(app)
				.get("/api/articles/12")
				.expect(200)
				.then(({ body }) => {
					expect(body.article).toMatchObject({
						author: expect.any(String),
						title: expect.any(String),
						article_id: 12,
						body: expect.any(String),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
					});
				});
		});
		it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
			return request(app)
				.get("/api/articles/9999999")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
		it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
			return request(app)
				.get("/api/articles/str")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
	});
});

describe("/api", () => {
	describe("GET /api", () => {
		it("200: should respond with an object describing all available endpoints of the api", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(body).toMatchObject(endpoints);
				});
		});
	});
});

describe("/api/articles", () => {
	describe("GET /api/articles", () => {
		it("200: should respond with an object with a key of articles containing all article objects", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(article).toMatchObject({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
						});
					});
				});
		});
		it("200: should respond with each object containing a comment_count property which represents the number of comments with the corresponding article_id of each article", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(Number(article.comment_count)).not.toBe(NaN);

						const verifyCommentCount = commentData.filter(
							(comment) => {
								return (
									comment.article_id === article.article_id
								);
							}
						).length;

						expect(Number(article.comment_count)).toBe(
							verifyCommentCount
						);
					});
				});
		});
		it("200: should return the articles sorted by date in descending order by default", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					const dateCorrected = body.articles.map((article) => {
						article.created_at = Date.parse(article.created_at);
						return article;
					});

					expect(dateCorrected).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});
		it("200: should return the articles with no body property", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(article).not.toHaveProperty("body");
					});
				});
		});
	});
});

describe("/api/articles/:article_id/comments", () => {
	describe("POST /api/articles/:article_id/comments", () => {
		it("200: should return a comment object for the posted comment", () => {
			return request(app)
				.post("/api/articles/3/comments")
				.send({
					username: "lurker",
					body: "Lorem ipsum",
				})
				.expect(200)
				.then(({ body }) => {
					expect(body.comment).toMatchObject({
						comment_id: expect.any(Number),
						body: "Lorem ipsum",
						votes: 0,
						author: "lurker",
						article_id: 3,
						created_at: expect.any(String),
					});
				});
		});
		it("200: should add the posted comment to the comments table", () => {
			return request(app)
				.post("/api/articles/3/comments")
				.send({
					username: "lurker",
					body: "-->This comment!!!<--",
				})
				.expect(200)
				.then(() => {
					return request(app)
						.get("/api/articles/3/comments")
						.expect(200)
						.then(({ body }) => {
							const [testComment] = body.comments.filter(
								(comment) => {
									return comment.author === "lurker" &&
										comment.body === "-->This comment!!!<--"
										? comment
										: null;
								}
							);

							expect(testComment).toMatchObject({
								comment_id: expect.any(Number),
								body: "-->This comment!!!<--",
								votes: 0,
								author: "lurker",
								article_id: 3,
								created_at: expect.any(String),
							});
						});
				});
		});
		it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
			return request(app)
				.post("/api/articles/999999/comments")
				.send({
					username: "lurker",
					body: "-->This comment!!!<--",
				})
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
		it("400: should respond with a message of 'Bad Request' if the article_id is not valid", () => {
			return request(app)
				.post("/api/articles/str/comments")
				.send({
					username: "lurker",
					body: "-->This comment!!!<--",
				})
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
		it("404: should respond with a message of 'Not Found' if the username is not associated to a user", () => {
			return request(app)
				.post("/api/articles/3/comments")
				.send({
					username: "imdefinitelylurker",
					body: "-->This comment!!!<--",
				})
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
		it("400: should return a message of Bad Request if any fields are missing", () => {
			return request(app)
				.post("/api/articles/3/comments")
				.send({
					body: "Lorem ipsum",
				})
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				})
				.then(() => {
					return request(app)
						.post("/api/articles/3/comments")
						.send({
							username: "imdefinitelylurker",
						})
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Bad Request");
						});
				})
				.then(() => {
					return request(app)
						.post("/api/articles/3/comments")
						.send({
							name: "imdefinitelylurker",
							comment: "Lorem ipsum",
						})
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Bad Request");
						});
				});
		});
	});
});
