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

		describe("GET /api/articles/:article_id/comments", () => {
			it("200: should respond with an object containing an array of comment objects on the key of comments", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						body.comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
								article_id: 1,
							});
						});
					});
			});
			it("200: should return the comments sorted by most recent first", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						const dateCorrected = body.comments.map((comment) => {
							comment.created_at = Date.parse(comment.created_at);
							return comment;
						});
						expect(dateCorrected).toBeSortedBy("created_at", {
							descending: true,
						});
					});
			});

			it("404: should respond with a message of 'Not Found' when given an article_id that does not exist in the table", () => {
				return request(app)
					.get("/api/articles/999999/comments")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Not Found");
					});
			});
			it("200: should respond with an empty array on the comments key where the article_id exists but is not associated with any comments", () => {
				return request(app)
					.get("/api/articles/7/comments")
					.expect(200)
					.then(({ body }) => {
						expect(body).toMatchObject({ comments: [] });
					});
			});
			it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
				return request(app)
					.get("/api/articles/str/comments")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});
		});
	});
});

describe("PATCH /api/articles/:article_id", () => {
	it("200: should respond with an article object with the value of the request object's inc_votes property", () => {
		return request(app)
			.get("/api/articles/2")
			.expect(200)
			.then(({ body }) => {
				let getBody = body;

				return request(app)
					.patch("/api/articles/2")
					.send({
						inc_votes: 3,
					})
					.expect(200)
					.then(({ body }) => {
						let patchBody = body;

						expect(patchBody.article.votes).toBe(
							getBody.article.votes + 3
						);
					});
			});
	});
	it("200: should be able to decrement votes when given a negative value", () => {
		return request(app)
			.get("/api/articles/2")
			.expect(200)
			.then(({ body }) => {
				let getBody = body;

				return request(app)
					.patch("/api/articles/2")
					.send({
						inc_votes: -25,
					})
					.expect(200)
					.then(({ body }) => {
						let patchBody = body;

						expect(patchBody.article.votes).toBe(
							getBody.article.votes - 25
						);
					});
			});
	});
	it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
		return request(app)
			.patch("/api/articles/999999")
			.expect(404)
			.send({
				inc_votes: 0,
			})
			.then(({ body }) => {
				expect(body.msg).toBe("Not Found");
			});
	});
	it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
		return request(app)
			.patch("/api/articles/str")
			.expect(400)
			.send({
				inc_votes: 0,
			})
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request");
			});
	});
	it("400: should respond with a message of 'Bad Request' when not given the correct object properties", () => {
		return request(app)
			.patch("/api/articles/2")
			.expect(400)
			.send({
				votes: 0,
			})
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request");
			});
	});
	it("400: should respond with a message of 'Bad Request' when given an incorrect data type on the correct key", () => {
		return request(app)
			.patch("/api/articles/2")
			.expect(400)
			.send({
				inc_votes: "str",
			})
			.then(({ body }) => {
				expect(body.msg).toBe("Bad Request");
			});
	});
});
