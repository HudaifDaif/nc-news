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

beforeEach(() => seed(topicData, userData, articleData, commentData));

afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET /api/topics", () => {
		it("200: should return an object containing topic objects with keys of 'slug' and 'description'", () => {
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
		it("400: should return with a message of 'Bad Request' when the path is not a valid endpoint", () => {
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
