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
					body.articles.forEach(article => {
					expect(article).not.toHaveProperty("body");
				})
				});
		});
	});
});
